# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

WireTechNews — AI Governance, Privacy Law, Cybersecurity Compliance & Enterprise Risk Intelligence Platform.

This is intelligence infrastructure, not a news blog. Think: compliance research platform, knowledge graph publication, cybersecurity intelligence hub.

## Stack

- **Astro 5+** — static-first, content collections, MDX
- **React** — islands only, minimal hydration (`client:load` for interactive components only)
- **TypeScript** — strict mode
- **Tailwind CSS**
- **Cloudflare Pages** — deployment target (not Vercel; avoid any Vercel-specific APIs)

## Commands

_To be updated once the project is scaffolded. Expected pattern:_

```bash
pnpm dev          # dev server
pnpm build        # production static build
pnpm preview      # preview production build locally
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
```

## Architecture

Active spec: `docs/architecture-v1.md`. Design history and review: `docs/information-architecture.md`, `docs/ia-review.md`.

**V1 Collections** (`src/content/`): `articles/`, `regulations/`, `glossary/`, `authors/` — four only. Schemas in `src/content/config.ts`.

**URL structure** — no `/news/` or `/blog/`. Editorial routes: `/analysis/[slug]/`, `/briefing/[slug]/`, `/guide/[slug]/`, `/alert/[slug]/`. Reference routes: `/regulation/[slug]/`, `/glossary/[slug]/`. Generated: `/topic/[slug]/`. V2 reserved (no refactor needed): `/jurisdiction/`, `/case/`, `/vendor/`, `/regulator/`, `/standard/`.

**Relationship model** — single edge in V1: `article.regulations[]` → regulation slugs. Regulation pages back-aggregate articles at build time. All relationships are validated at build time (warn, don't fail).

**Topics** — typed constant in `src/lib/topics.ts`, not a content collection. Topic hubs are generated Astro routes that aggregate by topic slug.

**Structured data** — `Article` for analysis, `NewsArticle` for briefings/alerts, `HowTo` for step-by-step guides, `LegalDocument` + `FAQPage` for regulations, `DefinedTerm` for glossary. All regulation pages include `sameAs` to Wikidata/EUR-Lex/official sources.

**Search** — Pagefind (static build-time index). Dedicated `/search/` page. No global modal in V1.

**AI discoverability** — `/llms.txt` with injected `BUILD_DATE`, per-topic RSS feeds, `robots.txt` allowing search crawlers (PerplexityBot, GoogleOther) and disallowing training crawlers (GPTBot, Google-Extended, CCBot).

## Coding Conventions

- React islands only where interactivity is strictly required (`client:load` on newsletter form, search UI)
- All primary content and entity relationships rendered as static HTML — never client-side
- Cloudflare Pages target: no Node.js server APIs, no runtime filesystem access
- Content frontmatter drives all cross-references — collection slugs only, no hardcoded URLs
- `authors` collection uses `type: 'data'` (YAML) — no MDX body needed
