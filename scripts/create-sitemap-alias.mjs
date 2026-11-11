import { copyFile, access } from 'node:fs/promises'
import path from 'node:path'

const outputDirectory = path.resolve('dist')
const indexPath = path.join(outputDirectory, 'sitemap-index.xml')
const sitemapPath = path.join(outputDirectory, 'sitemap.xml')

await access(indexPath)
await copyFile(indexPath, sitemapPath)

console.log('Created dist/sitemap.xml from the sitemap index.')
