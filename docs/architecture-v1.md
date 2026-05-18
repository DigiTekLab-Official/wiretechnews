# WireTechNews — V1 Architecture

This document supersedes `information-architecture.md` for implementation purposes. That document remains as design history. Build against this.

**Design principle:** Authoritative content earns authority. IA complexity does not. Every structural decision here optimises for publishing speed, editorial sustainability, and semantic correctness — not theoretical completeness.

---

## Collections: 4 Only

```
src/content/
├── config.ts
├── articles/          # All editorial content, flat directory
├── regulations/       # Regulation + framework reference pages
├── glossary/          # Defined terms
└── authors/           # Author profiles
```

Everything else — vendors, jurisdictions, enforcement cases, regulators, standards bodies — is **V2**. The URL structure is designed so adding them never requires redirects.

**Why four, not twelve:** Entity pages are only valuable when they have enough linked content to be non-trivial. At launch with 50 articles, vendor and jurisdiction pages would be stubs indistinguishable from a tag archive. Regulation and glossary pages are different — they're reference destinations that are valuable from the first article that links to them.

---

## Schemas

### `articles` collection

```typescript
// src/content/config.ts
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),                   // slug → authors collection
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    topic: z.enum([
      'ai-governance',
      'privacy-law',
      'cybersecurity-compliance',
      'enterprise-risk',
    ]),
    contentType: z.enum(['analysis', 'briefing', 'guide', 'alert']),
    regulations: z.array(z.string()).default([]),  // slugs → regulations collection
    featured: z.boolean().default(false),
    image: z.object({ src: z.string(), alt: z.string() }).optional(),
    premium: z.boolean().default(false),
    canonicalUrl: z.string().url().optional(),     // only for syndicated content
  }),
});
```

Required at publish time: `title`, `description`, `author`, `publishedAt`, `topic`, `contentType`. Everything else is optional. The `regulations` array is the sole relationship edge in V1 — fill it in when the article covers a specific regulation, leave it empty otherwise.

---

### `regulations` collection

```typescript
const regulations = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    type: z.enum(['regulation', 'directive', 'law', 'act', 'framework', 'guidance']),
    jurisdictions: z.array(z.string()),           // display strings, e.g. ['EU', 'EEA']
    status: z.enum(['proposed', 'active', 'amended', 'repealed']),
    effectiveDate: z.string().optional(),
    lastAmended: z.string().optional(),
    enforcingBody: z.string().optional(),         // display string in V1, slug ref in V2
    keyRequirements: z.array(z.string()),         // 4–8 bullet-length strings
    penalties: z.object({
      maxFine: z.string().optional(),             // e.g. "€20M or 4% global revenue"
      criminalLiability: z.boolean().default(false),
    }).optional(),
    relatedRegulations: z.array(z.string()).default([]),  // slugs → regulations
    officialTextUrl: z.string().url().optional(),
    sameAs: z.array(z.string().url()).default([]),        // Wikidata, EUR-Lex, gov sources
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),                                       // drives FAQPage JSON-LD
  }),
});
```

The MDX body of a regulation file is the main descriptive content — overview, scope, compliance obligations, implementation notes. Frontmatter carries structured data for JSON-LD and cross-referencing.

---

### `glossary` collection

```typescript
const glossary = defineCollection({
  type: 'content',
  schema: z.object({
    term: z.string(),
    shortDefinition: z.string(),              // one sentence, used in listings + JSON-LD
    regulations: z.array(z.string()).default([]),  // which regulations define/use this term
    relatedTerms: z.array(z.string()).default([]), // slugs → other glossary entries
    topic: z.enum([
      'ai-governance',
      'privacy-law',
      'cybersecurity-compliance',
      'enterprise-risk',
    ]).optional(),
  }),
});
```

MDX body: full definition, context, practical significance. `shortDefinition` is the one-liner used in listings and `DefinedTerm` JSON-LD.

---

### `authors` collection

```typescript
const authors = defineCollection({
  type: 'data',                               // YAML/JSON, no MDX body needed
  schema: z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string(),
    credentials: z.array(z.string()).optional(),   // e.g. ['CIPP/E', 'CISSP']
    linkedin: z.string().url().optional(),
    twitter: z.string().optional(),
    image: z.string().optional(),
  }),
});
```

---

## URL Structure

### V1 Routes

```
/                               # Home — editorial dashboard
/analysis/[slug]/               # Long-form strategic analysis
/briefing/[slug]/               # Short intelligence updates
/guide/[slug]/                  # Compliance how-to guides
/alert/[slug]/                  # Breaking regulatory alerts
/regulation/[slug]/             # Regulation reference profiles
/glossary/                      # Glossary index
/glossary/[slug]/               # Individual defined terms
/topic/[slug]/                  # Topic hub pages
/author/[slug]/                 # Author profiles
/newsletter/                    # Signup + archive stub
/search/                        # Pagefind search interface
```

