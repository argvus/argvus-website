import { loadDocumentation } from './loader.ts'

export interface SidebarItem {
  slug?: string
  label?: string
  translations?: Record<string, string>
  items?: SidebarItem[]
}

interface DocNode {
  slug: string
  title?: string
  children: Map<string, DocNode>
}

function buildTree(entries: ReturnType<typeof loadDocumentation>[0][]): Map<string, DocNode> {
  const projects = new Map<string, DocNode>()

  for (const entry of entries) {
    const slugParts = entry.slug.split('/')
    const project = slugParts[0]
    const locale = slugParts[1]
    const pathParts = slugParts.slice(2)

    if (locale === 'en') {
      if (!projects.has(project)) {
        projects.set(project, {
          slug: '',
          children: new Map(),
        })
      }

      const projectNode = projects.get(project)!
      let current = projectNode

      for (const part of pathParts) {
        if (!current.children.has(part)) {
          current.children.set(part, {
            slug: '',
            children: new Map(),
          })
        }
        current = current.children.get(part)!
      }

      current.slug = entry.slug
      current.title = entry.data.title as string | undefined
    }
  }

  return projects
}

function nodeToSidebarItems(node: DocNode, currentPath: string = ''): SidebarItem[] {
  const items: SidebarItem[] = []

  const sortedEntries = Array.from(node.children.entries()).sort(([keyA], [keyB]) => {
    const indexMap: Record<string, number> = {
      'index': 0,
    }

    const indexA = indexMap[keyA] ?? 1
    const indexB = indexMap[keyB] ?? 1

    if (indexA !== indexB) return indexA - indexB
    return keyA.localeCompare(keyB)
  })

  for (const [key, child] of sortedEntries) {
    const newPath = currentPath ? `${currentPath}/${key}` : key
    const hasChildren = child.children.size > 0

    if (hasChildren) {
      items.push({
        label: key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        items: nodeToSidebarItems(child, newPath),
      })
    } else if (child.slug) {
      items.push({
        slug: child.slug,
        label: child.title || key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      })
    }
  }

  return items
}

export async function buildDynamicSidebar(): Promise<SidebarItem[]> {
  const entries = await loadDocumentation()
  const projects = buildTree(entries)

  const sidebar: SidebarItem[] = []

  for (const [projectName, projectNode] of projects) {
    const userGuide = projectNode.children.get('user-guide')
    const devGuide = projectNode.children.get('developer-guide')

    if (userGuide) {
      sidebar.push({
        label: 'User Guide',
        translations: { pt: 'Guia do Usuário' },
        items: nodeToSidebarItems(userGuide, 'user-guide'),
      })
    }

    if (devGuide) {
      sidebar.push({
        label: 'Developer Guide',
        translations: { pt: 'Guia do Desenvolvedor' },
        items: nodeToSidebarItems(devGuide, 'developer-guide'),
      })
    }
  }

  return sidebar
}
