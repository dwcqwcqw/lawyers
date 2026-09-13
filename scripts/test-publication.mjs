import { mkdtemp, mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = await mkdtemp(join(tmpdir(), 'law-publication-'));
try {
  for (const p of ['scripts', 'lib', 'content/posts'])
    await mkdir(join(root, p), { recursive: true });
  await copyFile(
    'scripts/validate-content.mjs',
    join(root, 'scripts/validate-content.mjs'),
  );
  await copyFile(
    'lib/insight-topics.json',
    join(root, 'lib/insight-topics.json'),
  );
  // Synthetic fixture exists only in an isolated temporary directory, never in the site.
  const base = {
    slug: 'fixture-only',
    status: 'published',
    reviewStatus: 'approved',
    title: 'Fixture',
    summary: 'Test',
    serviceSlug: 'property',
    topicSlug: 'property',
    subtopicId: 'B1',
    authorId: 'xu-taotao',
    reviewerId: 'jiang-xiaoxia',
    datePublished: '2026-09-01',
    dateModified: '2026-09-01',
    lastReviewed: '2026-09-01',
    jurisdiction: 'Fixture',
    sourceUrls: [
      {
        name: 'Fixture source',
        kind: 'law',
        url: 'https://example.com/source',
      },
    ],
    sections: [
      {
        id: 'facts',
        title: 'Facts',
        paragraphs: ['x'.repeat(5100)],
        sourceRefs: [1],
      },
    ],
    faqs: [],
    relatedSlugs: [],
  };
  let count = 0;
  async function check(name, change, expected) {
    const a = structuredClone(base);
    change(a);
    await writeFile(
      join(root, 'content/posts/fixture.json'),
      JSON.stringify(a),
    );
    const r = spawnSync(process.execPath, ['scripts/validate-content.mjs'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(r.status, expected ? 0 : 1, name + ': ' + r.stdout + r.stderr);
    count++;
  }
  await check('valid categorized publication', () => {}, true);
  await check(
    'draft omitted',
    (a) => {
      a.status = 'draft';
      a.sections = [];
      a.reviewStatus = 'pending';
    },
    true,
  );
  await check('unreviewed blocked', (a) => (a.reviewStatus = 'pending'), false);
  await check('wrong subtopic blocked', (a) => (a.subtopicId = 'C1'), false);
  await check(
    'wrong service blocked',
    (a) => (a.serviceSlug = 'children'),
    false,
  );
  await check(
    'short body blocked',
    (a) => (a.sections[0].paragraphs = ['short']),
    false,
  );
  await check(
    'oversized body blocked',
    (a) => (a.sections[0].paragraphs = ['x'.repeat(10001)]),
    false,
  );
  await check(
    'broken source ref blocked',
    (a) => (a.sections[0].sourceRefs = [2]),
    false,
  );
  await check(
    'missing source ref blocked',
    (a) => (a.sections[0].sourceRefs = []),
    false,
  );
  await check(
    'unpublished related article blocked',
    (a) => (a.relatedSlugs = ['not-published']),
    false,
  );
  await check(
    'unexplained update blocked',
    (a) => {
      a.dateModified = '2026-09-02';
      a.lastReviewed = '2026-09-02';
    },
    false,
  );
  console.log(`Publication workflow: ${count} checks passed.`);
} finally {
  await rm(root, { recursive: true, force: true });
}
