#!/usr/bin/env node
/**
 * Validates that regulation slugs referenced in article frontmatter
 * resolve to actual regulation files. Logs warnings — does not fail the build.
 *
 * Usage: node scripts/validate-references.js
 */

import { readFileSync, readdirSync } from 'fs';
import { join, basename, extname } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;
const ARTICLES_DIR = join(ROOT, 'src/content/articles');
const REGULATIONS_DIR = join(ROOT, 'src/content/regulations');

function getSlugs(dir) {
  try {
    return readdirSync(dir)
      .filter((f) => ['.md', '.mdx'].includes(extname(f)))
      .map((f) => basename(f, extname(f)));
  } catch {
    return [];
  }
}

function getArticleFiles(dir) {
  try {
    return readdirSync(dir)
      .filter((f) => ['.md', '.mdx'].includes(extname(f)))
      .map((f) => ({ file: f, path: join(dir, f) }));
  } catch {
    return [];
  }
}

const regulationSlugs = new Set(getSlugs(REGULATIONS_DIR));
const articleFiles = getArticleFiles(ARTICLES_DIR);

let warnings = 0;

for (const { file, path } of articleFiles) {
  try {
    const raw = readFileSync(path, 'utf8');
    const { data } = matter(raw);
    const refs = data.regulations ?? [];

    for (const ref of refs) {
      if (!regulationSlugs.has(ref)) {
        console.warn(`⚠  [${file}] references unknown regulation slug: "${ref}"`);
        warnings++;
      }
    }
  } catch (err) {
    console.warn(`⚠  Could not parse ${file}: ${err.message}`);
  }
}

if (warnings === 0) {
  console.log('✓ All regulation references resolved.');
} else {
  console.log(`\n${warnings} unresolved reference(s). Fix slugs or add missing regulation files.`);
}
