import { spawn } from 'node:child_process'
import { readdir, readFile, mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { parse, stringify } from 'yaml'
import locales from '../src/lib/site-languages.json' with { type: 'json' }
import siteConfig from '../src/site-config.json' with { type: 'json' }

const postsDirectory = path.resolve('src/content/news')
const translationConfig = siteConfig.posts?.translate
const mode = translationConfig?.mode
const apiKeyVariables = {
  ollama: 'POSTS_TRANSLATE_OLLAMA_API_KEY',
  openai: 'POSTS_TRANSLATE_OPENAI_API_KEY',
  gemini: 'POSTS_TRANSLATE_GEMINI_API_KEY',
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
    'The source article is provided as a JSON object on standard input.',
  ].join('\n\n')
  const input = JSON.stringify({
    title: source.metadata.title ?? '',
    description: source.metadata.description ?? '',
    body: source.body,
  })
  return { prompt, input }
}

function runClaude({ prompt, input }, model, postPath, localeCode) {
  return new Promise((resolve, reject) => {
    const args = [
      '-p',
      prompt,
      '--output-format', 'json',
      '--tools', '',
      '--disallowedTools', 'mcp__*',
      '--no-session-persistence',
    ]
    if (model) args.push('--model', model)

    const child = spawn('claude', args, { stdio: ['pipe', 'pipe', 'pipe'] })
    let output = ''
    let errors = ''
    child.stdout.setEncoding('utf8').on('data', (chunk) => { output += chunk })
    child.stderr.setEncoding('utf8').on('data', (chunk) => { errors += chunk })
    child.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error([
          'Claude Code CLI não encontrado.',
          'Instale com: npm install -g @anthropic-ai/claude-code',
          'Depois execute "claude" uma vez para autenticar sua conta e tente novamente.',
        ].join('\n')))
        return
      }
      reject(error)
    })
    child.on('close', (code) => {
      if (code !== 0) {
        const details = (errors || output).trim().slice(-1200)
        reject(new Error([
          `Claude Code falhou ao traduzir ${postPath} (${localeCode}).`,
          ...(details ? [details] : []),
          'Confirme que o Claude Code está autenticado: execute "claude" no terminal e conclua o login.',
        ].join('\n')))
        return
      }
      try {
        const payload = JSON.parse(output)
        if (typeof payload.result !== 'string') {
          throw new Error('A saída JSON do Claude Code não contém o campo "result".')
        }
        resolve(parseJsonResponse(payload.result, postPath, localeCode))
      } catch (error) {
        reject(new Error(`Resposta inesperada do Claude Code para ${postPath} (${localeCode}): ${error.message}`))
      }
    })
    child.stdin.end(input)
  })
}

async function translatePost(source, postPath, locale) {
  if (mode === 'claude-code') {
    return runClaude(createTranslationPrompt(source, locale), translationConfig['claude-code']?.MODEL?.trim(), postPath, locale.code)
  }

  const providerConfig = translationConfig[mode]
  const apiKeyVariable = apiKeyVariables[mode]
  const baseUrl = providerConfig?.BASE_URL?.trim()
  const model = providerConfig?.MODEL?.trim()
  const apiKey = process.env[apiKeyVariable]?.trim()
  const missingSettings = [
    !baseUrl && `posts.translate.${mode}.BASE_URL em src/site-config.json`,
    !model && `posts.translate.${mode}.MODEL em src/site-config.json`,
    !apiKey && apiKeyVariable,
  ].filter(Boolean)

  if (missingSettings.length > 0) {
    throw new Error(`Configuração incompleta para "${mode}". Faltando:\n${missingSettings.map((setting) => `- ${setting}`).join('\n')}`)
  }

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `Translate an ARGVUS website article into ${locale.label}. Return only a JSON object with string fields title, description, and body. Translate natural language while preserving Markdown structure, links, HTML, inline code, fenced code blocks, commands, product names, and technical identifiers. Do not add or remove content.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            title: source.metadata.title ?? '',
            description: source.metadata.description ?? '',
            body: source.body,
          }),
        },
      ],
    }),
  })

  if (!response.ok) {
    const details = (await response.text()).slice(0, 500)
    throw new Error(`Erro da API ${response.status} ao traduzir ${postPath} (${locale.code}): ${details}`)
  }

  const payload = await response.json()
  const content = payload?.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error(`Resposta inesperada da API ao traduzir ${postPath} (${locale.code}).`)
  }
  return parseJsonResponse(content, postPath, locale.code)
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

const supportedModes = ['ollama', 'openai', 'gemini', 'claude-code']
if (!supportedModes.includes(mode)) {
  throw new Error(`Modo de tradução inválido em src/site-config.json. Use ${supportedModes.join(', ')}.`)
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

if (mode !== 'claude-code') {
  const apiKeyVariable = apiKeyVariables[mode]
  const providerConfig = translationConfig[mode]
  const missingSettings = [
    !providerConfig?.BASE_URL?.trim() && `posts.translate.${mode}.BASE_URL em src/site-config.json`,
    !providerConfig?.MODEL?.trim() && `posts.translate.${mode}.MODEL em src/site-config.json`,
    !process.env[apiKeyVariable]?.trim() && apiKeyVariable,
  ].filter(Boolean)
  if (missingSettings.length > 0) {
    const setup = mode === 'ollama'
      ? [
          'Tutorial rápido: Ollama local',
          '1. Instale: curl -fsSL https://ollama.com/install.sh | sh',
          '2. Inicie em outro terminal: ollama serve',
          `3. Baixe o modelo: ollama pull ${providerConfig.MODEL?.trim() || 'qwen3:8b'}`,
          '4. Configure posts.translate.ollama.BASE_URL e MODEL em src/site-config.json.',
          `5. Configure a chave local: export ${apiKeyVariable}="ollama"`,
        ]
      : [`Configure sua chave de API: export ${apiKeyVariable}="sua-chave"`]
    console.error([
      `Configuração incompleta para "${mode}". Faltando:`,
      ...missingSettings.map((setting) => `- ${setting}`),
      '',
      ...setup,
    ].join('\n'))
    process.exit(1)
  }
}

for (const { filename, source, slug, locale, outputPath } of pendingTranslations) {
  const translated = await translatePost(source, filename, locale)
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
