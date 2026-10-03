import { generateStarlightSidebar } from '../src/lib/starlight-sidebar-config.ts'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

async function generateConfig() {
  try {
    const sidebarConfig = await generateStarlightSidebar()

    const configContent = `export const sidebarConfig = ${JSON.stringify(sidebarConfig, null, 2)}
`

    const outputPath = resolve('src/lib/generated-sidebar.mjs')
    writeFileSync(outputPath, configContent, 'utf-8')
    console.log(`[sidebar-config] Generated sidebar configuration at ${outputPath}`)
  } catch (error) {
    console.error('[sidebar-config] Error generating sidebar configuration:', error)
    process.exit(1)
  }
}

generateConfig()
