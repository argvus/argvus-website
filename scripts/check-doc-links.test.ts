import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkDocLinks, extractLinks, resolveLink } from './check-doc-links.ts'

/*
 * Regression tests for the documentation link checker. The first group pins
 * how relative links resolve: Starlight serves each page at `/<slug>/`, and a
 * relative link is resolved from that URL. Links authored for GitHub's file
 * tree (`./hardware/input/` inside `user-guide/`) break on the site, which is
 * the source of the 404s this checker prevents.
 */

test('a relative link resolves from the rendered page URL', () => {
  assert.equal(
    resolveLink('./hardware/input/', '/docs/user-guide/desktop/'),
    '/docs/user-guide/desktop/hardware/input',
  )
  assert.equal(
    resolveLink('../control-center/', '/docs/argvus-hyprland/input/'),
    '/docs/argvus-hyprland/control-center',
  )
})

test('absolute site routes are kept and normalized', () => {
  assert.equal(resolveLink('/docs/argvus-themes/installing-themes/', '/docs/argvus-appearance/wallpapers/'), '/docs/argvus-themes/installing-themes')
  assert.equal(resolveLink('/pt/docs/getting-started/installation/', '/pt/docs/x/'), '/pt/docs/getting-started/installation')
})

test('external links, anchors and assets are not route-checked', () => {
  assert.equal(resolveLink('https://github.com/argvus', '/docs/x/'), null)
  assert.equal(resolveLink('mailto:someone@example.org', '/docs/x/'), null)
  assert.equal(resolveLink('#section', '/docs/x/'), null)
  assert.equal(resolveLink('./diagram.png', '/docs/x/'), null)
})

test('anchors and query strings are removed before resolving', () => {
  assert.equal(resolveLink('./wallpapers/#custom', '/docs/argvus-appearance/'), '/docs/argvus-appearance/wallpapers')
})

test('links inside fenced code and inline code are ignored', () => {
  const body = [
    'See [real](/docs/a/).',
    '```md',
    '[inside fence](/docs/missing/)',
    '```',
    'Inline `[inline](/docs/missing/)` is code.',
  ].join('\n')

  const links = extractLinks(body)
  assert.deepEqual(links, [{ link: '/docs/a/', line: 1 }])
})

test('every internal documentation link resolves to a served page', async () => {
  const { checked, broken } = await checkDocLinks()

  assert.ok(checked > 0, 'no documentation links were found; the loader may not be reading the docs')
  assert.deepEqual(
    broken.map((finding) => `${finding.source}:${finding.line} ${finding.link} -> ${finding.resolved}`),
    [],
  )
})