### Conventions

- No `/blog/`, `/news/`, or `/posts/` — ever
- Content type is part of the URL (`/analysis/`, `/briefing/`) — it signals intent to both crawlers and readers
- Regulation slugs: use common shortname (`gdpr`, `eu-ai-act`, `nis2`, `dora`, `ccpa`)
- Glossary slugs: the term itself, kebab-cased (`data-minimization`, `legitimate-interest`)
- Article slugs: descriptive, keyword-rich, no dates (`gdpr-ai-act-overlap-analysis`, not `2024-03-gdpr-analysis`)

### V2 Routes (pre-designed, no refactor needed when added)

```
/jurisdiction/[slug]/           # Country/region profiles
/case/[slug]/                   # Enforcement case files
/vendor/[slug]/                 # Vendor intelligence profiles
/regulator/[slug]/              # Regulatory body profiles
/standard/[slug]/               # Framework/standard profiles
```

These slots are reserved. When V2 collections are added, extend `config.ts` with new schemas and add route files. No existing URLs change.

---

## Topic Hubs

Topics are **not a content collection**. They are a typed constant in config and a generated route.

```typescript
// src/lib/topics.ts
export const TOPICS = {
  'ai-governance': {
    label: 'AI Governance',
    description: 'Regulatory frameworks, compliance obligations, and governance practices for AI systems.',
  },
  'privacy-law': {
    label: 'Privacy & Data Protection',
    description: 'Global privacy regulations, data subject rights, and compliance strategy.',
  },
  'cybersecurity-compliance': {
    label: 'Cybersecurity Compliance',
    description: 'Regulatory obligations, frameworks, and incident response requirements for cybersecurity.',
  },
  'enterprise-risk': {
    label: 'Enterprise Risk',
    description: 'Governance, risk quantification, third-party risk, and board-level risk management.',
  },
} as const;

export type TopicSlug = keyof typeof TOPICS;
```

The `topic` enum in both `articles` and `glossary` schemas derives from `TopicSlug`. Adding a new topic means: add one entry to `TOPICS`, add the slug to both enums. The hub page at `/topic/[slug]/` is a single Astro route that aggregates articles and glossary entries filtered by topic slug at build time.

---

## Relationship Model

V1 has **one relationship**: `article → regulation`.

An article's `regulations: ['gdpr', 'eu-ai-act']` array is the complete graph for V1. Regulation reference pages back-aggregate: at build time, scan all articles, collect those where `regulations` includes the regulation slug, render as "Coverage" section on the regulation page.

That's the full relationship model. No graph engine, no complex join logic, no multi-dimensional cross-referencing.

**Why only one relationship type:** The knowledge graph only has value if the edges are accurate. Requiring 6 relationship arrays per article produces either (a) sparse, inaccurate graph edges or (b) editorial paralysis. One required relationship that authors actually fill in beats six optional relationships they don't.

**V2 extension path:** When `cases/`, `vendors/`, `jurisdictions/` collections are added, add optional relationship fields to the articles schema. They're additive, non-breaking, and can be backfilled progressively.

---

## Relationship Validation

Add a build-time check to `astro.config.ts` (or a standalone script run before build):

```typescript
// scripts/validate-references.ts
// Checks every slug in articles[].regulations[] against regulations collection slugs.
// Logs unresolved references to console — does NOT fail the build.
// Run as: node scripts/validate-references.ts
```

Unresolved slugs silently break the graph without this check. A warning on build surfaces drift before it accumulates.

---

## Structured Data Strategy

### Schema per page type

| Route | Primary Schema | Additional |
|---|---|---|
| `/analysis/[slug]/` | `Article` | `BreadcrumbList`, `Person` (author) |
| `/briefing/[slug]/` | `NewsArticle` | `BreadcrumbList`, `Person` |
| `/guide/[slug]/` | `HowTo` or `Article` | `BreadcrumbList` |
| `/alert/[slug]/` | `NewsArticle` | `BreadcrumbList` |
| `/regulation/[slug]/` | `LegalDocument` + `FAQPage` | `BreadcrumbList` |
| `/glossary/[slug]/` | `DefinedTerm` | `DefinedTermSet`, `BreadcrumbList` |
| `/topic/[slug]/` | `CollectionPage` | `BreadcrumbList`, `ItemList` |
| `/author/[slug]/` | `Person` | `ProfilePage` |
| `/` | `WebSite` | `Organization`, `ItemList` |

