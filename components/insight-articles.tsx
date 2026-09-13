import { type Article } from '@/lib/articles';
import { findLawyer } from '@/lib/lawyers';
export function InsightArticles({ articles }: { articles: Article[] }) {
  return (
    <div className="article-list">
      {articles.map((a) => (
        <article className="article-row" key={a.slug}>
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
