import { spawn, spawnSync } from 'node:child_process'
import { readdir, readFile, mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { parse, stringify } from 'yaml'
import locales from '../src/lib/site-languages.json' with { type: 'json' }
import siteConfig from '../src/site-config.json' with { type: 'json' }

const postsDirectory = path.resolve('src/content/news')
const translationConfig = siteConfig.news?.translate
const providers = {
  opencode: {
    label: 'OpenCode',
    command: 'opencode',
    install: 'https://opencode.ai/docs/',
    modelConfig: 'opencode',
    args: (prompt, model, sourceFile) => [
      'run', '--agent', 'news-translator',
      '--format', 'default', '--file', sourceFile,
      ...(model ? ['--model', model] : []),
      prompt,
    ],
  },
  codex: {
    label: 'Codex',
    command: 'codex',
    install: 'https://developers.openai.com/codex/cli/',
    modelConfig: 'codex',
    args: (prompt, model) => [
      'exec', '--sandbox', 'read-only', '--ephemeral',
      ...(model ? ['--model', model] : []),
      prompt,
    ],
  },
  'claude-code': {
    label: 'Claude Code',
    command: 'claude',
    install: 'npm install -g @anthropic-ai/claude-code',
    modelConfig: 'claude-code',
    args: (prompt, model) => [
      '-p', prompt,
      '--output-format', 'json',
      '--tools', '',
      '--disallowedTools', 'mcp__*',
      '--no-session-persistence',
      ...(model ? ['--model', model] : []),
    ],
  },
}

function splitFrontmatter(source, filePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/)
  if (!match) throw new Error(`Front matter ausente ou inválido em ${filePath}`)
  const metadata = parse(match[1]) ?? {}
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error(`Front matter deve ser um objeto YAML em ${filePath}`)
  }
  return { metadata, body: match[2].trimEnd() }
}

function parseJsonResponse(content, postPath, locale) {
  const cleanContent = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  let result
  try {
    result = JSON.parse(cleanContent)
  } catch {
    throw new Error(`O provedor retornou JSON inválido para ${postPath} (${locale}).`)
  }
  for (const field of ['title', 'description', 'body']) {
    if (typeof result[field] !== 'string') {
      throw new Error(`O provedor não retornou o campo textual "${field}" para ${postPath} (${locale}).`)
    }
  }
  return result
}

function createTranslationPrompt(source, locale) {
  const prompt = [
    `Translate this ARGVUS website article into ${locale.label}.`,
    'Return only a JSON object with string fields title, description, and body.',
    'Translate natural language while preserving Markdown structure, links, HTML, inline code, fenced code blocks, commands, product names, and technical identifiers.',
    'Do not add or remove content.',
    'Do not use tools, read or write files, run commands, or modify the repository. Only return the translated JSON object.',
    'The source article is included with this request as JSON or an attached Markdown file.',
  ].join('\n\n')
  const input = JSON.stringify({
    title: source.metadata.title ?? '',
    description: source.metadata.description ?? '',
    body: source.body,
  })
  return { prompt, input }
}

function detectAvailableProviders() {
  return Object.entries(providers).filter(([, config]) => {
    const result = spawnSync(config.command, ['--version'], {
      encoding: 'utf8',
      timeout: 5000,
      windowsHide: true,
    })
    return !result.error && result.status === 0
  })
}

function runCli(provider, { prompt, input }, postPath, localeCode) {
  const config = providers[provider]
  const model = translationConfig?.[config.modelConfig]?.MODEL?.trim()
  const sourceFile = path.relative(process.cwd(), path.join(postsDirectory, postPath))
  return new Promise((resolve, reject) => {
    const child = spawn(config.command, config.args(prompt, model, sourceFile), { stdio: ['pipe', 'pipe', 'pipe'] })
    let output = ''
    let errors = ''
    child.stdout.setEncoding('utf8').on('data', (chunk) => { output += chunk })
    child.stderr.setEncoding('utf8').on('data', (chunk) => { errors += chunk })
    child.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error(`${config.label} CLI não encontrado. Instale-o (${config.install}) e autentique a conta no próprio CLI.`))
        return
      }
      reject(error)
    })
    child.on('close', (code) => {
      if (code !== 0) {
        const details = (errors || output).trim().slice(-1200)
        reject(new Error([
          `${config.label} falhou ao traduzir ${postPath} (${localeCode}).`,
          ...(details ? [details] : []),
          `Confirme que ${config.label} está instalado e autenticado no terminal.`,
        ].join('\n')))
        return
      }
      try {
        let content = output
        if (provider === 'claude-code') {
          const payload = JSON.parse(output)
          if (typeof payload.result !== 'string') {
            throw new Error('A saída JSON do Claude Code não contém o campo "result".')
          }
          content = payload.result
        }
        resolve(parseJsonResponse(content, postPath, localeCode))
      } catch (error) {
        reject(new Error(`Resposta inesperada de ${config.label} para ${postPath} (${localeCode}): ${error.message}`))
      }
    })
    child.stdin.end(provider === 'opencode' ? undefined : input)
  })
}

async function translatePost(provider, source, postPath, locale) {
  return runCli(provider, createTranslationPrompt(source, locale), postPath, locale.code)
}

