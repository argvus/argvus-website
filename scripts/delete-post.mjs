import { readdir, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { parse } from 'yaml'
import locales from '../src/lib/site-languages.json' with { type: 'json' }

const postsDirectory = path.resolve('src/content/news')

function readPostMetadata(content, filename) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) throw new Error(`Front matter ausente ou inválido em ${filename}`)
  return parse(match[1]) ?? {}
}

if (!stdin.isTTY || !stdout.isTTY) {
  throw new Error('Este comando precisa de um terminal interativo para selecionar e confirmar o post.')
}

const entries = await readdir(postsDirectory, { withFileTypes: true }).catch((error) => {
  if (error.code === 'ENOENT') return []
  throw error
})
const posts = await Promise.all(entries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map(async ({ name }) => {
    const slug = name.slice(0, -'.md'.length)
    const metadata = readPostMetadata(await readFile(path.join(postsDirectory, name), 'utf8'), name)
    return { filename: name, slug, title: metadata.title?.trim() || slug }
  }))
posts.sort((a, b) => a.slug.localeCompare(b.slug))

if (posts.length === 0) {
  console.log('Nenhum post em inglês disponível para excluir.')
  process.exit(0)
}

const readline = createInterface({ input: stdin, output: stdout })
let selected
try {
  console.log('\nPosts disponíveis para exclusão:')
  posts.forEach(({ title, slug }, index) => {
    const suffix = title.toLowerCase() === slug.toLowerCase() ? '' : ` [${slug}]`
    console.log(`${index + 1} - ${title}${suffix}`)
  })
  console.log('0 - cancelar')

  while (!selected) {
    const answer = (await readline.question('\nEscolha um post: ')).trim()
    if (!/^\d+$/.test(answer)) {
      console.log(`Opção inválida. Digite um número de 0 a ${posts.length}.`)
      continue
    }
    const choice = Number(answer)
    if (choice === 0) {
      console.log('Exclusão cancelada.')
      process.exit(0)
    }
    selected = posts[choice - 1]
    if (!selected) console.log(`Opção inválida. Digite um número de 0 a ${posts.length}.`)
  }

  console.log(`\nO post "${selected.title}" (${selected.slug}) e todas as traduções existentes serão removidos.`)
  const confirmation = (await readline.question('Digite "s" para confirmar: ')).trim().toLowerCase()
  if (confirmation !== 's') {
    console.log('Exclusão cancelada.')
    process.exit(0)
  }
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('\nExclusão cancelada.')
    process.exit(0)
  }
  throw error
} finally {
  readline.close()
}

const filesToDelete = [
  path.join(postsDirectory, selected.filename),
  ...locales
    .filter(({ code }) => code !== 'en')
    .map(({ code }) => path.join(postsDirectory, code, selected.filename)),
]
let deletedCount = 0
for (const filePath of filesToDelete) {
  try {
    await rm(filePath)
    deletedCount += 1
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}
console.log(`Post removido: ${selected.slug} (${deletedCount} arquivo(s)).`)
