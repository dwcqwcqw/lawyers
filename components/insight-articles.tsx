/* Static export serves precompressed WebP files without an image optimization server. */
/* oxlint-disable next/no-img-element */
import { type Article } from '@/lib/articles';
import { findLawyer } from '@/lib/lawyers';
export function InsightArticles({ articles }: { articles: Article[] }) {
  return (
    <div className="article-list">
      {articles.map((a) => (
        <article
          className={
            a.hero ? 'article-row article-row-illustrated' : 'article-row'
          }
          key={a.slug}
        >
          {a.hero ? (
            <a
              className="article-card-image"
              href={'/insights/' + a.slug + '/'}
              tabIndex={-1}
              aria-hidden="true"
            >
              <img
                src={a.hero.src}
                alt=""
                width={a.hero.width}
                height={a.hero.height}
                loading="lazy"
              />
            </a>
          ) : null}
          <div className="article-meta">
            <span>{findLawyer(a.authorId)!.name}律师</span>
            <span>
              更新 <time dateTime={a.dateModified}>{a.dateModified}</time>
            </span>
          </div>
          <a href={'/insights/' + a.slug + '/'}>
            <h3>{a.title}</h3>
            <p>{a.summary}</p>
          </a>
          <p className="article-meta">适用范围：{a.jurisdiction}</p>
        </article>
      ))}
    </div>
  );
}
