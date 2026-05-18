import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { articleUrl } from '../lib/utils';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const sorted = articles.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );

  return rss({
    title: 'WireTechNews',
    description:
      'AI Governance, Privacy Law, Cybersecurity Compliance & Enterprise Risk Intelligence',
    site: context.site!,
    items: sorted.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedAt,
      link: articleUrl(article.slug, article.data.contentType),
    })),
    customData: '<language>en-us</language>',
  });
}