**Key decisions:**
- `analysis` and `guide` use `Article`, not `NewsArticle` — these are evergreen intelligence, not time-sensitive news. `NewsArticle` signals to AI systems that content ages; `Article` does not.
- `guide` uses `HowTo` when the page has a step-by-step structure. Derive this from MDX: if the guide body has ordered H2 sections, emit `HowTo`; otherwise emit `Article`.
- Every regulation page emits both `LegalDocument` and `FAQPage` — the FAQ section is the highest-ROI structured data for this content type.
- `sameAs` on regulation pages links to Wikidata, EUR-Lex, and official government URLs. This is the primary entity disambiguation signal for AI crawlers and the mechanism by which LLMs learn to associate the site's content with authoritative regulatory entities.

### Breadcrumb hierarchy

Use topical breadcrumbs, not URL-mirrored breadcrumbs:

```
Home > AI Governance > Analysis > [Article Title]
Home > Privacy & Data Protection > Guide > [Guide Title]
Home > Regulations > GDPR
Home > Glossary > Data Minimization
```

This signals topic nesting to Google's knowledge graph without changing URL structure.

---

## AI & LLM Discoverability

### `/public/llms.txt`

```
# WireTechNews

> AI Governance, Privacy Law, Cybersecurity Compliance & Enterprise Risk Intelligence Platform.
> Reference-grade analysis for compliance professionals, DPOs, CISOs, and legal teams.

## Data Provenance
Regulation profiles sourced from official legislative texts (EUR-Lex, Federal Register, official government portals).
Content reviewed within 72 hours of regulatory amendments or significant enforcement actions.
Last index update: [BUILD_DATE — injected at build time]

## Reference Content
- Regulations: /regulation/ — canonical profiles for GDPR, EU AI Act, NIS2, DORA, CCPA, and others
- Glossary: /glossary/ — defined legal and technical terms with regulatory cross-references

## Analysis & Intelligence
- /analysis/ — strategic long-form analysis
- /briefing/ — short tactical intelligence updates
- /guide/ — compliance how-to guides
- /alert/ — breaking regulatory alerts

## Topic Hubs
- /topic/ai-governance/
- /topic/privacy-law/
- /topic/cybersecurity-compliance/
- /topic/enterprise-risk/
```

Inject `BUILD_DATE` via Astro's `import.meta.env` or a build-time constant. A stale date here actively undermines trust.

### `robots.txt`

Distinguish search/inference crawlers from training data harvesters:

```
User-agent: *
Allow: /

# AI search and inference — allow (these power citations and discovery)
User-agent: PerplexityBot
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Applebot
Allow: /

# AI training data collection — disallow by default
# Review this policy if citation lift from model training is a priority
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: https://wiretechnews.com/sitemap.xml
```

`ClaudeBot` and `anthropic-ai` — omit (allow by default) or explicitly disallow based on business preference. Being cited by Claude in compliance answers has measurable brand value; the decision isn't purely technical.

### RSS feeds

- `/feed.xml` — global feed, all content types
- `/topic/[slug]/feed.xml` — per-topic feed (generated by topic hub route)

Topic-level RSS allows AI crawlers and newsletter aggregators to subscribe to a specific domain (e.g., AI governance only) without ingesting everything.

### Sitemap

Astro's sitemap integration, configured to include all routes with accurate `lastmod`. Segment by priority: regulation pages `priority: 0.9`, analysis/guides `priority: 0.8`, briefings/alerts `priority: 0.6`.

---

## Editorial Workflow

### Publishing an article

1. Create `src/content/articles/your-slug.mdx`
2. Fill required frontmatter: `title`, `description`, `author`, `publishedAt`, `topic`, `contentType`
3. Add `regulations: ['gdpr']` if the article covers specific regulations (optional but encouraged)
4. Write MDX body
5. `git push` → Cloudflare Pages builds and deploys automatically

Time from writing-complete to live: ~3 minutes (build + CDN propagation).

### Publishing a regulation profile

1. Create `src/content/regulations/[shortname].mdx` (e.g., `gdpr.mdx`)
2. Fill frontmatter (all required fields, plus `faq` array with 4–6 Q&As, plus `sameAs` URLs)
3. Write MDX body: overview, scope, key obligations, compliance timeline, practical notes
4. Push — regulation page and its back-linked articles panel are both live immediately

### Updating a regulation after amendment

1. Update `lastAmended` in frontmatter
2. Update `keyRequirements` if obligations changed
3. Update FAQ answers if thresholds/dates changed
4. Publish an `alert` article covering the amendment, with `regulations: ['gdpr']` in its frontmatter
5. The regulation page's "Coverage" panel automatically includes the new alert on next build

### Glossary entry

1. Create `src/content/glossary/[term-slug].mdx`
2. Frontmatter: `term`, `shortDefinition` (one sentence), optional `regulations[]` and `relatedTerms[]`
3. MDX body: full definition and practical context
4. No routing work needed — `/glossary/[slug]/` is already a dynamic route

---

