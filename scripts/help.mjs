import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(await readFile(path.join(projectRoot, 'package.json'), 'utf8'))

const descriptions = {
  help: 'Mostra todos os comandos npm disponíveis neste projeto.',
  'clean:versions': 'Remove snapshots de versões gerados pelo Starlight.',
  'create:post': 'Cria um post em inglês e gera seu slug a partir do título.',
  'translate:posts': 'Traduz posts pendentes com OpenCode, Codex ou Claude Code via CLI.',
  'delete:post': 'Remove um post em inglês e suas traduções após confirmação.',
  'edit:post': 'Abre um post em inglês no editor configurado em site-config.json.',
  'generate:docs': 'Gera os arquivos de documentação a partir dos repositórios.',
  'generate:sidebar': 'Gera a configuração da barra lateral da documentação.',
  generate: 'Gera documentação e configuração da barra lateral.',
  dev: 'Gera a documentação e inicia o servidor local Astro.',
  stop: 'Para o servidor de desenvolvimento Astro.',
  'check:links': 'Verifica links internos da documentação.',
  'test:links': 'Executa os testes do verificador de links.',
  build: 'Gera a documentação, verifica links e cria o site de produção.',
  preview: 'Inicia uma prévia local do build de produção.',
  astro: 'Executa a CLI do Astro com os argumentos informados.',
}

console.log(`\n${packageJson.name} — comandos disponíveis\n`)
for (const [name, command] of Object.entries(packageJson.scripts ?? {})) {
  const description = descriptions[name] ?? `Executa: ${command}`
  console.log(`  npm run ${name}`)
  console.log(`    ${description}`)
}
console.log('\nPasse argumentos a um comando usando --, por exemplo: npm run astro -- --help\n')
