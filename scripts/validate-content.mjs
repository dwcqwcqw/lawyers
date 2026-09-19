import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const files = (
  await readdir(new URL('../content/posts/', import.meta.url))
).filter((x) => x.endsWith('.json'));
const knownAuthors = new Set(['xu-taotao', 'jiang-xiaoxia', 'zhang-ziyuan']);
const knownServices = new Set([
  'divorce',
  'children',
  'property',
  'debt',
  'business-assets',
  'agreements',
  'inheritance',
]);
const topics = JSON.parse(
  await readFile(
    new URL('../lib/insight-topics.json', import.meta.url),
    'utf8',
  ),
);
const articleData = [];
const errors = [];
const slugs = new Set();
let published = 0;
const validDate = (x) =>
  /^\d{4}-\d{2}-\d{2}$/.test(x) &&
  !Number.isNaN(Date.parse(x)) &&
  new Date(x).toISOString().slice(0, 10) === x;
for (const file of files) {
  let a;
  try {
    a = JSON.parse(
      await readFile(
        new URL('../content/posts/' + file, import.meta.url),
        'utf8',
      ),
    );
  } catch {
    errors.push(file + ': invalid JSON');
    continue;
  }
  const fail = (msg) => errors.push(file + ': ' + msg);
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(a.slug)) fail('invalid slug');
  if (slugs.has(a.slug)) fail('duplicate slug');
  slugs.add(a.slug);
  if (!['draft', 'published'].includes(a.status)) fail('unknown status');
  if (a.status !== 'published') continue;
  published++;
  articleData.push(a);
  const topic = topics.find((t) => t.slug === a.topicSlug);
  if (!topic?.subtopics.some((s) => s.id === a.subtopicId))
    fail('topic/subtopic mismatch');
  if (topic?.serviceSlug && a.serviceSlug !== topic.serviceSlug)
    fail('topic/service mismatch');
  if (!['approved', 'publication-approved'].includes(a.reviewStatus))
    fail('publication requires approval');
  if (
    a.reviewStatus === 'publication-approved' &&
    (!a.publicationApproval?.trim() ||
      !a.sourceDocument?.startsWith('https://'))
  )
    fail('explicit publication approval and source required');
  if (
    a.reviewStatus === 'publication-approved' &&
    (a.reviewerId || a.lastReviewed)
  )
    fail('do not claim unconfirmed lawyer review');
  for (const key of ['title', 'summary', 'jurisdiction'])
    if (typeof a[key] !== 'string' || !a[key].trim()) fail('missing ' + key);
  if (
    !knownAuthors.has(a.authorId) ||
    (a.reviewStatus === 'approved' && !knownAuthors.has(a.reviewerId))
  )
    fail('unknown author or reviewer');
  if (!knownServices.has(a.serviceSlug)) fail('unknown service');
  for (const k of [
    'datePublished',
    'dateModified',
    ...(a.reviewStatus === 'approved' ? ['lastReviewed'] : []),
  ])
    if (!validDate(a[k])) fail('invalid ' + k);
  if (
    a.dateModified < a.datePublished ||
    (a.reviewStatus === 'approved' &&
      (a.lastReviewed < a.dateModified ||
        a.lastReviewed > new Date().toISOString().slice(0, 10)))
  )
    fail('review/publication chronology invalid');
  if (!Array.isArray(a.sourceUrls) || !a.sourceUrls.length)
    fail('missing law sources');
  else
    for (const s of a.sourceUrls) {
      if (
        ![
          'law',
          'official-guide',
          'professional-record',
          'case',
          'research',
          'question-source',
        ].includes(s.kind)
      )
        fail('source kind required');
      if (!s.name || !s.url.startsWith('https://'))
        fail('source needs name and HTTPS URL');
    }
  if (!Array.isArray(a.sections) || !a.sections.length)
    fail('missing body sections');
  else {
    const ids = new Set();
    for (const s of a.sections) {
      if (!/^[a-z][a-z0-9-]*$/.test(s.id) || ids.has(s.id))
        fail('invalid or duplicate section id');
      ids.add(s.id);
      if (
        !s.title ||
        !Array.isArray(s.paragraphs) ||
        !s.paragraphs.length ||
        s.paragraphs.some((p) => typeof p !== 'string' || !p.trim())
      )
        fail('invalid section body');
    }
  }
  const validateRuns = (runs) => {
    if (
      !Array.isArray(runs) ||
      runs.some(
        (r) =>
          typeof r.text !== 'string' ||
          (r.href && !r.href.startsWith('https://')),
      )
    )
      fail('invalid rich text or link');
  };
  for (const b of [
    a.hero,
    ...(a.intro || []),
    ...(a.sections || []).flatMap((s) => s.blocks || []),
  ].filter(Boolean)) {
    if (b.type === 'image') {
      if (
        !/^\/images\/articles\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|png|jpg)$/.test(
          b.src,
        ) ||
        !existsSync(new URL('../public' + b.src, import.meta.url)) ||
        !b.alt?.trim() ||
        !(b.width > 0 && b.height > 0)
      )
        fail('invalid article image');
    } else if (b.type === 'table') {
      if (
        !b.caption ||
        !Array.isArray(b.rows) ||
        b.rows.length < 2 ||
        !b.rows[0]?.length ||
        b.rows.some((r) => r.length !== b.rows[0].length)
      )
        fail('invalid article table');
      else b.rows.flat().forEach(validateRuns);
    } else if (['paragraph', 'heading'].includes(b.type)) validateRuns(b.runs);
    else fail('unknown rich content block');
  }
  const body = [
    a.summary,
    ...(a.sections || []).flatMap((s) => [
      s.title,
      ...(s.paragraphs || []),
      ...(s.bullets || []),
    ]),
    ...(a.faqs || []).flatMap((f) => [f.q, f.a]),
  ]
    .map((text) => String(text).replace(/https?:\/\/[^\s\u3000-\u9fff]+/g, ''))
    .join('')
    .replace(/\s/g, '');
  if (body.length < 5000 || body.length > 10000)
    fail(
      'article body must contain 5000–10000 non-whitespace characters, excluding URLs',
    );
  for (const section of a.sections || [])
    if (
      section.sourceRefs &&
      (!Array.isArray(section.sourceRefs) ||
        section.sourceRefs.some(
          (n) =>
            !Number.isInteger(n) || n < 1 || n > (a.sourceUrls || []).length,
        ))
    )
      fail('invalid section source reference');
  if (!(a.sections || []).some((s) => s.sourceRefs?.length))
    fail('add claim-level source references');
  if (a.dateModified > a.datePublished && !a.revisionNote?.trim())
    fail('substantive update needs revisionNote');
  if (
    !Array.isArray(a.relatedSlugs) ||
    a.relatedSlugs.some((s) => typeof s !== 'string' || s === a.slug)
  )
    fail('invalid relatedSlugs');
  if (!Array.isArray(a.faqs) || a.faqs.some((f) => !f.q || !f.a))
    fail('invalid FAQ');
}
for (const a of articleData)
  for (const slug of a.relatedSlugs || [])
    if (!articleData.some((p) => p.slug === slug))
      errors.push(a.slug + ': related article not published: ' + slug);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Content validation passed: ${published} published articles, ${files.length - published} drafts excluded.`,
);
