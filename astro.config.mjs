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
  redirects: { ...docsRedirects, '/pt/': '/pt-br/' },
  integrations: [
    starlight({
      title: 'ARGVUS',
      description:
        'ARGVUS is a modular Hyprland and Wayland desktop environment for Arch Linux, with session, shell, settings, appearance and system modules shipped as signed pacman packages.',
      customCss: [
        '@fontsource/inter/400.css',
        '@fontsource/inter/500.css',
        '@fontsource/inter/600.css',
        '@fontsource/inter/700.css',
        '@fontsource/inter/800.css',
        '@fontsource/jetbrains-mono/400.css',
        '@fontsource/jetbrains-mono/600.css',
        './src/styles/custom.css',
      ],
      favicon: '/favicon.png',
      components: {
        SiteTitle: './src/components/DocsSiteTitle.astro',
        Footer: './src/components/DocsFooter.astro',
        LanguageSelect: './src/components/DocsLanguageSelect.astro',
        Sidebar: './src/components/Sidebar.astro',
      },
      locales: {
        root: { label: 'English', lang: 'en' },
        pt: { label: 'Português (Brasil)', lang: 'pt-BR' },
        'pt-pt': { label: 'Português (Portugal)', lang: 'pt-PT' },
        es: { label: 'Español', lang: 'es' },
        fr: { label: 'Français', lang: 'fr' },
        it: { label: 'Italiano', lang: 'it' },
        'zh-cn': { label: '中文', lang: 'zh-CN' },
        ja: { label: '日本語', lang: 'ja' },
        de: { label: 'Deutsch', lang: 'de' },
        ru: { label: 'Русский', lang: 'ru' },
        ko: { label: '한국어', lang: 'ko' },
        hi: { label: 'हिन्दी', lang: 'hi-IN' },
        ar: { label: 'العربية', lang: 'ar' },
        bn: { label: 'বাংলা', lang: 'bn-BD' },
        id: { label: 'Bahasa Indonesia', lang: 'id-ID' },
        ur: { label: 'اردو', lang: 'ur-PK' },
        vi: { label: 'Tiếng Việt', lang: 'vi-VN' },
        tr: { label: 'Türkçe', lang: 'tr-TR' },
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
