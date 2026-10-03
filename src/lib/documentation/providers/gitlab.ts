import type { DocumentationProvider, FileContent, FileEntry } from './base.ts'

export class GitLabProvider implements DocumentationProvider {
  name = 'GitLab'

  constructor(private urlBase: string) {}

  private buildRepoPath(repository: string): string {
    const urlParts = this.urlBase.replace(/\/$/, '').split('/')
    const owner = urlParts[urlParts.length - 1]
    return `${owner}/${repository}`
  }

  async listFiles(
    repository: string,
    dirPath: string,
    branch: string,
  ): Promise<FileEntry[]> {
    const repoPath = this.buildRepoPath(repository)
    const apiUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repoPath)}/repository/tree?path=${encodeURIComponent(dirPath)}&ref=${branch}&recursive=false`

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'ARGVUS-Documentation-Loader',
      },
    })

    if (!response.ok) {
      throw new Error(
        `GitLab API error: ${response.status} ${response.statusText} for ${apiUrl}`,
      )
    }

    const data = (await response.json()) as Array<{
      name: string
      type: 'blob' | 'tree'
      path: string
    }>

    if (!Array.isArray(data)) {
      throw new Error(`Expected array from GitLab API, got ${typeof data}`)
    }

    return data.map((item) => ({
      path: item.path,
      type: item.type === 'blob' ? 'file' : 'dir',
    }))
  }

  async fetchFile(
    repository: string,
    filePath: string,
    branch: string,
  ): Promise<FileContent> {
    const repoPath = this.buildRepoPath(repository)
    const apiUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repoPath)}/repository/files/${encodeURIComponent(filePath)}/raw?ref=${branch}`

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'ARGVUS-Documentation-Loader',
      },
    })

    if (!response.ok) {
      throw new Error(
        `GitLab API error: ${response.status} ${response.statusText} for ${filePath}`,
      )
    }

    const content = await response.text()

    return {
      path: filePath,
      content,
    }
  }
}
