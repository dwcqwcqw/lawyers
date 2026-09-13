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
  '上海江怀律师事务所婚姻家庭知识目录：离婚、房产、抚养、债务、股权、家庭协议、继承与上海咨询。按主题查阅准备清单、法源和经审核发布的文章。',
  '/insights/',
);
export default function Insights() {
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
          <a href="#topics">按问题找专题 ↓</a>
          <a href="#preparation">准备咨询材料 ↓</a>
          <a href="#latest">阅读最新文章 ↓</a>
          <a href="/sources/">核对法律原文 ↗</a>
        </div>
      </div>
      <section className="section" id="topics">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">EXPLORE BY SUBJECT</div>
              <h2 className="serif">八个专题，一张家事问题地图</h2>
            </div>
            <p className="insights-caption">
              先定位主要争议，再沿相关主题补齐信息。
            </p>
          </div>
          <div className="insights-topic-grid">
            {insightTopics.map((t, i) => (
              <article className="insights-topic-card" key={t.slug}>
                <span className="topic-number">0{i + 1}</span>
                <h3 className="serif">
                  <a href={topicPath(t.slug)}>
                    {t.title} <span aria-hidden="true">↗</span>
                  </a>
                </h3>
                <p>{t.description}</p>
                <ul>
                  {t.subtopics.slice(0, 3).map((s) => (
                    <li key={s.id}>
                      <a href={topicPath(t.slug) + '#' + s.id}>{s.title}</a>
                    </li>
                  ))}
                </ul>
                <a className="text-link" href={topicPath(t.slug)}>
                  查看完整专题与阅读路径 →
                </a>
              </article>
            ))}
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
              上海江怀律师事务所维护本栏目。法律解读须经过实际审核后发布，署名与审核信息随文章展示。
            </p>
            <a href="/about/">了解律所与核验入口 →</a>
          </div>
          <div className="trust-links">
            <a href="/lawyers/">
              <strong>谁在解释与审核</strong>
              <span>查看律师背景；文章关联具体作者与复核人。</span>
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
      <section className="section section-muted" id="latest">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">LATEST INSIGHTS</div>
              <h2 className="serif">律师观点与家事解读</h2>
            </div>
          </div>
          {publishedArticles.length ? (
            <InsightArticles articles={publishedArticles} />
          ) : (
            <div className="insights-empty">
              <h3>专题文章正在编写与审核</h3>
              <p>
                通过审核的文章将在这里陆续发布，并归入对应专题。您现在可以浏览专题中的事实梳理、准备清单与法律核验入口。
              </p>
              <a className="text-link" href="/editorial-policy/">
                了解文章发布标准 →
              </a>
            </div>
          )}
        </div>
      </section>
      <ContactBand />
    </main>
  );
}
