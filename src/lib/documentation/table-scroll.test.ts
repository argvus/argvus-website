import { test } from 'node:test'
import assert from 'node:assert/strict'
import { wrapTables } from './table-scroll.ts'

const TABLE = ['| Shortcut | Description |', '| --- | --- |', '| `SUPER + Q` | Close window |'].join('\n')

test('a Markdown table is wrapped in a focusable scroll region', () => {
  const output = wrapTables(`Intro\n\n${TABLE}\n\nAfter`)

  assert.equal(
    output,
    [
      'Intro',
      '',
      '<div class="table-scroll" role="region" aria-label="Scrollable table" tabindex="0">',
      '',
      TABLE,
      '',
      '</div>',
      '',
      'After',
    ].join('\n'),
  )
})

test('tables inside fenced code blocks are not wrapped', () => {
  const body = ['```md', TABLE, '```'].join('\n')

  assert.equal(wrapTables(body), body)
})

test('text without a table is returned unchanged', () => {
  const body = 'A | pipe in prose\n\nNo table here.'

  assert.equal(wrapTables(body), body)
})

test('each table in a page gets its own region', () => {
  const output = wrapTables(`${TABLE}\n\n${TABLE}`)

  assert.equal(output.match(/class="table-scroll"/g)?.length, 2)
})
