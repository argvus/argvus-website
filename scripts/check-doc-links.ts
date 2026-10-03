import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadDocumentation, type ContentEntry } from '../src/lib/documentation/loader.ts'

/**
 * Checks every internal link of the documentation against the routes the site
 * will actually serve, so a broken link fails the build instead of reaching a
 * 404 in production.
 *
 * Routes come from the same loader the site uses (`loadDocumentation`), so the
 * slug rules (user-guide folders, `index.md` collapsing, `pt/` prefix) are
 * never duplicated here. Relative links are resolved the way a browser resolves
 * them from the rendered page URL `/<slug>/`, which is what Starlight serves.
 */

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

/** Site routes that are not documentation entries (the landing pages). */
const SITE_ROUTES = ['/', '/pt/']

/** Extensions treated as assets rather than pages. They are not route-checked. */
const ASSET_EXTENSION = /\.(png|jpe?g|gif|webp|svg|jxl|mp4|mp3|pdf|tar\.gz|zip|sh|conf|lua|json|toml)$/i

interface Finding {
  source: string
  line: number
  link: string
  resolved: string
}

interface LinkOccurrence {
  link: string
  line: number
}

/** The public URL a documentation entry is served at, e.g. `/docs/argvus-appearance/wallpapers/`. */
function pageUrl(entry: ContentEntry): string {
  return `/${entry.slug}/`
}

/** Drops a trailing slash so `/docs/x/` and `/docs/x` compare equal. */
function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

/** Returns every markdown link target, skipping fenced code blocks and inline code. */
export function extractLinks(body: string): LinkOccurrence[] {
  const occurrences: LinkOccurrence[] = []
  let inFence = false

  body.split('\n').forEach((text, index) => {
    if (/^\s*```/.test(text)) {
      inFence = !inFence
      return
    }
    if (inFence) return

    const withoutCode = text.replace(/`[^`]*`/g, '')
    for (const match of withoutCode.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      occurrences.push({ link: match[1], line: index + 1 })
    }
  })

  return occurrences
}

/** Resolves a link against the page URL. Returns null for links that are not internal routes. */
export function resolveLink(link: string, fromUrl: string): string | null {
  if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('//')) return null
  if (link.startsWith('#')) return null

  const withoutAnchor = link.split('#')[0].split('?')[0]
  if (withoutAnchor === '') return null
  if (ASSET_EXTENSION.test(withoutAnchor)) return null

  if (withoutAnchor.startsWith('/')) return normalizePath(withoutAnchor)

  const base = new URL(fromUrl, 'https://site.invalid')
  return normalizePath(new URL(withoutAnchor, base).pathname)
}

/** Landing-page links written as `link('docs/...')` or `href="/..."` in the Astro sources. */
function collectSiteSourceLinks(dir: string, found: Finding[] = []): Finding[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      collectSiteSourceLinks(path, found)
      continue
    }
    if (!name.endsWith('.astro')) continue

    const lines = readFileSync(path, 'utf-8').split('\n')
    lines.forEach((text, index) => {
      for (const match of text.matchAll(/link\('([^']*)'\)/g)) {
        const target = match[1]
        const resolved = `/${target}`
        found.push({ source: relative(projectRoot, path), line: index + 1, link: target, resolved })
      }
    })
  }
  return found
}

function findBrokenLinks(entries: ContentEntry[]): Finding[] {
  const routes = new Set<string>([
    ...SITE_ROUTES.map(normalizePath),
    ...entries.map((entry) => normalizePath(pageUrl(entry))),
  ])

  const broken: Finding[] = []

  for (const entry of entries) {
    const fromUrl = pageUrl(entry)
    for (const occurrence of extractLinks(entry.body)) {
      const resolved = resolveLink(occurrence.link, fromUrl)
      if (resolved === null) continue
      if (!routes.has(resolved)) {
        broken.push({
          source: `${entry.project}/${entry.filePath}`,
          line: occurrence.line,
          link: occurrence.link,
          resolved,
        })
      }
    }
  }

  const siteLinks = collectSiteSourceLinks(join(projectRoot, 'src'))
  for (const site of siteLinks) {
    if (ASSET_EXTENSION.test(site.link)) continue
    if (!routes.has(normalizePath(site.resolved))) broken.push(site)
  }

  return broken
}

/** Loads the documentation and returns every internal link that would 404. */
export async function checkDocLinks(): Promise<{ checked: number; broken: Finding[] }> {
  const entries = await loadDocumentation()
  const broken = findBrokenLinks(entries)
  const checked = entries.reduce((total, entry) => total + extractLinks(entry.body).length, 0)
  return { checked, broken }
}

async function main(): Promise<void> {
  if (process.argv.includes('--routes')) {
    const entries = await loadDocumentation()
    for (const entry of entries) console.log(`${pageUrl(entry)}\t${entry.project}/${entry.filePath}`)
    return
  }

  const { checked, broken } = await checkDocLinks()

  if (broken.length === 0) {
    console.log(`✓ ${checked} documentation links checked, none broken`)
    return
  }

  console.error(`✗ ${broken.length} broken internal link(s) out of ${checked} checked:`)
  for (const finding of broken) {
    console.error(`  ${finding.source}:${finding.line}  ${finding.link}  →  ${finding.resolved}`)
  }
  process.exit(1)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