async function readSourcePosts() {
  const entries = await readdir(postsDirectory, { withFileTypes: true }).catch((error) => {
    if (error.code === 'ENOENT') return []
    throw error
  })
  const filenames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort()

  return Promise.all(filenames.map(async (filename) => {
    const sourcePath = path.join(postsDirectory, filename)
    const source = splitFrontmatter(await readFile(sourcePath, 'utf8'), filename)
    return { filename, source, slug: filename.slice(0, -'.md'.length) }
  }))
}

async function choosePosts(posts) {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error('Este comando precisa de um terminal interativo para selecionar os posts.')
  }

  const allOption = posts.length + 1
  const readline = createInterface({ input: stdin, output: stdout })
  try {
    console.log('\nPosts disponíveis para tradução:')
    posts.forEach(({ filename, source, slug }, index) => {
      const title = source.metadata.title?.trim() || slug
      const suffix = title.toLowerCase() === slug.toLowerCase() ? '' : ` [${slug}]`
      console.log(`${index + 1} - ${title}${suffix}`)
    })
    console.log(`${allOption} - todos os posts`)
    console.log('0 - cancelar')

    while (true) {
      const answer = (await readline.question('\nEscolha uma opção: ')).trim()
      if (/^\d+$/.test(answer)) {
        const choice = Number(answer)
        if (choice === 0) return []
        if (choice === allOption) return posts
        if (choice >= 1 && choice <= posts.length) return [posts[choice - 1]]
      }
      console.log(`Opção inválida. Digite um número de 0 a ${allOption}.`)
    }
  } catch (error) {
    if (error.code === 'ERR_USE_AFTER_CLOSE' || error.name === 'AbortError') return []
    throw error
  } finally {
    readline.close()
  }
}

async function chooseProvider(availableProviders) {
  const choices = availableProviders
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error('A seleção do agente de tradução precisa de um terminal interativo.')
  }

  const readline = createInterface({ input: stdin, output: stdout })
  try {
    console.log('\nAgente local para tradução:')
    choices.forEach(([, provider], index) => console.log(`${index + 1} - ${provider.label}`))
    console.log('0 - cancelar')

    while (true) {
      const answer = (await readline.question('\nEscolha uma opção: ')).trim()
      if (/^\d+$/.test(answer)) {
        const choice = Number(answer)
        if (choice === 0) return null
        if (choice >= 1 && choice <= choices.length) return choices[choice - 1][0]
      }
      console.log(`Opção inválida. Digite um número de 0 a ${choices.length}.`)
    }
  } catch (error) {
    if (error.code === 'ERR_USE_AFTER_CLOSE' || error.name === 'AbortError') return null
    throw error
  } finally {
    readline.close()
  }
}

const sourcePosts = await readSourcePosts()
if (sourcePosts.length === 0) {
  throw new Error(`Nenhum post em inglês encontrado em ${path.relative(process.cwd(), postsDirectory)}.`)
}

const postsNeedingTranslation = []
for (const post of sourcePosts) {
  for (const locale of locales) {
    if (locale.code === 'en') continue
    try {
      await access(path.join(postsDirectory, locale.code, post.filename))
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      postsNeedingTranslation.push(post)
      break
    }
  }
}

if (postsNeedingTranslation.length === 0) {
  console.log('Todos os posts já têm tradução em todos os idiomas suportados.')
  process.exit(0)
}

const selectedPosts = await choosePosts(postsNeedingTranslation)
if (selectedPosts.length === 0) {
  console.log('Tradução cancelada.')
  process.exit(0)
}

const pendingTranslations = []
for (const post of selectedPosts) {
  for (const locale of locales) {
    if (locale.code === 'en') continue
    const outputPath = path.join(postsDirectory, locale.code, post.filename)
    try {
      await access(outputPath)
      console.log(`Ignorado (já existe): ${locale.code}/${post.slug}`)
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      pendingTranslations.push({ ...post, locale, outputPath })
    }
  }
}

if (pendingTranslations.length === 0) {
  console.log('Todas as traduções selecionadas já existem.')
  process.exit(0)
}

const availableProviders = detectAvailableProviders()
if (availableProviders.length === 0) {
  const installInstructions = Object.values(providers)
    .map(({ label, install }) => `- ${label}: ${install}`)
    .join('\n')
  throw new Error(`Nenhum CLI de tradução foi encontrado. Instale e autentique pelo menos um:\n${installInstructions}`)
}
console.log(`CLIs disponíveis: ${availableProviders.map(([, provider]) => provider.label).join(', ')}`)

const provider = await chooseProvider(availableProviders)
if (!provider) {
  console.log('Tradução cancelada.')
  process.exit(0)
}

const configuredModel = translationConfig?.[providers[provider].modelConfig]?.MODEL?.trim()
if (!configuredModel) {
  throw new Error(`Defina news.translate.${providers[provider].modelConfig}.MODEL em src/site-config.json.`)
}
console.log(`Agente: ${providers[provider].label} (${configuredModel})`)

for (const { filename, source, slug, locale, outputPath } of pendingTranslations) {
  const translated = await translatePost(provider, source, filename, locale)
  const metadata = {
    ...source.metadata,
    title: translated.title,
    description: translated.description,
    tags: source.metadata.tags ?? [],
  }
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `---\n${stringify(metadata).trimEnd()}\n---\n\n${translated.body.trimStart()}\n`)
  console.log(`Traduzido: ${locale.code}/${slug}`)
}
