import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { newsMessages, type NewsLocale } from './messages'
import { getNewsPath, getPostLocation, newsLocales } from './posts'

export async function createNewsFeed(site: URL | undefined, lang: NewsLocale) {
  if (!site) throw new Error('Astro site URL is required to generate the news feed.')

  const locale = newsLocales.find((item) => item.code === lang)
  if (!locale) throw new Error(`Unsupported News locale: ${lang}`)

  const posts = (await getCollection('news'))
    .filter((post) => getPostLocation(post.id).lang === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())

  return rss({
    title: `${newsMessages[lang].heading} — ARGVUS`,
    description: `${newsMessages[lang].heading} — ARGVUS.`,
    site: new URL(getNewsPath(lang), site),
    customData: `<language>${locale.htmlLang}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: getNewsPath(lang, getPostLocation(post.id).slug),
    })),
  })
}
