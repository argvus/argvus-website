import fs from 'node:fs/promises'
import path from 'node:path'

const generatedVersionDir = /^\d+(?:\.\d+)*(?:[-+][A-Za-z0-9.-]+)?$/
const root = process.cwd()

const targets = [
  path.join(root, 'src/content/docs'),
  path.join(root, 'src/content/docs/pt'),
]

for (const target of targets) {
  await removeVersionDirectories(target)
}

await removeGeneratedVersionConfigs(path.join(root, 'src/content/versions'))

async function removeVersionDirectories(directory) {
  let entries

  try {
    entries = await fs.readdir(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return
    throw error
  }

  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && generatedVersionDir.test(entry.name))
      .map((entry) => fs.rm(path.join(directory, entry.name), { recursive: true, force: true })),
  )
}

async function removeGeneratedVersionConfigs(directory) {
  let entries

  try {
    entries = await fs.readdir(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return
    throw error
  }

  await Promise.all(
    entries
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.endsWith('.json') &&
          generatedVersionDir.test(entry.name.slice(0, -'.json'.length)),
      )
      .map((entry) => fs.rm(path.join(directory, entry.name), { force: true })),
  )
}
