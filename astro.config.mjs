import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import fs from 'node:fs'
import starlightVersions from 'starlight-versions'

function getPackageVersion() {
  const { version } = JSON.parse(
    fs.readFileSync(new URL('./version.json', import.meta.url), 'utf8'),
  )
  if (!version) {
    throw new Error('version not found in version.json')
  }
  return version
}

const pkgVersion = getPackageVersion()

export default defineConfig({
  site: 'https://argvus.github.io',
  base: '/',
  srcDir: './src',
  publicDir: './src/public',
  integrations: [
    starlight({
      title: 'ARGVUS',
      description:
        'ARGVUS is a complete Hyprland and Wayland desktop for Arch Linux, including argvus-storage, Waybar, themes and signed pacman packages.',
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
      sidebar: [
        {
          label: 'Introduction',
          translations: { pt: 'Introdução' },
          items: [{ slug: 'docs/intro' }],
        },
        {
          label: 'Installation',
          translations: { pt: 'Instalação' },
          items: [{ slug: 'docs/install' }],
        },
        {
          label: 'Environment',
          translations: { pt: 'Ambiente' },
          items: [{ slug: 'docs/environment' }],
        },
        {
          label: 'Themes',
          translations: { pt: 'Temas' },
          items: [{ slug: 'docs/themes' }],
        },
        {
          label: 'Official Apps',
          translations: { pt: 'Apps oficiais' },
          items: [
            { slug: 'docs/official-apps' },
            { slug: 'docs/calendar' },
            { slug: 'docs/storage' },
          ],
        },
        { label: 'Weather', items: [{ slug: 'docs/weather' }] },
        {
          label: 'Sessions',
          translations: { pt: 'Sessões' },
          items: [{ slug: 'docs/sessions/gdm' }, { slug: 'docs/sessions/tty' }],
        },
        { label: 'Packaging', items: [{ slug: 'docs/packaging' }] },
      ],
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
