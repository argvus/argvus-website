import type { DocumentationProvider, FileContent, FileEntry } from './base.ts'

export class GitHubProvider implements DocumentationProvider {
  name = 'GitHub'

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
    const apiUrl = `https://api.github.com/repos/${repoPath}/contents/${dirPath}?ref=${branch}`

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ARGVUS-Documentation-Loader',
      },
    })

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText} for ${apiUrl}`,
      )
    }

    const data = (await response.json()) as Array<{
      name: string
      type: 'file' | 'dir'
      path: string
    }>

    if (!Array.isArray(data)) {
      throw new Error(`Expected array from GitHub API, got ${typeof data}`)
    }

    return data.map((item) => ({
      path: item.path,
      type: item.type,
    }))
  }

  async fetchFile(
    repository: string,
    filePath: string,
    branch: string,
  ): Promise<FileContent> {
    const repoPath = this.buildRepoPath(repository)
    const apiUrl = `https://api.github.com/repos/${repoPath}/contents/${filePath}?ref=${branch}`

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'ARGVUS-Documentation-Loader',
      },
    })

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText} for ${filePath}`,
      )
    }

    const content = await response.text()

    return {
      path: filePath,
      content,
    }
  }
}
