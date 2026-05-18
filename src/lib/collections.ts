import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type ArticleContentType = 'analysis' | 'briefing' | 'guide' | 'alert';

export async function getArticleStaticPaths(contentType: ArticleContentType) {
  const entries = await getCollection(
    'articles',
    ({ data }) => data.contentType === contentType
  );
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

export async function getArticlesByTopic(topic: string): Promise<CollectionEntry<'articles'>[]> {
  const entries = await getCollection('articles', ({ data }) => data.topic === topic);
  return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getArticlesByRegulation(
  regulationSlug: string
): Promise<CollectionEntry<'articles'>[]> {
  const entries = await getCollection('articles', ({ data }) =>
    data.regulations.includes(regulationSlug)
  );
  return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getRelatedRegulations(
  slugs: string[]
): Promise<CollectionEntry<'regulations'>[]> {
  const results = await Promise.all(slugs.map((slug) => getEntry('regulations', slug)));
  return results.filter((r): r is CollectionEntry<'regulations'> => r !== undefined);
}

export async function getAuthor(slug: string): Promise<CollectionEntry<'authors'> | undefined> {
  return getEntry('authors', slug);
}

export async function getAllArticlesSorted(): Promise<CollectionEntry<'articles'>[]> {
  const entries = await getCollection('articles');
  return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}
