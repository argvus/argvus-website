import { copyFile, readFile, readdir, rm } from 'node:fs/promises'
import path from 'node:path'

const outputDirectory = path.resolve('dist')
const sitemapPath = path.join(outputDirectory, 'sitemap.xml')
const generatedFiles = (await readdir(outputDirectory))
  .filter((file) => /^sitemap-\d+\.xml$/.test(file))
  .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]))

if (generatedFiles.length === 0) {
  try {
    const existingSitemap = await readFile(sitemapPath, 'utf8')
    if (existingSitemap.includes('<urlset')) {
      console.log('dist/sitemap.xml is already finalized.')
    } else {
      throw new Error('Astro did not generate any sitemap files in dist/.')
    }
  } catch {
    throw new Error('Astro did not generate any sitemap files in dist/.')
  }
} else if (generatedFiles.length === 1) {
  const generatedSitemap = path.join(outputDirectory, generatedFiles[0])
  await copyFile(generatedSitemap, sitemapPath)
  await rm(generatedSitemap)
  await rm(path.join(outputDirectory, 'sitemap-index.xml'), { force: true })
  console.log('Created dist/sitemap.xml with all site URLs.')
} else {
  // Sitemap files have a 50,000 URL limit. Keep Astro's index only when the
  // site grows enough to require multiple sitemap files.
  const indexPath = path.join(outputDirectory, 'sitemap-index.xml')
  await copyFile(indexPath, sitemapPath)
  await rm(indexPath)
  console.log(`Created dist/sitemap.xml index for ${generatedFiles.length} sitemap files.`)
}
