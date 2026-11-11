import { createNewsFeed } from '../../../lib/news/feed'
import { newsLocales } from '../../../lib/news/posts'
import type { NewsLocale } from '../../../lib/news/messages'

export function getStaticPaths() {
  return newsLocales
    .filter(({ code }) => code !== 'en')
    .map(({ code }) => ({ params: { locale: code } }))
}

export async function GET({ site, params }: { site: URL | undefined; params: { locale?: string } }) {
  return createNewsFeed(site, params.locale as NewsLocale)
}
