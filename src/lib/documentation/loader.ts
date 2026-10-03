import { getDocumentationConfig, type ProjectConfig } from './config.ts'
import { createProviderFromUrl } from './providers/factory.ts'
import type { DocumentationProvider, FileEntry } from './providers/base.ts'
import { LocalFileProvider } from './providers/local.ts'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export interface ContentEntry {
  id: string
  slug: string
  body: string
  filePath: string
  /** Source repository this entry came from (e.g. `argvus-boot-splash`). */
  project: string
  /** Whether this entry's project is configured as the root (prefix-less) docs project. */
  isRootProject: boolean
  /** Source locale directory this entry was read from (`en` or `pt-br`). */
  sourceLocale: 'en' | 'pt-br'
  data: {
    title?: string
    description?: string
    [key: string]: unknown
  }
}

interface FrontmatterMatch {
  data: Record<string, unknown>
  body: string
}

function parseFrontmatterValue(value: string): unknown {
  const trimmed = value.trim()

  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null') return null

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }

  if (!Number.isNaN(Number(trimmed)) && trimmed !== '') {
    return Number(trimmed)
  }

  return trimmed
}

function parseFrontmatter(content: string): FrontmatterMatch {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/

  const match = content.match(frontmatterRegex)

  if (!match) {
    return { data: {}, body: content }
  }

  const [, frontmatterStr, body] = match
  const data: Record<string, unknown> = {}
  let currentKey = ''
  let currentValue = ''

  for (const line of frontmatterStr.split('\n')) {
    if (line.trim() === '') continue

    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) {
      if (currentKey) {
        currentValue += '\n' + line
      }
      continue
    }

    if (currentKey) {
      data[currentKey] = parseFrontmatterValue(currentValue)
    }

    currentKey = line.substring(0, colonIndex).trim()
    currentValue = line.substring(colonIndex + 1).trim()
  }

  if (currentKey) {
    data[currentKey] = parseFrontmatterValue(currentValue)
  }

  return { data, body }
}

async function listMarkdownFiles(
  provider: DocumentationProvider,
  repository: string,
  dirPath: string,
  branch: string,
): Promise<string[]> {
  const files: string[] = []

  async function traverse(currentPath: string): Promise<void> {
    try {
      const entries = await provider.listFiles(repository, currentPath, branch)

      for (const entry of entries) {
        if (entry.type === 'file' && entry.path.endsWith('.md')) {
          files.push(entry.path)
        } else if (entry.type === 'dir') {
          await traverse(entry.path)
        }
      }
    } catch (error) {
      // Silently skip directories that don't exist or can't be read
      // This allows projects without documentation to be skipped gracefully
      return
    }
  }

  try {
    await traverse(dirPath)
  } catch (error) {
    // If the root docs directory doesn't exist, return empty array
    console.debug(`No documentation found for ${repository} at ${dirPath}`)
    return []
  }

  return files
}

/**
 * Computes the final Starlight-compatible slug for a documentation entry.
 *
 * Starlight determines a page's locale from the FIRST path segment of its
 * slug, matching it against the keys configured in `starlight({ locales })`.
 * With `locales: { root: {...}, pt: {...} }`, that means:
 *   - root locale (English) entries must have NO locale prefix at all.
 *   - `pt` locale (Portuguese) entries must be prefixed with `pt/`.
 *
 * Non-root projects are namespaced under their own project slug
 * (e.g. `docs/argvus-boot-splash/user-guide/installation`). The project
 * marked as `root` in site-config.json (normally `argvus`) is served
 * without any project prefix, so `docs/en/introduction.md` becomes
 * `/docs/introduction/`.
 *
 * Every page is nested under a literal leading `docs/` segment: Starlight
 * always serves the content collection at the site root, so the only way
 * to publish it under the `/docs/` path (as the ARGVUS site requires) is to
 * make `docs` part of the slug itself.
 *
 * Index files (`index.md`, or any `<dir>/index.md`) collapse onto their
 * parent path, matching the convention `slugToParam` already applies when
 * Starlight turns a slug into a URL.
 */
function generateSlug(
  project: string,
  filePath: string,
  isRoot: boolean,
): string {
  const parts = filePath.split('/')
  const sourceLocale = parts[1]
  const relPath = parts.slice(2).join('/').replace(/\.md$/, '')

  const cleanedRelPath = relPath === 'index' ? '' : relPath.replace(/\/index$/, '')

  let base: string
  if (isRoot) {
    base = cleanedRelPath || 'index'
  } else {
    base = cleanedRelPath ? `${project}/${cleanedRelPath}` : project
  }

  // Map the source repository locale directory to the Starlight locale key.
  const localePrefix = sourceLocale === 'pt-br' ? 'pt/' : ''

  return `${localePrefix}docs/${base}`.toLowerCase()
}

export async function loadDocumentation(): Promise<ContentEntry[]> {
  const config = getDocumentationConfig()
  const entries: ContentEntry[] = []

  for (const projectConfig of config.projects) {
    try {
      let provider: DocumentationProvider

      const localDeDir = resolve(process.cwd(), '../../de')
      const localRepositoryPath = resolve(localDeDir, projectConfig.repository)
      const useLocal = existsSync(localRepositoryPath)

      if (useLocal) {
        provider = new LocalFileProvider(localDeDir)
        console.log(
          `Loading documentation for ${projectConfig.repository} from local filesystem at ${localRepositoryPath}`,
        )
      } else {
        provider = createProviderFromUrl(config.url_base)
        console.log(
          `Loading documentation for ${projectConfig.repository} from ${config.url_base}/${projectConfig.repository}`,
        )
      }

      const mdFiles = await listMarkdownFiles(
        provider,
        projectConfig.repository,
        projectConfig.path,
        projectConfig.branch,
      )

      // Skip project if no documentation files found
      if (mdFiles.length === 0) {
        console.debug(`No documentation files found for ${projectConfig.repository}`)
        continue
      }

      for (const filePath of mdFiles) {
        try {
          const file = await provider.fetchFile(
            projectConfig.repository,
            filePath,
            projectConfig.branch,
          )

          const pathParts = filePath.split('/')
          const locale = pathParts[1]

          if (locale !== 'en' && locale !== 'pt-br') {
            console.warn(`Skipping file with unknown locale: ${filePath}`)
            continue
          }

          const { data, body } = parseFrontmatter(file.content)

          const slug = generateSlug(
            projectConfig.repository,
            filePath,
            Boolean(projectConfig.root),
          )
          const id = slug

          const title = (data.title as string) || ''
          const description = (data.description as string) || ''

          if (!title) {
            console.warn(
              `Warning: No title for ${slug}. Frontmatter data:`,
              JSON.stringify(data),
            )
          }

          entries.push({
            id,
            slug,
            body,
            filePath: filePath,
            project: projectConfig.repository,
            isRootProject: Boolean(projectConfig.root),
            sourceLocale: locale as 'en' | 'pt-br',
            data: {
              title,
              description,
              ...data,
            },
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          console.error(
            `Failed to fetch ${filePath} for ${projectConfig.repository}: ${errorMessage}`,
          )
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.warn(
        `Skipping ${projectConfig.repository} due to error: ${errorMessage}`,
      )
      // Continue to next project instead of failing
      continue
    }
  }

  console.log(`Loaded ${entries.length} documentation entries`)
  return entries
}
