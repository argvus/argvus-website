/** Source documentation directories and their Starlight URL prefixes. */
export const documentationLocales = {
  en: '',
  'pt-br': 'pt',
  es: 'es',
  fr: 'fr',
  it: 'it',
  'zh-cn': 'zh-cn',
  ja: 'ja',
  de: 'de',
  ru: 'ru',
  ko: 'ko',
} as const

export type DocumentationLocale = keyof typeof documentationLocales

export function isDocumentationLocale(value: string): value is DocumentationLocale {
  return Object.hasOwn(documentationLocales, value)
}

export function documentationLocalePrefix(locale: DocumentationLocale): string {
  const prefix = documentationLocales[locale]
  return prefix ? `${prefix}/` : ''
}
