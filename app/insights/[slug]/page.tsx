/* Native anchors preserve full-document navigation in the static HTML export. */
/* oxlint-disable next/no-html-link-for-pages */
import { notFound } from 'next/navigation';
import { publishedArticles, articleSchemas } from '@/lib/articles';
import { findLawyer } from '@/lib/lawyers';
import { findService } from '@/lib/services';
import { findTopic, topicPath } from '@/lib/insight-topics';
import { InsightArticles } from '@/components/insight-articles';
import { pageMeta, site } from '@/lib/site';
import {
  PageIntro,
  ContactBand,
  JsonLd,
  Sidebar,
} from '@/components/site-shared';
import { breadcrumbSchema } from '@/lib/schema';
type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () =>
  publishedArticles.map((a) => ({ slug: a.slug }));
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const a = publishedArticles.find((a) => a.slug === slug);
  return a ? pageMeta(a.title, a.summary, '/insights/' + a.slug + '/') : {};
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = publishedArticles.find((a) => a.slug === slug);
  if (!a) notFound();
  const topic = findTopic(a.topicSlug)!;
  const related = publishedArticles
    .filter(
      (p) =>
        p.slug !== a.slug &&
        ((a.relatedSlugs || []).includes(p.slug) ||
          p.topicSlug === a.topicSlug),
    )
    .slice(0, 4);
  const crumbs = [
    { name: '家事指南', path: '/insights/' },
    { name: topic.title, path: topicPath(topic.slug) },
    { name: a.title, path: '/insights/' + a.slug + '/' },
  ];
  const author = findLawyer(a.authorId)!;
  const reviewer = findLawyer(a.reviewerId)!;
  return (
    <main id="main">
      <JsonLd nodes={[...articleSchemas(a), breadcrumbSchema(crumbs)]} />
      <PageIntro
        eyebrow="JIANGHUAI INSIGHTS"
        title={a.title}
        description={a.summary}
        items={crumbs}
      />
      <section className="section">
        <div className="wrap content-layout">
          <article className="reading">
            <div className="article-meta">
              <a rel="author" href={'/lawyers/' + author.id + '/'}>
                作者：{author.name}律师
              </a>
              <a href={'/lawyers/' + reviewer.id + '/'}>
                复核：{reviewer.name}律师
              </a>
              <span>
                发布：<time dateTime={a.datePublished}>{a.datePublished}</time>
              </span>
              <span>
                更新：<time dateTime={a.dateModified}>{a.dateModified}</time>
              </span>
              <span>
                复核：<time dateTime={a.lastReviewed}>{a.lastReviewed}</time>
              </span>
            </div>
            <p className="note">适用范围：{a.jurisdiction}</p>
            {a.sections.map((s) => (
              <section id={s.id} key={s.id}>
                <h2>{s.title}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {s.sourceRefs?.length ? (
                  <p className="section-citations">
                    本节依据：
                    {s.sourceRefs.map((n) => (
                      <a href={'#source-' + n} key={n}>
                        [{n}] {a.sourceUrls[n - 1].name}
                      </a>
                    ))}
                  </p>
                ) : null}
                {s.bullets ? (
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
            {a.faqs.length > 0 ? (
              <section>
                <h2>相关问题</h2>
                {a.faqs.map((f) => (
                  <div className="faq-item" key={f.q}>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </section>
            ) : null}
            <section>
              <h2>法源与参考资料</h2>
              <div className="source-list">
                {a.sourceUrls.map((s, i) => (
                  <a
                    id={'source-' + (i + 1)}
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [{i + 1}] {s.name} ·{' '}
                    {
                      {
                        law: '法律原文',
                        'official-guide': '官方办理信息',
                        case: '公开个案',
                        research: '研究资料',
                        'question-source': '问题来源',
                      }[s.kind]
                    }{' '}
                    ↗
                  </a>
                ))}
              </div>
              {a.revisionNote ? (
                <p className="note">更新说明：{a.revisionNote}</p>
              ) : null}
              <p>
                <a href="/editorial-policy/">编辑与复核标准</a> ·{' '}
                <a href="/contact/">提交更正与补充依据</a>
              </p>
              <p className="note">
                本文为一般法律信息，不能代替对具体案件材料的审查；个案结果取决于事实、证据与适用法律。
              </p>
              <a
                className="text-link"
                href={'/services/' + a.serviceSlug + '/'}
              >
                {findService(a.serviceSlug)!.title}服务 →
              </a>
            </section>
            {related.length ? (
              <section>
                <h2>继续阅读</h2>
                <InsightArticles articles={related} />
              </section>
            ) : null}
            <section>
              <h2>咨询与到所信息</h2>
              <p>
                {site.name} · {site.address}
              </p>
              <p>
                电话 / 微信：<a href={site.phoneHref}>{site.phone}</a>（
                {site.contactLabel}）
              </p>
              <a className="text-link" href={topicPath(topic.slug)}>
                返回{topic.title}专题 →
              </a>
            </section>
          </article>
          <Sidebar
            sections={a.sections.map((s) => ({ id: s.id, title: s.title }))}
          />
        </div>
      </section>
      <ContactBand />
    </main>
  );
}
