export interface FileEntry {
  path: string
  type: 'file' | 'dir'
}

export interface FileContent {
  path: string
  content: string
}

export interface DocumentationProvider {
  name: string
  listFiles(repository: string, dirPath: string, branch: string): Promise<FileEntry[]>
  fetchFile(repository: string, filePath: string, branch: string): Promise<FileContent>
}
