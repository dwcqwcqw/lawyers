/* Native anchors preserve full-document navigation in the static HTML export. */
/* oxlint-disable next/no-html-link-for-pages */
import { resources } from '@/lib/resources';
import { publishedArticles } from '@/lib/articles';
import {
  insightTopics,
  topicPath,
  directorySchema,
} from '@/lib/insight-topics';
import { pageMeta, absolute } from '@/lib/site';
import { PageIntro, ContactBand, JsonLd } from '@/components/site-shared';
import { InsightArticles } from '@/components/insight-articles';
import { webpageSchema, breadcrumbSchema } from '@/lib/schema';
export const metadata = pageMeta(
  '婚姻家庭法律指南｜上海家事专题与咨询准备',
  '上海江怀律师事务所婚姻家庭知识目录：离婚、房产、抚养、债务、股权、家庭协议、继承与上海咨询。按主题查阅准备清单、法源和已发布的文章。',
  '/insights/',
);
export default function Insights() {
  const latestArticles = [...publishedArticles].sort(
    (a, b) =>
      b.dateModified.localeCompare(a.dateModified) ||
      b.datePublished.localeCompare(a.datePublished),
  );
  return (
    <main id="main">
      <JsonLd
        nodes={[
          {
            ...webpageSchema(
              '/insights/',
              '婚姻家庭法律指南',
              '婚姻家庭主题目录、咨询准备与法律解读',
              'CollectionPage',
            ),
            mainEntity: { '@id': absolute('/insights/#topics') },
          },
          directorySchema(
            '/insights/#topics',
            insightTopics.map((t) => ({
              name: t.title,
              path: topicPath(t.slug),
            })),
          ),
          breadcrumbSchema([{ name: '家事指南', path: '/insights/' }]),
        ]}
      />
      <PageIntro
        eyebrow="JIANGHUAI · FAMILY LAW LIBRARY"
        title="理解家事问题，找到下一步。"
        description="从事实、证据与适用条件出发。这里按婚姻家庭问题建立阅读路径，连接专题指南、咨询准备、法律原文与律师资料，帮助您有条理地了解自己的处境。"
        items={[{ name: '家事指南', path: '/insights/' }]}
      />
      <div className="insights-bar">
        <div className="wrap">
          <a href="#topics">文章与专题 ↓</a>
          <a href="#preparation">准备咨询材料 ↓</a>
          <a href="/sources/">核对法律原文 ↗</a>
        </div>
      </div>
      <section className="section insights-latest insights-library" id="topics">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">EXPLORE FAMILY LAW</div>
              <h2 className="serif">文章与专题</h2>
            </div>
            <p className="insights-caption">阅读最新解读，或按家庭问题查找。</p>
          </div>
          <div className="insights-library-layout">
            <nav className="library-topics" aria-label="家事专题">
              <h3>按主题阅读</h3>
              <a className="library-latest-link" href="#latest">
                最新更新 <span>↓</span>
              </a>
              {insightTopics.map((t) => (
                <a key={t.slug} href={topicPath(t.slug)}>
                  {t.title}
                  <span>
                    {publishedArticles.filter((a) => a.topicSlug === t.slug).length} 篇 ↗
                  </span>
                </a>
              ))}
            </nav>
            <div className="library-articles" id="latest">
              <div className="library-articles-heading">
                <h3>全部文章</h3>
                <span>共 {latestArticles.length} 篇 · 按更新时间排序</span>
              </div>
              {latestArticles.length ? (
                <InsightArticles articles={latestArticles} />
              ) : (
                <div className="insights-empty">
                  <h3>文章正在准备中</h3>
                  <p>您可以先按主题查阅准备清单、法源与咨询信息。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="insights-trust">
        <div className="wrap insights-trust-grid">
          <div>
            <div className="eyebrow">HOW TO READ THIS LIBRARY</div>
            <h2 className="serif">
              每一条判断，
              <br />
              都应能找到依据。
            </h2>
            <p>
              上海江怀律师事务所维护本栏目。文章标注真实作者与更新时间；已确认的复核信息随文章展示。
            </p>
            <a href="/about/">了解律所与核验入口 →</a>
          </div>
          <div className="trust-links">
            <a href="/lawyers/">
              <strong>谁在解释与审核</strong>
              <span>
                查看律师背景；文章关联具体作者，实际复核信息以文章标注为准。
              </span>
            </a>
            <a href="/sources/">
              <strong>依据来自哪里</strong>
              <span>区分法律原文、地方办理信息与个案材料。</span>
            </a>
            <a href="/editorial-policy/">
              <strong>何时复核，如何纠错</strong>
              <span>记录实质更新和适用范围，提供纠错渠道。</span>
            </a>
          </div>
        </div>
      </section>
      <section className="section" id="preparation">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">GET PREPARED</div>
              <h2 className="serif">从三份材料清单开始</h2>
            </div>
          </div>
          <div className="resource-grid">
            {resources.map((r, i) => (
              <a
                href={'/resources/' + r.slug + '/'}
                className="resource-card"
                key={r.slug}
              >
                <span className="resource-num">0{i + 1}</span>
                <h3>{r.title}</h3>
                <p>{r.description}</p>
                <span className="text-link">阅读与打印 →</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <ContactBand />
    </main>
  );
}
