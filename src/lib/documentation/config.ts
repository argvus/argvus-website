import siteConfig from '../../site-config.json'

export interface ProjectConfig {
  repository: string
  path: string
  branch: string
  label?: string
  /** When true, this project's docs are served without a project-name prefix (e.g. `/docs/introduction/` instead of `/docs/argvus/introduction/`). Only one project should set this. */
  root?: boolean
}

export interface DocumentationConfig {
  url_base: string
  projects: ProjectConfig[]
}

export function getDocumentationConfig(): DocumentationConfig {
  if (!siteConfig.documentation) {
    throw new Error('documentation config not found in site-config.json')
  }
  return siteConfig.documentation
}

export function getProjectConfig(repository: string): ProjectConfig | undefined {
  const config = getDocumentationConfig()
  return config.projects.find((p) => p.repository === repository)
}
