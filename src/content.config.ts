import { defineCollection } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { docsVersionsLoader } from 'starlight-versions/loader'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  versions: defineCollection({ loader: docsVersionsLoader() }),
  news: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
    schema: z.object({
      author: z.object({
        name: z.string().default(''),
        link: z.string().default(''),
      }).default({ name: '', link: '' }),
      title: z.string(),
      description: z.string().default(''),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
    }),
  }),
}
