/* Native anchors preserve full-document navigation in the static HTML export. */
/* oxlint-disable next/no-html-link-for-pages */
import { notFound } from 'next/navigation';
import {
  insightTopics,
  findTopic,
  topicPath,
  directorySchema,
} from '@/lib/insight-topics';
import { publishedArticles } from '@/lib/articles';
import { findService } from '@/lib/services';
import { pageMeta, absolute, sources } from '@/lib/site';
import { webpageSchema, breadcrumbSchema } from '@/lib/schema';
import {
  PageIntro,
  JsonLd,
  Sidebar,
  ContactBand,
  LawyerCards,
} from '@/components/site-shared';
import { InsightArticles } from '@/components/insight-articles';
type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () =>
  insightTopics.map((t) => ({ slug: t.slug }));
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const t = findTopic(slug);
  return t
    ? pageMeta(
        t.title + '专题｜婚姻家庭法律指南',
        t.description,
        topicPath(slug),
      )
    : {};
}
export default async function Topic({ params }: Props) {
  const { slug } = await params;
  const t = findTopic(slug);
  if (!t) notFound();
  const service = t.serviceSlug ? findService(t.serviceSlug) : undefined;
  const articles = publishedArticles.filter((a) => a.topicSlug === slug);
  const crumbs = [
    { name: '家事指南', path: '/insights/' },
    { name: t.title, path: topicPath(slug) },
  ];
  return (
    <main id="main">
      <JsonLd
        nodes={[
          {
            ...webpageSchema(
              topicPath(slug),
              t.title + '专题',
              t.description,
              'CollectionPage',
            ),
            isPartOf: { '@id': absolute('/insights/#webpage') },
            ...(articles.length
              ? {
                  mainEntity: {
                    '@id': absolute(topicPath(slug) + '#articles'),
                  },
                }
              : {}),
          },
          ...(articles.length
            ? [
                directorySchema(
                  topicPath(slug) + '#articles',
                  articles.map((a) => ({
                    name: a.title,
                    path: '/insights/' + a.slug + '/',
                  })),
                ),
              ]
            : []),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageIntro
        eyebrow="FAMILY LAW · TOPIC GUIDE"
        title={t.title}
        description={t.description}
        items={crumbs}
      />
      <section className="section">
        <div className="wrap content-layout">
          <div className="reading">
            <section id="start">
              <h2>先明确事实，再选择阅读方向</h2>
              <p>
                {service?.intro ||
                  '咨询涉及上海及周边多个地点时，请先整理登记、居住、工作及已办理程序的地点和时间。具体办理条件需要通过对应机构的最新信息核对。'}
              </p>
              <p>
                本专题按问题的不同阶段组织资料。先记录已经发生的事实、现有文件和希望解决的争议，再阅读与自己情形对应的内容。
              </p>
            </section>
            <section id="materials">
              <h2>可以先整理这些信息</h2>
              <ul>
                {t.preparation.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a
                className="text-link"
                href={'/resources/' + t.resourceSlug + '/'}
              >
                打开对应咨询准备清单 →
              </a>
              <p className="note">
                资料不齐也可以先咨询。首次联系可概括说明情况，避免直接发送完整身份、账户或未成年人信息。
              </p>
            </section>
            <section id="directory">
              <h2>按细分问题继续阅读</h2>
              <p>
                以下是本专题的内容目录。文章经审核发布后，会列在对应问题下。
              </p>
              <div className="topic-subsections">
                {t.subtopics.map((s) => {
                  const list = articles.filter((a) => a.subtopicId === s.id);
                  return (
                    <section id={s.id} key={s.id}>
                      <h3>{s.title}</h3>
                      {list.length ? (
                        <InsightArticles articles={list} />
                      ) : (
                        <p className="topic-pending">
                          该方向的专题解读尚在编写与审核。
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>
            </section>
            <section id="verify">
              <h2>阅读时核对三个条件</h2>
              <div className="source-list">
                {sources
                  .filter((s) =>
                    service
                      ? service.sources.includes(s.id)
                      : s.id === 'civil-code',
                  )
                  .map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.name} · {s.issuer} ↗
                    </a>
                  ))}
              </div>
              <ol>
                <li>
                  文章的事实前提是否与您的情况一致，是否存在另行说明的例外。
                </li>
                <li>
                  引用的是全国性规定、地方办理信息，还是仅适用于特定事实的个案材料。
                </li>
                <li>
                  发布日期、实质更新日期与复核日期，以及链接中的原始依据是否仍适用。
                </li>
              </ol>
              <div className="topic-related-links">
                <a href="/sources/">法律原文与官方核验入口 →</a>
                <a href="/editorial-policy/">作者责任、复核与纠错准则 →</a>
                {service ? (
                  <a href={'/services/' + service.slug + '/'}>
                    {service.title}服务与咨询范围 →
                  </a>
                ) : (
                  <a href="/contact/">上海到所地址与咨询准备 →</a>
                )}
              </div>
            </section>
            <section id="related">
              <h2>还有交叉问题？</h2>
              <div className="topic-related-links">
                {insightTopics
                  .filter((x) => x.slug !== slug)
                  .map((x) => (
                    <a key={x.slug} href={topicPath(x.slug)}>
                      {x.title} →
                    </a>
                  ))}
              </div>
            </section>
          </div>
          <Sidebar
            sections={[
              { id: 'start', title: '事实与阅读方向' },
              { id: 'materials', title: '准备哪些资料' },
              { id: 'directory', title: '细分问题目录' },
              { id: 'verify', title: '核验阅读依据' },
              { id: 'related', title: '关联专题' },
            ]}
          />
        </div>
      </section>
      <section className="section section-muted">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">MEET THE TEAM</div>
              <h2 className="serif">了解律师背景与业务</h2>
            </div>
          </div>
          <LawyerCards ids={service?.lawyers} />
        </div>
      </section>
      <ContactBand />
    </main>
  );
}
