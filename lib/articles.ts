/// <reference types="vite/client" />
import { findLawyer } from './lawyers';
import { findService } from './services';
import { absolute } from './site';
import { findTopic, topicPath } from './insight-topics';
import { firmId, personSchema, webpageSchema } from './schema';
export type RichRun = { text: string; bold?: boolean; href?: string };
export type ArticleBlock =
  | { type: 'paragraph' | 'heading'; runs: RichRun[] }
  | { type: 'image'; src: string; alt: string; width: number; height: number }
  | { type: 'table'; caption: string; rows: RichRun[][][] };
export type Article = {
  slug: string;
  status: 'draft' | 'published';
  reviewStatus: 'pending' | 'approved' | 'publication-approved';
  publicationApproval?: string;
  sourceDocument?: string;
  authorLine?: string;
  hero?: Extract<ArticleBlock, { type: 'image' }>;
  intro?: ArticleBlock[];
  title: string;
  summary: string;
  serviceSlug: string;
  topicSlug: string;
  subtopicId: string;
  relatedSlugs: string[];
  revisionNote?: string;
  authorId: string;
  reviewerId?: string;
  datePublished: string;
  dateModified: string;
  lastReviewed?: string;
  jurisdiction: string;
  sourceUrls: {
    name: string;
    url: string;
    kind: 'law' | 'official-guide' | 'professional-record' | 'case' | 'research' | 'question-source';
  }[];
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    blocks?: ArticleBlock[];
    bullets?: string[];
    sourceRefs?: number[];
  }[];
  faqs: { q: string; a: string }[];
};
const modules = import.meta.glob<Article>('../content/posts/*.json', {
  eager: true,
  import: 'default',
});
export const publishedArticles = Object.values(modules)
  .filter(
    (a) =>
      a.status === 'published' &&
      (a.reviewStatus === 'approved' ||
        (a.reviewStatus === 'publication-approved' &&
          a.publicationApproval &&
          a.sourceDocument)) &&
      findLawyer(a.authorId) &&
      (a.reviewStatus !== 'approved' ||
        (a.reviewerId && findLawyer(a.reviewerId) && a.lastReviewed)) &&
      findService(a.serviceSlug) &&
      findTopic(a.topicSlug)?.subtopics.some((s) => s.id === a.subtopicId) &&
      a.title &&
      a.sections.length > 0,
  )
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished));
export function articleSchemas(a: Article) {
  const path = '/insights/' + a.slug + '/';
  const author = findLawyer(a.authorId)!;
  const articleImages = [
    ...(a.hero ? [a.hero.src] : []),
    ...a.sections.flatMap((section) =>
      (section.blocks || [])
        .filter(
          (block): block is Extract<ArticleBlock, { type: 'image' }> =>
            block.type === 'image',
        )
        .map((block) => block.src),
    ),
  ].filter((src, index, images) => images.indexOf(src) === index);
  const reviewer =
    a.reviewStatus === 'approved' && a.reviewerId
      ? findLawyer(a.reviewerId)
      : undefined;
  return [
    personSchema(author),
    ...(reviewer && reviewer.id !== author.id ? [personSchema(reviewer)] : []),
    {
      ...webpageSchema(path, a.title, a.summary),
      mainEntity: { '@id': absolute(path + '#article') },
      ...(reviewer
        ? {
            reviewedBy: { '@id': personSchema(reviewer)['@id'] },
            lastReviewed: a.lastReviewed,
          }
        : {}),
    },
    {
      '@type': 'Article',
      '@id': absolute(path + '#article'),
      headline: a.title,
      ...(articleImages.length
        ? { image: articleImages.map((src) => absolute(src)) }
        : {}),
      description: a.summary,
      inLanguage: 'zh-CN',
      author: { '@id': personSchema(author)['@id'] },
      publisher: { '@id': firmId },
      datePublished: a.datePublished,
      dateModified: a.dateModified,
      mainEntityOfPage: { '@id': absolute(path + '#webpage') },
      about: { '@id': absolute('/services/' + a.serviceSlug + '/#service') },
      citation: a.sourceUrls.map((s) => s.url),
      isPartOf: { '@id': absolute(topicPath(a.topicSlug) + '#webpage') },
      articleSection: findTopic(a.topicSlug)!.title,
    },
  ];
}
