export interface LinkContext {
  currentPath: string
  locale: 'root' | 'pt'
  project: string
}

function normalizeLocale(locale: 'root' | 'pt'): string {
  return locale === 'root' ? '' : '/pt'
}

export function resolveDocumentationLink(link: string, context: LinkContext): string {
  if (!link || link.startsWith('http://') || link.startsWith('https://')) {
    return link
  }

  if (link.startsWith('#')) {
    return link
  }

  const currentDir = context.currentPath.substring(0, context.currentPath.lastIndexOf('/'))
  let resolvedPath = link

  if (link.startsWith('./')) {
    resolvedPath = link.substring(2)
    resolvedPath = `${currentDir}/${resolvedPath}`
  } else if (link.startsWith('../')) {
    let parts = currentDir.split('/')
    let relativeParts = link.split('/')

    for (const part of relativeParts) {
      if (part === '..') {
        parts.pop()
      } else if (part && part !== '.') {
        parts.push(part)
      }
    }

    resolvedPath = parts.join('/')
  } else {
    resolvedPath = `${currentDir}/${link}`
  }

  resolvedPath = resolvedPath.replace(/\.md$/, '').replace(/\/index$/, '')
  if (!resolvedPath.endsWith('/')) {
    resolvedPath = `${resolvedPath}/`
  }

  const localePrefix = normalizeLocale(context.locale)
  return `${localePrefix}/${context.project}${resolvedPath}`
}

export function shouldTransformLink(link: string): boolean {
  if (!link) return false
  if (link.startsWith('http://') || link.startsWith('https://')) return false
  if (link.startsWith('#')) return false
  return true
}
