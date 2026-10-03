import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { DocumentationProvider, FileContent, FileEntry } from './base.ts'

export class LocalFileProvider implements DocumentationProvider {
  name = 'LocalFile'

  constructor(private baseDir: string) {}

  async listFiles(
    repository: string,
    dirPath: string,
  ): Promise<FileEntry[]> {
    const fullPath = join(this.baseDir, repository, dirPath)

    try {
      const entries = await readdir(fullPath, { withFileTypes: true })

      return entries.map((entry) => ({
        path: join(dirPath, entry.name),
        type: entry.isDirectory() ? 'dir' : 'file',
      }))
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      throw new Error(
        `Failed to list directory ${fullPath}: ${errorMsg}`,
      )
    }
  }

  async fetchFile(
    repository: string,
    filePath: string,
  ): Promise<FileContent> {
    const fullPath = join(this.baseDir, repository, filePath)

    try {
      const content = await readFile(fullPath, 'utf-8')

      return {
        path: filePath,
        content,
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      throw new Error(
        `Failed to read file ${fullPath}: ${errorMsg}`,
      )
    }
  }
}
