import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    topic: z.enum(['ai-governance', 'privacy-law', 'cybersecurity-compliance', 'enterprise-risk']),
    contentType: z.enum(['analysis', 'briefing', 'guide', 'alert']),
    regulations: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    image: z.object({ src: z.string(), alt: z.string() }).optional(),
    premium: z.boolean().default(false),
    canonicalUrl: z.string().url().optional(),
  }),
});

const regulations = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    type: z.enum(['regulation', 'directive', 'law', 'act', 'framework', 'guidance']),
    jurisdictions: z.array(z.string()),
    status: z.enum(['proposed', 'active', 'amended', 'repealed']),
    effectiveDate: z.string().optional(),
    lastAmended: z.string().optional(),
    enforcingBody: z.string().optional(),
    keyRequirements: z.array(z.string()),
    penalties: z
      .object({
        maxFine: z.string().optional(),
        criminalLiability: z.boolean().default(false),
      })
      .optional(),
    relatedRegulations: z.array(z.string()).default([]),
    officialTextUrl: z.string().url().optional(),
    sameAs: z.array(z.string().url()).default([]),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),
  }),
});

const glossary = defineCollection({
  type: 'content',
  schema: z.object({
    term: z.string(),
    shortDefinition: z.string(),
    regulations: z.array(z.string()).default([]),
    relatedTerms: z.array(z.string()).default([]),
    topic: z
      .enum(['ai-governance', 'privacy-law', 'cybersecurity-compliance', 'enterprise-risk'])
      .optional(),
  }),
});

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string(),
    credentials: z.array(z.string()).optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { articles, regulations, glossary, authors };
