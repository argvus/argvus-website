import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { loadDocumentation } from '../src/lib/documentation/loader.ts'
import { wrapTables } from '../src/lib/documentation/table-scroll.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const supportedHtmlTags = new Set([
  'a', 'abbr', 'b', 'bdi', 'bdo', 'blockquote', 'br', 'caption', 'cite', 'code', 'dd',
  'del', 'details', 'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins', 'kbd', 'li', 'ol', 'p', 'pre', 'q', 'rp',
  'rt', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'summary', 'sup', 'table',
  'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul', 'var',
])

/** Quotes a YAML scalar value so frontmatter stays valid regardless of its content. */
function yamlString(value: string): string {
  return JSON.stringify(value)
}

function normalizeMarkdownBody(body: string): string {
  const codeSegments: string[] = []
  const preserveCode = (segment: string) => {
    const index = codeSegments.push(segment) - 1
    return `\u0000CODE${index}\u0000`
  }

  const markdown = wrapTables(body)
    .replace(/^([ \t]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\2[ \t]*$/gm, preserveCode)
    .replace(/(`+)(?!`)[^\n]*?\1(?!`)/g, preserveCode)
    .replace(/(?<!`)blocks set <block> <enabled\|disabled>(?!`)/g, '`blocks set <block> <enabled|disabled>`')
    .replace(/(?<!`)\{"action":"toggle"\}(?!`)/g, '`{"action":"toggle"}`')
    .replace(/(?<!`)\{"action":toggle"\}(?!`)/g, '`{"action":"toggle"}`')
    .replace(/\$\{([^}]*)\}/g, (_match, expression: string) => '$&#123;' + expression + '&#125;')
    .replace(/<(\/?)([\p{L}][\p{L}\p{N}_-]*)([^>]*)>/gu, (match, _slash, tag: string) =>
      supportedHtmlTags.has(tag.toLowerCase())
        ? match
        : match.replace('<', '&lt;').replace(/>$/, '&gt;'),
    )

  return markdown.replace(/\u0000CODE(\d+)\u0000/g, (_match, index: string) => codeSegments[Number(index)] ?? '')
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
      // Repair malformed upstream placeholders outside code spans. In
      // particular, a translated Japanese page has an unquoted pipe example
      // and some Japanese/Korean pages contain `<surface>` outside code spans.
      const body = normalizeMarkdownBody(entry.body)

      const markdown = `---
title: ${yamlString(String(title))}
description: ${yamlString(String(description))}
---

${body}`

      writeFileSync(targetPath, markdown, 'utf-8')
      console.log(`Generated: ${entry.slug}`)

      // Keep the introduction content available at the documentation root.
      // The copied entry retains its locale prefix (for example `pt/docs`).
      if (entry.slug.endsWith('/docs/introduction') || entry.slug === 'docs/introduction') {
        const homePath = resolve(docsDir, `${entry.slug.replace(/introduction$/, 'index')}.md`)
        writeFileSync(homePath, markdown, 'utf-8')
        console.log(`Generated: ${entry.slug.replace(/introduction$/, 'index')}`)
      }
    }

    console.log(`\n✓ Generated ${entries.length} documentation files`)
  } catch (error) {
    console.error('Error generating documentation files:', error)
    process.exit(1)
  }
}

generateDocs()
