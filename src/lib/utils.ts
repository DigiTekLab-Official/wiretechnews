export const SITE_URL = 'https://wiretechnews.com';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function absoluteUrl(path: string): string {
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalised}`;
}

export function articleUrl(slug: string, contentType: string): string {
  return `/${contentType}/${slug}/`;
}

export function regulationUrl(slug: string): string {
  return `/regulation/${slug}/`;
}

export function glossaryUrl(slug: string): string {
  return `/glossary/${slug}/`;
}

export function topicUrl(slug: string): string {
  return `/topic/${slug}/`;
}

export function authorUrl(slug: string): string {
  return `/author/${slug}/`;
}

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  analysis: 'Analysis',
  briefing: 'Intelligence Briefing',
  guide: 'Compliance Guide',
  alert: 'Regulatory Alert',
};

export const REGULATION_STATUS_LABELS: Record<string, string> = {
  proposed: 'Proposed',
  active: 'Active',
  amended: 'Amended',
  repealed: 'Repealed',
};