## Static Generation

Full static output, no SSR. Every route is a pre-built HTML file served from Cloudflare's CDN.

```
git push → Cloudflare Pages → astro build → static HTML/CSS/JS → CDN deploy
```

### Build-time data flow

```
getCollection('articles')     ─┐
getCollection('regulations')  ─┼─► build-time aggregation ─► static HTML
getCollection('glossary')     ─┘
getCollection('authors')      ─┘
```

Regulation pages query `getCollection('articles')` filtered by slug to populate their coverage panel. Topic hubs query `getCollection('articles')` + `getCollection('glossary')` filtered by topic. All of this runs once at build time — zero runtime queries.

### Caching (Cloudflare Pages headers)

```
# _headers file in /public
/*
  Cache-Control: public, max-age=3600, s-maxage=86400

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/pagefind/*
  Cache-Control: public, max-age=3600
```

HTML pages: 1h browser, 24h edge (auto-purged on each deploy).  
Hashed assets: 1 year immutable.  
Pagefind search index: 1h (rebuilt on every deploy).

---

## Search

Pagefind — build-time static search index, zero server dependency.

```typescript
// astro.config.ts integration
import pagefind from 'astro-pagefind';
// Generates search index at build, serves as static JSON from CDN
```

**Indexed content:** article body + title + description, regulation name + shortName + keyRequirements, glossary term + shortDefinition + body.

**Excluded from index:** navigation, footer, JSON-LD script blocks, newsletter CTAs.

**Search UI:** Single React island at `/search/` with `client:load`. Facets: `topic`, `contentType`. No global search modal in V1 — a dedicated search page is simpler, fully crawlable, and sufficient for the initial audience.

---

## Newsletter Integration

V1 is lightweight: a signup form at `/newsletter/` that posts to a Cloudflare Worker endpoint, which calls the Resend or Buttondown API.

No newsletter archive collection in V1. Published newsletter issues are either `briefing` articles (if standalone editorial) or not archived publicly. Add a `newsletter` content type to the articles enum if archiving issues becomes a priority — it's one line in the schema.

---

## Minimum Content for a Credible Launch

| Content type | Count | Purpose |
|---|---|---|
| Regulation profiles | 10 | Core reference destinations |
| Glossary entries | 25–30 | Semantic SEO, AI citation surface |
| Analysis pieces | 5 | One per topic + one cross-domain |
| Briefings | 5–10 | Demonstrates active publication cadence |
| Guides | 3 | "How to comply with X" high-intent queries |
| Author profiles | 2–3 | Author credibility for E-E-A-T |

Target regulations at launch: GDPR, EU AI Act, NIS2, DORA, CCPA, UK GDPR, HIPAA, NIST CSF, ISO 27001, PCI-DSS.

A site with 10 deep regulation profiles + 30 glossary entries + 20 articles is more authoritative than a site with 200 thin articles and no reference content.

---

## V2 Extension Path

When the content base warrants expanding entity coverage, add collections without touching existing routes or schemas:

| Collection | Trigger | Minimum before launching |
|---|---|---|
| `cases/` | First enforcement cases worth profiling | 5+ cases with sufficient detail |
| `jurisdictions/` | Country profiles have 5+ original articles | 5 articles, 3 enforcement cases per jurisdiction |
| `vendors/` | Vendor profiles have authored editorial substance | Written profile + 3 enforcement cases or 5 articles |
| `regulators/` | Enforcement body profiles have authored depth | Written profile + case history |
| `standards/` | Standard profiles have compliance mapping | Written profile + regulation cross-map |

Each V2 collection: add to `config.ts`, add optional slug field to articles schema (`vendors: z.array(z.string()).default([])`), add route file, add to relationship validator script. No existing content or URLs change.

---

## Implementation Sequence

Do not start with schemas. Start with content.

1. **Write real content first** — 3 regulation MDX files, 5 article MDX files in flat directories with natural frontmatter. Observe what you actually reach for.
2. **Formalize schemas** — derive Zod schemas from what step 1 produced. Fix anything awkward.
3. **Base Astro project** — init, Tailwind, TypeScript strict, MDX integration, content collections with the finalized schemas.
4. **Layouts** — site shell, article layout, regulation layout, glossary layout, topic hub layout.
5. **JSON-LD components** — one component per schema type, rendered server-side in `<head>`.
6. **Pagefind** — add integration, configure index exclusions.
7. **`/llms.txt`, `robots.txt`, sitemap** — static files + Astro sitemap integration.
8. **Newsletter signup** — Cloudflare Worker + Resend API call.
9. **Cloudflare Pages** — connect repo, configure build command (`astro build`), output dir (`dist`).
10. **Relationship validator script** — add to CI as a warning-only check.
11. **Seed and publish** — load minimum content set, go live.
