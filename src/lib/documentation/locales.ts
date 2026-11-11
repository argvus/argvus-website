/** Source documentation directories and their Starlight URL prefixes. */
export const documentationLocales = {
  en: '',
  'pt-br': 'pt',
  'pt-pt': 'pt-pt',
  ar: 'ar',
  'bn-BD': 'bn',
  es: 'es',
  fr: 'fr',
  'hi-IN': 'hi',
  'id-ID': 'id',
  it: 'it',
  'zh-cn': 'zh-cn',
  ja: 'ja',
  de: 'de',
  ru: 'ru',
  ko: 'ko',
  'tr-TR': 'tr',
  'ur-PK': 'ur',
  'vi-VN': 'vi',
} as const

export type DocumentationLocale = keyof typeof documentationLocales

export function isDocumentationLocale(value: string): value is DocumentationLocale {
  return Object.hasOwn(documentationLocales, value)
}

export function documentationLocalePrefix(locale: DocumentationLocale): string {
  const prefix = documentationLocales[locale]
  return prefix ? `${prefix}/` : ''
}
