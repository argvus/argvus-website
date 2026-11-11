import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { documentationLocalePrefix, isDocumentationLocale } from './locales.ts'

test('documentation locale directories map to their URL prefixes', () => {
  const expected = {
    en: '', 'pt-br': 'pt/', 'pt-pt': 'pt-pt/', ar: 'ar/',
    'bn-BD': 'bn/', es: 'es/', fr: 'fr/', 'hi-IN': 'hi/', 'id-ID': 'id/',
    it: 'it/', 'zh-cn': 'zh-cn/', ja: 'ja/', de: 'de/', ru: 'ru/', ko: 'ko/',
    'tr-TR': 'tr/', 'ur-PK': 'ur/', 'vi-VN': 'vi/',
  }
  for (const [locale, prefix] of Object.entries(expected)) {
    assert.ok(isDocumentationLocale(locale))
    assert.equal(documentationLocalePrefix(locale), prefix)
  }
  assert.equal(isDocumentationLocale('internal'), false)
  assert.equal(isDocumentationLocale('toString'), false)
})
