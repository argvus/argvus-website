import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { loadDocumentation } from '../src/lib/documentation/loader.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

/** Quotes a YAML scalar value so frontmatter stays valid regardless of its content. */
function yamlString(value: string): string {
  return JSON.stringify(value)
}

async function generateDocs() {
  try {
    const entries = await loadDocumentation()

    // Create and clean the target directory. The docs collection lives at
    // `src/content/docs/` and must mirror exactly the slug Starlight expects:
    // no prefix for the root locale, `pt/` for Portuguese.
    const docsDir = resolve(projectRoot, 'src/content/docs')

    if (existsSync(docsDir)) {
      const entriesOnDisk = readdirSync(docsDir)
      for (const name of entriesOnDisk) {
        if (name !== '.gitkeep') {
          rmSync(resolve(docsDir, name), { recursive: true, force: true })
        }
      }
    }

    mkdirSync(docsDir, { recursive: true })

    for (const entry of entries) {
      // entry.slug already encodes the full target path relative to docsDir,
      // including the `pt/` locale prefix when applicable (see loader.ts).
      const targetPath = resolve(docsDir, `${entry.slug}.md`)
      const targetDir = targetPath.substring(0, targetPath.lastIndexOf('/'))
      mkdirSync(targetDir, { recursive: true })

      const title = entry.data.title || 'Untitled'
      const description = entry.data.description || ''
      const markdown = `---
title: ${yamlString(String(title))}
description: ${yamlString(String(description))}
---

${entry.body}`

      writeFileSync(targetPath, markdown, 'utf-8')
      console.log(`Generated: ${entry.slug}`)
    }

    console.log(`\n✓ Generated ${entries.length} documentation files`)
  } catch (error) {
    console.error('Error generating documentation files:', error)
    process.exit(1)
  }
}

generateDocs()
