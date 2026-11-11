import { createNewsFeed } from '../../lib/news/feed'

export async function GET({ site }: { site: URL | undefined }) {
  return createNewsFeed(site, 'en')
}
