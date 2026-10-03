/**
 * Wraps every Markdown table in a focusable horizontal scroll region, so a wide
 * table scrolls inside its own box instead of stretching the page.
 *
 * The wrapper is raw HTML with blank lines around the table, so the table is
 * still parsed as Markdown. Tables inside fenced code blocks are left untouched.
 */
export function wrapTables(body: string): string {
  const lines = body.split('\n')
  const out: string[] = []
  let inFence = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (/^\s*```/.test(line)) {
      inFence = !inFence
      out.push(line)
      continue
    }

    const isTableStart =
      !inFence &&
      isTableRow(line) &&
      i + 1 < lines.length &&
      /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(lines[i + 1])

    if (!isTableStart) {
      out.push(line)
      continue
    }

    out.push(
      '<div class="table-scroll" role="region" aria-label="Scrollable table" tabindex="0">',
      '',
    )
    while (i < lines.length && isTableRow(lines[i])) {
      out.push(lines[i])
      i++
    }
    i--
    out.push('', '</div>')
  }

  return out.join('\n')
}

function isTableRow(line: string): boolean {
  return /^\s*\|.*\|\s*$/.test(line)
}
