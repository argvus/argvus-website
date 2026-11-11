import locales from '../site-languages.json'
import type { NewsLocale } from './messages'

export const newsLocales = locales
export const newsLocaleCodes = new Set<string>(locales.map(({ code }) => code))

export function getPostLocation(id: string) {
  const [first, ...remaining] = id.split('/')
  if (remaining.length && newsLocaleCodes.has(first) && first !== 'en') {
    return { lang: first as NewsLocale, slug: remaining.join('/') }
  }
  return { lang: 'en', slug: id }
}

export function getNewsPath(lang: NewsLocale, slug = '') {
  return `/news/${lang === 'en' ? '' : `${lang}/`}${slug ? `${slug}/` : ''}`
}
