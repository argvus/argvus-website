import { spawn } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { parse } from 'yaml'
import siteConfig from '../src/site-config.json' with { type: 'json' }

const postsDirectory = path.resolve('src/content/news')
const editor = siteConfig.news?.editor?.trim()

if (!editor) {
  throw new Error('Editor não configurado. Defina news.editor em src/site-config.json.')
}
if (!stdin.isTTY || !stdout.isTTY) {
  throw new Error('Este comando precisa de um terminal interativo para selecionar o post.')
}

const entries = await readdir(postsDirectory, { withFileTypes: true }).catch((error) => {
  if (error.code === 'ENOENT') return []
  throw error
})
const posts = await Promise.all(entries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map(async ({ name }) => {
    const content = await readFile(path.join(postsDirectory, name), 'utf8')
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (!match) throw new Error(`Front matter ausente ou inválido em ${name}`)
    const metadata = parse(match[1]) ?? {}
    const slug = name.slice(0, -'.md'.length)
    return { filename: name, slug, title: metadata.title?.trim() || slug }
  }))
posts.sort((a, b) => a.slug.localeCompare(b.slug))

if (posts.length === 0) {
  console.log('Nenhum post em inglês disponível para editar.')
  process.exit(0)
}

const readline = createInterface({ input: stdin, output: stdout })
let selected
try {
  console.log('\nPosts disponíveis para edição:')
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
      console.log('Edição cancelada.')
      process.exit(0)
    }
    selected = posts[choice - 1]
    if (!selected) console.log(`Opção inválida. Digite um número de 0 a ${posts.length}.`)
  }
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('\nEdição cancelada.')
    process.exit(0)
  }
  throw error
} finally {
  readline.close()
}

const filePath = path.join(postsDirectory, selected.filename)
const child = spawn(editor, [filePath], { stdio: 'inherit' })
let spawnFailed = false
child.on('error', (error) => {
  spawnFailed = true
  if (error.code === 'ENOENT') {
    console.error(`Editor não encontrado: ${editor}. Confira news.editor em src/site-config.json.`)
    process.exitCode = 1
    return
  }
  console.error(`Não foi possível iniciar o editor: ${error.message}`)
  process.exitCode = 1
})
child.on('close', (code, signal) => {
  if (spawnFailed) return
  if (signal) {
    console.error(`O editor foi encerrado pelo sinal ${signal}.`)
    process.exitCode = 1
  } else if (code !== 0) {
    process.exitCode = code ?? 1
  }
})
