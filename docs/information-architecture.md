# WireTechNews — Information Architecture

**Platform:** AI Governance, Privacy Law, Cybersecurity Compliance & Enterprise Risk Intelligence  
**Stack:** Astro 5+, React islands, TypeScript, Tailwind CSS, MDX, Cloudflare Pages  
**Paradigm:** Intelligence infrastructure, not a news blog.

---

## 1. Core Entity Architecture

The platform is built around a knowledge graph of first-class entities. Every piece of content is a node or an edge in this graph.

### Primary Entities

| Entity | Description | Key Attributes |
|---|---|---|
| **Regulation** | Laws, directives, regulations, acts | jurisdiction, status, type, effectiveDate, enforcingBody, penalties |
| **Jurisdiction** | Countries, regions, supranational bodies | level, activeRegulations, enforcementBodies |
| **Organization** | Vendors, regulators, standards bodies | type, jurisdiction, subjectTo, enforces |
| **Standard** | Compliance frameworks and certifications | mapsToRegulations, certifyingBody, sector |
| **Case** | Enforcement actions, court decisions | regulation, subject, outcome, penalty, jurisdiction |
| **Concept** | Defined legal/technical terms | definedBy (regulations), relatedConcepts |
| **Article** | All editorial content | multi-dimensional relations to all above |
| **Author** | Editorial contributors | credentials, expertise areas |
| **Newsletter** | Issue archives | referencedArticles, thematicFocus |

### Entity Type Taxonomy

**Regulation types:** `regulation | directive | law | act | framework | executive-order | guidance`  
**Regulation status:** `proposed | consultation | enacted | active | amended | repealed`  
**Organization types:** `vendor | regulator | standards-body | enforcement-agency | research-org | civil-society`  
**Case outcomes:** `fined | settled | dismissed | ongoing | appealed`

---

## 2. Semantic Taxonomy & Topic Clusters

Five primary topical domains, each functioning as a pillar hub with subordinate cluster content.

### Primary Topics

```
ai-governance
├── foundation-models-regulation
├── high-risk-ai-classification
├── ai-transparency-requirements
├── ai-liability
├── ai-procurement-due-diligence
├── synthetic-media-deepfakes
└── sector-specific-ai (healthcare, HR, credit, law-enforcement)

privacy-law
├── gdpr
├── us-state-privacy-laws
├── global-privacy-frameworks
├── consent-management
├── data-subject-rights
├── cross-border-data-transfers
└── children-data-privacy

cybersecurity-compliance
├── nis2-directive
├── dora-financial-sector
├── incident-reporting-obligations
├── vulnerability-disclosure
├── supply-chain-security
└── sector-specific-cybersecurity

enterprise-risk
├── third-party-vendor-risk
├── ai-risk-governance
├── operational-resilience
├── board-level-cyber-risk
└── insurance-cyber-coverage

regulatory-intelligence
├── enforcement-trends
├── cross-border-compliance
├── regulatory-convergence
└── emerging-regulations
```

### Pillar-to-Cluster Relationship Model

