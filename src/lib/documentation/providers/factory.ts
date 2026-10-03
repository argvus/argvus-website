import type { DocumentationProvider } from './base.ts'
import { GitHubProvider } from './github.ts'
import { GitLabProvider } from './gitlab.ts'

export function createProviderFromUrl(urlBase: string): DocumentationProvider {
  const url = new URL(urlBase)
  const hostname = url.hostname

  if (hostname.includes('github.com')) {
    return new GitHubProvider(urlBase)
  }

  if (hostname.includes('gitlab.com')) {
    return new GitLabProvider(urlBase)
  }

  throw new Error(`Unsupported documentation provider: ${hostname}`)
}
