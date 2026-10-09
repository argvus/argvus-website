import { loadDocumentation, type ContentEntry } from './documentation/loader.ts'
import { getDocumentationConfig, type ProjectConfig } from './documentation/config.ts'
import {
  GETTING_STARTED_SECTION,
  USER_GUIDE_SECTION,
  HELP_SECTION,
  REFERENCE_SECTION,
  DEVELOPER_GUIDE_SECTION,
  COMPONENT_CATEGORIES,
  TOP_LEVEL_REPOSITORIES,
  OTHER_COMPONENTS_GROUP,
  DEVELOPER_NOTES_GROUP,
  COMPONENT_PAGE_ORDER,
  BOOT_SPLASH_DEV_NOTES_ORDER,
  isLayoutGroup,
  type LayoutGroupSpec,
} from './sidebar-layout.ts'

interface SidebarLink {
  slug: string
  label?: string
  translations?: Record<string, string>
}

interface SidebarGroup {
  label: string
  collapsed?: boolean
  translations?: Record<string, string>
  items: (SidebarLink | SidebarGroup)[]
}

type SidebarItem = SidebarLink | SidebarGroup

function humanize(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Resolves one `LayoutGroupSpec` (declarative data from `sidebar-layout.ts`)
 * into a real `SidebarGroup`, looking up each referenced slug in `bySlug` and
 * recording every slug it consumes in `used` so a later pass can find pages
 * the layout never mentioned. A slug the layout references but that doesn't
 * exist in the loaded entries is skipped with a `console.warn` instead of
 * breaking the build.
 */
function resolveGroup(
  spec: LayoutGroupSpec,
  bySlug: Map<string, ContentEntry>,
  used: Set<string>,
): SidebarGroup {
  const items: SidebarItem[] = []

  for (const node of spec.items) {
    if (isLayoutGroup(node)) {
      items.push(resolveGroup(node, bySlug, used))
      continue
    }

    if (!bySlug.has(node.slug)) {
      console.warn(`[sidebar] "${spec.group}": slug not found, skipping: ${node.slug}`)
      continue
    }

    used.add(node.slug)
    const link: SidebarLink = { slug: node.slug }
    if (node.label) link.label = node.label
    if (node.translations) link.translations = node.translations
    items.push(link)
  }

  const group: SidebarGroup = { label: spec.group, items }
  if (spec.collapsed !== undefined) group.collapsed = spec.collapsed
  if (spec.translations) group.translations = spec.translations
  return group
}

/**
 * Appends any loaded entry whose slug starts with `prefix` and that no
 * explicit layout spec has already consumed, in alphabetical order, with a
 * `console.warn` per page. This is the safety net that keeps a page the
 * layout forgot to mention from silently disappearing from the sidebar.
 */
function appendLeftovers(
  group: SidebarGroup,
  bySlug: Map<string, ContentEntry>,
  used: Set<string>,
  prefix: string,
): void {
  const leftovers = [...bySlug.keys()]
    .filter((slug) => slug.startsWith(prefix) && !used.has(slug))
    .sort()

  for (const slug of leftovers) {
    used.add(slug)
    console.warn(`[sidebar] "${group.label}": undeclared page appended: ${slug}`)
    group.items.push({ slug })
  }
}

/**
 * Builds one component's sidebar entry (a direct link for a single-page
 * project, or a collapsible group for a multi-page one), following the
 * component assembly rules: never a "User Guide" wrapper subgroup, root page
 * first as "Overview", explicit page order where configured, and a trailing
 * "Developer notes" subgroup for any `developer-guide/*` pages.
 */
function buildComponentItem(projectConfig: ProjectConfig, projectEntries: ContentEntry[]): SidebarItem {
  const repo = projectConfig.repository
  const label = projectConfig.label || humanize(repo)

  if (projectEntries.length === 1) {
    return { slug: projectEntries[0].slug, label }
  }

  const bySlug = new Map(projectEntries.map((e) => [e.slug, e]))
  const accounted = new Set<string>()

  const rootSlug = `docs/${repo}`
  const rootPrefix = `docs/${repo}/`
  const devGuideRootSlug = `docs/${repo}/developer-guide`
  const devGuidePrefix = `docs/${repo}/developer-guide/`

  const items: SidebarItem[] = []

  if (bySlug.has(rootSlug)) {
    accounted.add(rootSlug)
    items.push({ slug: rootSlug, label: 'Overview', translations: { 'pt-BR': 'Visão geral' } })
  }

  // Everything that isn't the project root or under developer-guide/ is a
  // user-facing page. Docs are flattened post-migration (no `user-guide/`
  // folder), but an unmigrated project may still have one, so a leading
  // `user-guide/` segment is ignored (rule: never create a "User Guide"
  // subgroup) rather than relied upon.
  const userPages = projectEntries.filter(
    (e) => e.slug !== rootSlug && e.slug !== devGuideRootSlug && !e.slug.startsWith(devGuidePrefix),
  )
  const relPathOf = (slug: string) => slug.slice(rootPrefix.length).replace(/^user-guide\//, '')

  const order = COMPONENT_PAGE_ORDER[repo]
  if (order) {
    const byRel = new Map(userPages.map((e) => [relPathOf(e.slug), e]))
    for (const rel of order) {
      const entry = byRel.get(rel)
      if (!entry) {
        console.warn(`[sidebar] "${label}": ordered page not found, skipping: ${rootPrefix}${rel}`)
        continue
      }
      accounted.add(entry.slug)
      items.push({ slug: entry.slug })
      byRel.delete(rel)
    }
    const leftover = [...byRel.values()].sort((a, b) => a.slug.localeCompare(b.slug))
    for (const entry of leftover) {
      console.warn(`[sidebar] "${label}": page not in explicit order, appended alphabetically: ${entry.slug}`)
      accounted.add(entry.slug)
      items.push({ slug: entry.slug })
    }
  } else {
    const alphabetical = [...userPages].sort((a, b) => a.slug.localeCompare(b.slug))
    for (const entry of alphabetical) {
      accounted.add(entry.slug)
      items.push({ slug: entry.slug })
    }
  }

  const devPages = projectEntries.filter(
    (e) => e.slug === devGuideRootSlug || e.slug.startsWith(devGuidePrefix),
  )
  if (devPages.length > 0) {
    const devItems: SidebarItem[] = []

    if (repo === 'argvus-boot-splash') {
      for (const rel of BOOT_SPLASH_DEV_NOTES_ORDER) {
        const slug = rel ? `${devGuidePrefix}${rel}` : devGuideRootSlug
        if (!bySlug.has(slug)) {
          console.warn(`[sidebar] "${label}": boot-splash developer-guide page not found, skipping: ${slug}`)
          continue
        }
        accounted.add(slug)
        devItems.push({ slug })
      }
    } else {
      if (bySlug.has(devGuideRootSlug)) {
        accounted.add(devGuideRootSlug)
        devItems.push({ slug: devGuideRootSlug })
      }
      const rest = devPages
        .filter((e) => e.slug !== devGuideRootSlug)
        .sort((a, b) => a.slug.localeCompare(b.slug))
      for (const entry of rest) {
        accounted.add(entry.slug)
        devItems.push({ slug: entry.slug })
      }
    }

    items.push({
      label: DEVELOPER_NOTES_GROUP.label,
      translations: DEVELOPER_NOTES_GROUP.translations,
      items: devItems,
    })
  }

  const stray = projectEntries.filter((e) => !accounted.has(e.slug)).sort((a, b) => a.slug.localeCompare(b.slug))
  for (const entry of stray) {
    console.warn(`[sidebar] "${label}": page outside user-guide/developer-guide, appended: ${entry.slug}`)
    items.push({ slug: entry.slug })
  }

  return { label, collapsed: true, items }
}

function buildComponentCategories(
  config: { projects: ProjectConfig[] },
  entriesByProject: Map<string, ContentEntry[]>,
): SidebarItem[] {
  const categorized = new Set(COMPONENT_CATEGORIES.flatMap((c) => c.repositories))
  const groups: SidebarItem[] = []

  for (const category of COMPONENT_CATEGORIES) {
    const items: SidebarItem[] = []
    for (const repo of category.repositories) {
      const projectEntries = entriesByProject.get(repo)
      const projectConfig = config.projects.find((p) => p.repository === repo)
      if (!projectConfig) {
        console.warn(`[sidebar] category "${category.label}" references unknown repository: ${repo}`)
        continue
      }
      if (!projectEntries || projectEntries.length === 0) continue
      items.push(buildComponentItem(projectConfig, projectEntries))
    }
    if (items.length > 0) {
      groups.push({
        label: category.label,
        translations: category.translations,
        collapsed: true,
        items,
      })
    }
  }

  const otherItems: SidebarItem[] = []
  for (const projectConfig of config.projects) {
    if (projectConfig.root) continue
    if (categorized.has(projectConfig.repository)) continue
    if (TOP_LEVEL_REPOSITORIES.includes(projectConfig.repository)) continue
    const projectEntries = entriesByProject.get(projectConfig.repository)
    if (!projectEntries || projectEntries.length === 0) continue
    console.warn(
      `[sidebar] project "${projectConfig.repository}" is not mapped to any category in COMPONENT_CATEGORIES; placed under "Other components"`,
    )
    otherItems.push(buildComponentItem(projectConfig, projectEntries))
  }
  if (otherItems.length > 0) {
    groups.push({
      label: OTHER_COMPONENTS_GROUP.label,
      translations: OTHER_COMPONENTS_GROUP.translations,
      collapsed: true,
      items: otherItems,
    })
  }

  return groups
}

/**
 * Builds the Starlight `sidebar` configuration from the documentation loaded
 * from every configured project.
 *
 * Only English (root-locale) entries are used: Starlight resolves a sidebar
 * link's label and locale-specific target automatically from the page found
 * at the (possibly `pt/`-prefixed) localized version of each `slug`. Labels
 * are only set here when the sidebar needs different text than the page's
 * own (localized) title; every such override carries a `pt-BR` translation,
 * so the Portuguese sidebar never falls back to English text.
 *
 * Final order (reader's journey: start → use → look up by component →
 * reference → contribute):
 *
 *   1. Introduction, Quick Start (root project top-level links).
 *   2. Getting Started (install flow) and User Guide (day-to-day usage),
 *      both expanded by default.
 *   3. Help (FAQ + Troubleshooting), collapsed.
 *   4. One collapsed group per component category (`COMPONENT_CATEGORIES` in
 *      `sidebar-layout.ts`), each containing one entry per project in that
 *      category — a direct link for a single-page project, a subgroup for a
 *      multi-page one.
 *   5. Reference, then Developer Guide, both collapsed.
 *   6. License, as the very last link.
 *
 * Any loaded page that no explicit layout entry accounts for is still
 * appended (alphabetically, with a `console.warn`) to the closest matching
 * group, so a page can never silently disappear from the sidebar.
 */
export async function generateStarlightSidebar(): Promise<SidebarItem[]> {
  const config = getDocumentationConfig()
  const entries = await loadDocumentation()

  const enEntries = entries.filter((entry) => entry.sourceLocale === 'en')

  const entriesByProject = new Map<string, ContentEntry[]>()
  for (const entry of enEntries) {
    if (!entriesByProject.has(entry.project)) {
      entriesByProject.set(entry.project, [])
    }
    entriesByProject.get(entry.project)!.push(entry)
  }

  const rootProjectConfig = config.projects.find((p) => p.root)
  const rootEntries = rootProjectConfig ? entriesByProject.get(rootProjectConfig.repository) || [] : []
  const bySlug = new Map(rootEntries.map((e) => [e.slug, e]))
  // Explicit layout specs may point at any project's pages (the User Guide links
  // to component feature pages), so they resolve against every English entry.
  // Leftover detection below stays limited to the root project via `bySlug`.
  const allBySlug = new Map(enEntries.map((e) => [e.slug, e]))
  const used = new Set<string>()

  const topLinks: SidebarItem[] = []
  for (const slug of ['docs/introduction', 'docs/quick-start']) {
    if (!bySlug.has(slug)) continue
    used.add(slug)
    topLinks.push({ slug })
  }

  const gettingStartedGroup = resolveGroup(GETTING_STARTED_SECTION, allBySlug, used)
  appendLeftovers(gettingStartedGroup, bySlug, used, 'docs/getting-started')

  const userGuideGroup = resolveGroup(USER_GUIDE_SECTION, allBySlug, used)

  const helpGroup = resolveGroup(HELP_SECTION, allBySlug, used)
  const troubleshootingSpec = HELP_SECTION.items.find(isLayoutGroup)
  const troubleshootingGroup = troubleshootingSpec
    ? helpGroup.items.find(
        (item): item is SidebarGroup => 'items' in item && item.label === troubleshootingSpec.group,
      )
    : undefined
  if (troubleshootingGroup) {
    appendLeftovers(troubleshootingGroup, bySlug, used, 'docs/user-guide/troubleshooting/')
  }

  // Runs after Getting Started and Help so user-guide/getting-started, faq
  // and troubleshooting/* (already claimed above) aren't re-appended here.
  appendLeftovers(userGuideGroup, bySlug, used, 'docs/user-guide')

  const referenceGroup = resolveGroup(REFERENCE_SECTION, allBySlug, used)
  appendLeftovers(referenceGroup, bySlug, used, 'docs/reference')

  const developerGuideGroup = resolveGroup(DEVELOPER_GUIDE_SECTION, allBySlug, used)
  appendLeftovers(developerGuideGroup, bySlug, used, 'docs/developer-guide')

  const licenseSlug = 'docs/license'
  const licenseItem: SidebarItem[] = []
  if (bySlug.has(licenseSlug)) {
    used.add(licenseSlug)
    licenseItem.push({ slug: licenseSlug })
  }

  // Catches any root-project page under a top-level section this layout
  // doesn't know about yet (e.g. a brand new `docs/<something>` directory),
  // instead of letting it vanish from the sidebar.
  const strayItems: SidebarItem[] = []
  for (const slug of bySlug.keys()) {
    if (used.has(slug)) continue
    used.add(slug)
    console.warn(`[sidebar] root project: unrecognized top-level page, added as-is: ${slug}`)
    strayItems.push({ slug })
  }

  const categoryGroups = buildComponentCategories(config, entriesByProject)

  const topLevelGroups: SidebarItem[] = []
  for (const repo of TOP_LEVEL_REPOSITORIES) {
    const projectConfig = config.projects.find((p) => p.repository === repo)
    const projectEntries = entriesByProject.get(repo)
    if (!projectConfig || !projectEntries || projectEntries.length === 0) continue
    topLevelGroups.push(buildComponentItem(projectConfig, projectEntries))
  }

  return [
    ...topLinks,
    gettingStartedGroup,
    userGuideGroup,
    ...topLevelGroups,
    helpGroup,
    ...categoryGroups,
    referenceGroup,
    developerGuideGroup,
    ...strayItems,
    ...licenseItem,
  ]
}