Each topic hub page (`/topic/[slug]/`) is a pillar that:
- Defines the regulatory landscape for that domain
- Links to all articles tagged with that topic
- Aggregates the key regulations, jurisdictions, and vendors relevant to the domain
- Surfaces recent enforcement cases
- Is updated whenever a subordinate piece is published (via Astro's content layer)

---

## 3. URL Architecture

No `/news/`, no `/blog/`. URLs signal intelligence and reference value.

### Content Routes

```
/                                    # Intelligence hub — editorial dashboard
/topic/[slug]/                       # Topical cluster hubs (pillar pages)
/analysis/[slug]/                    # Strategic long-form analysis
/briefing/[slug]/                    # Short tactical intelligence updates
/guide/[slug]/                       # Compliance how-to guides
/alert/[slug]/                       # Breaking regulatory alerts
```

### Reference Routes (Knowledge Graph Nodes)

```
/regulation/[slug]/                  # Regulation reference profiles
/regulation/gdpr/
/regulation/eu-ai-act/
/regulation/nis2/
/regulation/dora/
/regulation/ccpa/

/jurisdiction/[slug]/                # Country/region intelligence profiles
/jurisdiction/eu/
/jurisdiction/us/
/jurisdiction/uk/
/jurisdiction/[country]/[region]/    # Sub-jurisdictions (e.g., /jurisdiction/us/california/)

/vendor/[slug]/                      # Vendor intelligence profiles
/enforcer/[slug]/                    # Regulatory body profiles
/standard/[slug]/                    # Framework/standard reference profiles
/case/[slug]/                        # Enforcement case files
/concept/[slug]/                     # Defined terms glossary
```

### Editorial & Platform Routes

```
/author/[slug]/                      # Author profiles
/newsletter/                         # Archive index + signup
/newsletter/[issue-slug]/            # Individual newsletter issues
/search/                             # Search interface
```

### URL Conventions

- Slugs: kebab-case, no dates, no version numbers in primary entity URLs
- Regulations: use common shortname (`/regulation/gdpr/`, not `/regulation/eu-2016-679/`)
- Jurisdictions: ISO 3166-1 alpha-2 where applicable (`eu`, `us`, `uk`, `de`, `br`)
- Cases: `[subject]-[regulation]-[year]` format (`/case/meta-gdpr-fine-2023/`)
- No trailing version slugs — amendments update the same canonical page with `dateModified`

---

## 4. Content Collections Schema (Astro 5+)

### Directory Structure

```
src/content/
├── config.ts                    # All collection schemas
├── articles/
│   ├── analysis/
│   ├── briefings/
│   ├── guides/
│   ├── alerts/
│   └── case-studies/
├── regulations/                 # One .mdx per regulation
├── jurisdictions/               # One .mdx per country/region
├── vendors/                     # Vendor intelligence profiles
├── standards/                   # Framework/standard profiles
├── organizations/               # Regulatory bodies, enforcement agencies
├── cases/                       # Enforcement case files
├── concepts/                    # Glossary entries
├── authors/                     # Author profiles
├── topics/                      # Topic hub metadata
└── newsletters/                 # Archived newsletter issues
```

### Collection Schemas

**`articles` collection:**
```typescript
z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),                         // slug ref → authors
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  topic: z.string(),                          // primary topic slug
  secondaryTopics: z.array(z.string()).default([]),
  regulations: z.array(z.string()).default([]),
  jurisdictions: z.array(z.string()).default([]),
  vendors: z.array(z.string()).default([]),
  standards: z.array(z.string()).default([]),
  concepts: z.array(z.string()).default([]),
  cases: z.array(z.string()).default([]),
  contentType: z.enum(['analysis', 'briefing', 'guide', 'alert', 'case-study', 'explainer']),
  audience: z.array(z.enum(['ciso', 'dpo', 'legal', 'risk-officer', 'cto', 'board', 'general'])),
  intelligenceTier: z.enum(['strategic', 'tactical', 'operational']),
  premium: z.boolean().default(false),
  featured: z.boolean().default(false),
  image: z.object({ src: z.string(), alt: z.string() }).optional(),
  canonicalUrl: z.string().url().optional(),
})
```

**`regulations` collection:**
```typescript
z.object({
  name: z.string(),
  shortName: z.string(),
  type: z.enum(['regulation', 'directive', 'law', 'act', 'framework', 'executive-order', 'guidance']),
  jurisdictions: z.array(z.string()),
  status: z.enum(['proposed', 'consultation', 'enacted', 'active', 'amended', 'repealed']),
  effectiveDate: z.string().optional(),
  enactedDate: z.string().optional(),
  lastAmended: z.string().optional(),
  enforcingBodies: z.array(z.string()),       // slug refs → organizations
  relatedRegulations: z.array(z.string()),    // slug refs → regulations
  supersedes: z.array(z.string()).default([]),
  sectors: z.array(z.string()),               // ['all'] or specific sectors
  keyRequirements: z.array(z.string()),
  penalties: z.object({
    maxFineAbsolute: z.string().optional(),
    maxFinePercentRevenue: z.number().optional(),
    criminalLiability: z.boolean().default(false),
  }).optional(),
  officialTextUrl: z.string().url().optional(),
  sameAs: z.array(z.string().url()).default([]),  // Wikidata, EUR-Lex, etc.
})
```

**`cases` collection:**
```typescript
z.object({
  title: z.string(),
  description: z.string(),
  regulation: z.string(),                     // slug ref → regulations
  enforcer: z.string(),                       // slug ref → organizations
  subject: z.string(),                        // slug ref → vendors/organizations
  jurisdiction: z.string(),
  outcome: z.enum(['fined', 'settled', 'dismissed', 'ongoing', 'appealed']),
  fineAmount: z.string().optional(),
  caseDate: z.string(),
  resolvedDate: z.string().optional(),
  officialSourceUrl: z.string().url().optional(),
  keyFindings: z.array(z.string()),
})
```

**`concepts` collection:**
```typescript
z.object({
  term: z.string(),
  shortDefinition: z.string(),
  definedBy: z.array(z.string()),             // slug refs → regulations
  relatedConcepts: z.array(z.string()),       // slug refs → concepts
  relatedTopics: z.array(z.string()),
  practicalSignificance: z.string().optional(),
})
```

---

## 5. Knowledge Graph & Entity Relationships

### Relationship Matrix

```
Regulation ──── applies_in ──────► Jurisdiction
Regulation ──── enforced_by ─────► Organization
Regulation ──── amends/supersedes ► Regulation
Regulation ──── mapped_by ────────► Standard
Regulation ──── defines ──────────► Concept

Vendor ─────── subject_to ────────► Regulation
Vendor ─────── operates_in ───────► Jurisdiction
Vendor ─────── targeted_by ───────► Case

Case ────────── enforces ──────────► Regulation
Case ────────── brought_by ────────► Organization (enforcer)
Case ────────── against ───────────► Organization (vendor/subject)
Case ────────── occurred_in ───────► Jurisdiction

Article ──────── covers ──────────► any entity (multi-dimensional)
Article ──────── belongs_to ──────► Topic (primary)
Article ──────── references ──────► Concept[]

Standard ──────── satisfies ───────► Regulation
Standard ──────── certified_by ────► Organization
```

### Cross-Reference Rendering Model

Every entity page aggregates its graph neighborhood:

- **Regulation page** → enforcement cases, related standards, analysis articles, affected vendors, co-applicable jurisdictions
- **Vendor page** → applicable regulations by jurisdiction, enforcement history, related analysis, compliance status
- **Jurisdiction page** → active regulations, regulatory bodies, recent enforcement actions, risk profile
- **Case page** → regulation enforced, subject organization, enforcing body, related cases (same regulation or same subject)
- **Concept page** → regulations that use the term, related concepts, explanatory articles

This graph density is what differentiates the platform from a blog and builds genuine topical authority.

---

## 6. Structured Data / Schema.org Strategy

Every page type gets specific JSON-LD. Relationships are expressed via `about`, `mentions`, and `sameAs`.

### Schema Mapping by Page Type

| Page Type | Primary Schema | Supporting Schemas |
|---|---|---|
| Article/Analysis | `NewsArticle` | `BreadcrumbList`, `Person` (author) |
| Regulation profile | `LegalDocument` | `GovernmentOrganization`, `BreadcrumbList` |
| Vendor profile | `Corporation` | `BreadcrumbList` |
| Enforcer profile | `GovernmentOrganization` | `BreadcrumbList` |
| Enforcement case | `LegalCase` | `GovernmentOrganization`, `Corporation` |
| Concept/Glossary | `DefinedTerm` | `DefinedTermSet` |
| Topic hub | `CollectionPage` | `BreadcrumbList`, `ItemList` |
| Author profile | `Person` | `ProfilePage` |
| Newsletter issue | `NewsletterIssue` via `CreativeWork` | |
| Site-wide | `WebSite` (with Sitelinks Searchbox) | `Organization` |

### LegalDocument JSON-LD Pattern (Regulations)

```json
{
  "@context": "https://schema.org",
  "@type": "LegalDocument",
  "name": "General Data Protection Regulation",
  "alternateName": "GDPR",
  "identifier": "EU 2016/679",
  "legislationJurisdiction": {
    "@type": "AdministrativeArea",
    "name": "European Union"
  },
  "legislationPassedBy": { "@type": "GovernmentOrganization", "name": "European Parliament" },
  "legislationDate": "2016-04-27",
  "dateModified": "2023-07-01",
  "legislationType": "EURegulation",
  "url": "https://wiretechnews.com/regulation/gdpr/",
  "sameAs": [
    "https://www.wikidata.org/wiki/Q40797",
    "https://eur-lex.europa.eu/eli/reg/2016/679"
  ]
}
```

### Key Schema Principles

- Use `sameAs` on all entity pages to link Wikidata, EUR-Lex, official government sources — this is the primary entity disambiguation signal for AI systems
- Use `about` on articles to point to regulation/organization schemas — not just keywords
- `dateModified` must be accurate on regulation pages — AI systems use this for recency assessment
- `DefinedTermSet` on `/concept/` index enables glossary recognition by Google and LLMs

---

## 7. AI-Search & LLM Discoverability

### `/llms.txt` (Platform Root)

Following the emerging llms.txt convention. Structured for direct LLM consumption:

```
# WireTechNews

> AI Governance, Privacy Law, Cybersecurity Compliance & Enterprise Risk Intelligence Platform.
> Authoritative analysis and reference profiles for compliance professionals, DPOs, CISOs, and legal teams.

## Core Reference Content
- Regulation profiles: /regulation/ — canonical reference pages for GDPR, EU AI Act, NIS2, DORA, CCPA, and 40+ regulations
- Jurisdiction profiles: /jurisdiction/ — country-level regulatory intelligence
- Enforcement cases: /case/ — database of enforcement actions with outcomes and penalties
- Glossary: /concept/ — defined legal and technical terms with regulatory cross-references

## Analysis & Intelligence
- Strategic analysis: /analysis/
- Tactical briefings: /briefing/
- Compliance guides: /guide/
- Regulatory alerts: /alert/

## Topic Hubs
- AI Governance: /topic/ai-governance/
- Privacy Law: /topic/privacy-law/
- Cybersecurity Compliance: /topic/cybersecurity-compliance/
- Enterprise Risk: /topic/enterprise-risk/
```

### Additional Discoverability Assets

- **`/llms-full.txt`** — complete entity index with all regulation/vendor/case slugs and brief descriptions
- **`/sitemap.xml`** — full sitemap with `<lastmod>` and `<changefreq>`, segmented by content type
- **`/feed.xml`** — global RSS; plus per-topic feeds (`/topic/ai-governance/feed.xml`)
- **`robots.txt`** — explicitly allow: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `GoogleOther`, `anthropic-ai`
- **Entity `sameAs` links** — every regulation and organization links to Wikidata/authoritative URIs, the key signal for LLM entity resolution

### Temporal & Freshness Signals

Regulation and reference pages are not static documents — they change as laws are amended. Accurate `dateModified` in both JSON-LD and HTTP response headers is critical for AI citation accuracy. Each regulation page should surface a visible "Last verified" or "Last updated" date.

---

## 8. Editorial Workflow Architecture

### Content Types by Production Cadence

| Type | Cadence | Template Complexity | Primary Audience |
|---|---|---|---|
| **Regulatory Alert** | Breaking, same-day | Low — structured template | All |
| **Intelligence Briefing** | Daily/weekly | Low-medium | CISO, DPO, Legal |
| **Compliance Guide** | Evergreen | Medium | DPO, Legal, Risk |
| **Strategic Analysis** | Weekly | High | Board, CISO, Legal |
| **Case Study** | Per enforcement action | Medium | Legal, DPO |
| **Regulation Profile** | On enactment/amendment | High (initial), low (updates) | All |
| **Vendor Profile** | On major events | Medium | Risk, CISO |
| **Newsletter Issue** | Weekly | Templated | All subscribers |

### Update Protocols

- **Regulation amended:** Update regulation MDX (new `lastAmended`, update `keyRequirements`, add to `relatedRegulations`), publish an Alert article, link bidirectionally
- **Enforcement action:** Create Case MDX, update subject Vendor profile, update Regulation profile's case list, publish Briefing or Case Study
- **New regulation proposed:** Create Regulation MDX with `status: proposed`, publish Analysis on implications
- **Standard updated:** Update Standard MDX, update all Regulation MDX files that reference it via `mapsToRegulations`

---

## 9. Country / Law / Vendor Relationship Modeling

This is a three-dimensional compliance matrix. The content graph must express:

### Dimensions

1. **Geographic:** Which laws apply where (jurisdiction dimension)
2. **Organizational:** Which companies are subject to which laws (vendor dimension)
3. **Sectoral:** Which industries face additional requirements (sector dimension)
4. **Temporal:** When laws take effect and when they change (time dimension)

### Jurisdiction Page Structure

Each `/jurisdiction/[country]/` page aggregates:
- All regulations with `jurisdictions` containing this country
- All enforcement bodies operating in this jurisdiction
- Recent enforcement cases (from `cases` collection, filtered by `jurisdiction`)
- Sub-jurisdiction links (e.g., `/jurisdiction/us/` → `/jurisdiction/us/california/`)
- Cross-border data transfer implications (for data-exporting jurisdictions)

### Vendor Page Structure

Each `/vendor/[slug]/` page aggregates:
- Applicable regulations by jurisdiction (derived from vendor's operating regions)
- Active or resolved enforcement cases (from `cases` where `subject === vendor.slug`)
- Related analysis articles
- Compliance posture indicators (editorial, not legal advice)

### Regulation Page Structure

Each `/regulation/[slug]/` page aggregates:
- Applicable jurisdictions
- Enforcing bodies
- Key requirements (structured list)
- Penalty regime
- Related/superseding regulations
- Compliance standards that satisfy this regulation
- Enforcement cases filed under this regulation
- Recent analysis articles covering this regulation

---

## 10. Search Architecture

Static-first search using **Pagefind** (runs at Astro build time, deployed as static assets to Cloudflare CDN):

- Zero server dependencies — search index is JSON files served from CDN
- Sub-200ms search from Cloudflare edge cache
- Full-text search across all content collections
- Faceted filtering: `topic`, `contentType`, `regulation`, `jurisdiction`, `date range`, `audience`

### Search Index Configuration

Pagefind should index:
- Article title, description, body
- Regulation name, shortName, keyRequirements
- Concept term, shortDefinition
- Case title, keyFindings

Pagefind should exclude from index:
- Navigation, footer, sidebar boilerplate
- Schema.org JSON-LD blocks
- Newsletter signup CTAs

### Search UX Components (React Islands)

- Global search modal — keyboard shortcut `Cmd+K`, minimal hydration
- Inline faceted navigation on collection index pages
- "Related content" sidebar panel on all entity pages (computed at build time, no hydration)

---

## 11. Static Generation Strategy

### Build Model

Full static generation for all routes. No SSR, no ISR. Every route is a pre-built HTML file.

```
Content commit → GitHub Actions → Astro build → Cloudflare Pages deploy → CDN purge
```

### Page Generation Approach

- **Articles:** `getStaticPaths()` from `articles` collection — one page per entry
- **Regulation/Vendor/Jurisdiction/etc.:** `getStaticPaths()` from respective collection
- **Topic hubs:** Generated from `topics` collection + aggregated relational data at build time
- **Index pages:** Paginated static pages — e.g., `/briefings/`, `/briefings/2/`, `/briefings/3/`
- **Cross-reference pages:** e.g., `/regulation/gdpr/cases/` — filtered `cases` collection, fully static
- **Sitemap:** Generated at build time by Astro sitemap integration

### Performance Targets

| Metric | Target |
|---|---|
| LCP | < 1.2s |
| Total Blocking Time | < 50ms |
| JS bundle (client) | < 30KB |
| Build time (500 articles) | < 4 minutes |
| Cloudflare cache hit rate | > 90% |

### Cloudflare Caching Strategy

- HTML pages: `Cache-Control: public, max-age=3600, s-maxage=86400` — 24h edge cache, auto-purged on deploy
- Pagefind search index JSON: `max-age=3600` — refresh hourly (updated on every build)
- Hashed JS/CSS assets: `Cache-Control: public, max-age=31536000, immutable`
- API routes (newsletter signup): `Cache-Control: no-store`

---

## 12. Newsletter & Content Intelligence Integration

### Architecture

- Newsletter service: **Buttondown** or **Resend** — both offer simple REST APIs compatible with Cloudflare Workers/static form submission
- Subscription form: React island with `client:load` directive — only hydration point on most pages
- Archive: `src/content/newsletters/` — each issue as MDX, referencing article slugs for link preview rendering
- Issue URL: `/newsletter/[issue-slug]/` — publicly accessible, indexed

### Segmentation Model

Capture subscriber interests at signup for future segmentation:
- **Role:** CISO, DPO, Legal, Risk Officer, CTO, General
- **Topic interests:** ai-governance, privacy-law, cybersecurity-compliance, enterprise-risk
- **Jurisdiction focus:** eu, us, uk, apac, global

### Content Intelligence Integration

Each newsletter issue MDX references article slugs, allowing the newsletter archive pages to pull live frontmatter (title, description, topic) from the articles collection at build time — keeping archive pages accurate even if article metadata is updated post-issue.

---

## 13. Scalability Planning

### Content Scale Projections

| Phase | Articles | Regulations | Vendors | Jurisdictions | Est. Build Time |
|---|---|---|---|---|---|
| Launch (v1) | ~50 | ~20 | ~15 | ~10 | < 60s |
| Growth (v2) | ~300 | ~50 | ~50 | ~30 | < 2min |
| Scale (v3) | ~1,500 | ~100 | ~150 | ~60 | < 5min |
| Mature | ~5,000+ | ~150 | ~300 | ~80 | < 15min |

At v3+, consider Astro's content layer with incremental rebuilds, or route-level splitting via Cloudflare Workers for the most-visited regulation/vendor pages.

### Future Platform Extensions (No-Code-Change Required)

The URL and collection architecture supports these additions without restructuring:

- `/intelligence-reports/` — gated PDF research reports (new collection, new route)
- `/compliance-tracker/` — interactive compliance status matrix (React island consuming build-time data)
- `/api/v1/regulations/` — B2B data access layer (Cloudflare Worker, reads same content collections)
- `/tools/` — interactive calculators (GDPR fine estimator, AI Act risk classifier) — React islands
- Premium content gating — `premium: true` frontmatter field already in schema; gate at edge via Cloudflare Access

### Editorial Scale

As content volume grows, the `secondaryTopics`, `regulations`, `jurisdictions` arrays in article frontmatter become the primary maintenance burden. A content tagging governance guide should be established early to ensure consistent slug usage across collections.

---

## 14. AI-Era SEO Architecture Summary

The following properties make this platform competitive in AI-mediated search (Perplexity, ChatGPT Search, Google AI Overviews):

1. **Entity-first structure** — every regulation, vendor, enforcer, and concept has its own canonical page, not just tags on articles
2. **`sameAs` disambiguation** — links every entity to Wikidata, EUR-Lex, official government URIs — the primary signal LLMs use to resolve entity identity
3. **Accurate `dateModified`** — regulation pages updated on every amendment; LLMs weight recency heavily for compliance information
4. **Dense internal linking** — every article links to regulation, jurisdiction, vendor, and concept pages — and those pages link back — creating a coherent semantic graph
5. **`LegalDocument` schema** — Google and LLMs recognize `LegalDocument` type distinctly from generic articles, conferring authority signals
6. **`/llms.txt`** — direct consumption path for LLM crawlers that implement the spec
7. **RSS per topic** — AI crawlers that respect RSS can efficiently ingest topic-specific updates
8. **No client-side rendering of primary content** — all entity relationships and article bodies are in the static HTML, fully crawlable without JavaScript execution

---

## Implementation Sequence (When Ready to Scaffold)

When moving to scaffolding phase, implement in this order:

1. Astro project init with content collections config (`config.ts`) and all schemas
2. Base layouts: site shell, article layout, entity profile layout, topic hub layout
3. Seed data: 5–10 regulations, 3 jurisdictions, 5 vendors, 10 concepts
4. Static generation for all entity routes
5. Topic hub pages with relational aggregation
6. Pagefind search integration
7. JSON-LD components (one per schema type)
8. `/llms.txt`, `robots.txt`, sitemap
9. Newsletter signup integration
10. Article authoring workflow (MDX + frontmatter validation)
