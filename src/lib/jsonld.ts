const SITE_URL = 'https://wiretechnews.com';
const SITE_NAME = 'WireTechNews';

export function organizationJsonLd() {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'AI Governance, Privacy Law, Cybersecurity Compliance & Enterprise Risk Intelligence',
    publisher: organizationJsonLd(),
  };
}

export function articleJsonLd(params: {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  updatedAt?: Date;
  authorName: string;
  authorUrl: string;
  isNews: boolean;
  aboutRegulations?: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': params.isNews ? 'NewsArticle' : 'Article',
    headline: params.title,
    description: params.description,
    url: params.url,
    datePublished: params.publishedAt.toISOString(),
    dateModified: (params.updatedAt ?? params.publishedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: params.authorName,
      url: params.authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(params.aboutRegulations?.length
      ? {
          about: params.aboutRegulations.map((r) => ({
            '@type': 'LegalDocument',
            name: r.name,
            url: r.url,
          })),
        }
      : {}),
  };
}

export function howToJsonLd(params: {
  title: string;
  description: string;
  url: string;
  steps: { name: string; text: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.title,
    description: params.description,
    url: params.url,
    step: params.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function regulationJsonLd(params: {
  name: string;
  shortName: string;
  url: string;
  jurisdictions: string[];
  effectiveDate?: string;
  lastAmended?: string;
  officialTextUrl?: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalDocument',
    name: params.name,
    alternateName: params.shortName,
    url: params.url,
    ...(params.effectiveDate ? { legislationDate: params.effectiveDate } : {}),
    ...(params.lastAmended ? { dateModified: params.lastAmended } : {}),
    ...(params.sameAs?.length ? { sameAs: params.sameAs } : {}),
    ...(params.officialTextUrl ? { legislationIdentifier: params.officialTextUrl } : {}),
    legislationJurisdiction: params.jurisdictions.map((j) => ({
      '@type': 'AdministrativeArea',
      name: j,
    })),
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function glossaryEntryJsonLd(params: {
  term: string;
  shortDefinition: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: params.term,
    description: params.shortDefinition,
    url: params.url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: `${SITE_NAME} Glossary`,
      url: `${SITE_URL}/glossary/`,
    },
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.url}`,
    })),
  };
}
