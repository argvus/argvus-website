import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import fs from 'node:fs'
import starlightVersions from 'starlight-versions'
import { sidebarConfig } from './src/lib/generated-sidebar.mjs'

function getPackageVersion() {
  const { version } = JSON.parse(
    fs.readFileSync(new URL('./version.json', import.meta.url), 'utf8'),
  )
  if (!version) {
    throw new Error('version not found in version.json')
  }
  return version
}

function getDocsRedirects() {
  return JSON.parse(
    fs.readFileSync(new URL('./src/lib/docs-redirects.json', import.meta.url), 'utf8'),
  )
}

const pkgVersion = getPackageVersion()
const docsRedirects = getDocsRedirects()

export default defineConfig({
  site: 'https://argvus.github.io',
  base: '/',
  srcDir: './src',
  publicDir: './src/public',
  redirects: docsRedirects,
  integrations: [
    starlight({
      title: 'ARGVUS',
      description:
        'ARGVUS is a modular Hyprland and Wayland desktop environment for Arch Linux, with session, shell, settings, appearance and system modules shipped as signed pacman packages.',
      customCss: ['./src/styles/custom.css'],
      favicon: '/favicon.png',
      components: {
        SiteTitle: './src/components/DocsSiteTitle.astro',
        Footer: './src/components/DocsFooter.astro',
      },
      locales: {
        root: { label: 'English', lang: 'en' },
        pt: { label: 'Português', lang: 'pt-BR' },
      },
      plugins: [
        starlightVersions({
          versions: [{ slug: pkgVersion, label: `v${pkgVersion}` }],
          current: { label: 'Latest' },
        }),
      ],
      sidebar: sidebarConfig,
      social: [
        {
          href: 'https://github.com/orgs/argvus',
          icon: 'github',
          label: 'GitHub',
        },
      ],
    }),
  ],
})
