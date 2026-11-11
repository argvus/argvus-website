import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { stringify } from 'yaml'

const postsDirectory = path.resolve('src/content/news')

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function localDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

let title = process.argv.slice(2).join(' ').trim()
if (!title) {
  if (!stdin.isTTY) {
    throw new Error('Informe um título: npm run create:post -- "Título do post"')
  }
  const prompt = createInterface({ input: stdin, output: stdout })
  const answer = await prompt.question('Título do post: ')
  prompt.close()
  title = answer.trim()
}

if (!title) throw new Error('O título do post não pode ficar vazio.')
const slug = slugify(title)
if (!slug) throw new Error('O título precisa conter ao menos uma letra ou número para gerar o slug.')

await mkdir(postsDirectory, { recursive: true })
const filePath = path.join(postsDirectory, `${slug}.md`)
try {
  await access(filePath)
  throw new Error(`O post já existe: ${path.relative(process.cwd(), filePath)}`)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const frontmatter = stringify({ author: { name: '', link: '' }, title, description: '', date: localDate(), tags: [] }).trimEnd()
const content = `---\n${frontmatter}\n---\n\n`
await writeFile(filePath, content, { flag: 'wx' })
console.log(`Post criado em ${path.relative(process.cwd(), filePath)}`)
