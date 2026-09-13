/* Keyboard users must be able to focus and horizontally scroll wide tables. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex */
/* Static export serves precompressed WebP files without an image optimization server. */
/* oxlint-disable next/no-img-element */
import type { ArticleBlock, RichRun } from '@/lib/articles';
export function InlineText({ runs }: { runs: RichRun[] }) {
  return (
    <>
      {runs.map((run, i) => {
        const text = run.bold ? <strong>{run.text}</strong> : run.text;
        if (!run.href || !run.href.startsWith('https://'))
          return <span key={i}>{text}</span>;
        const internal = run.href.startsWith('https://anxinlaw.xyz/');
        return (
          <a
            key={i}
            href={
              internal ? run.href.replace('https://anxinlaw.xyz', '') : run.href
            }
            {...(!internal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {text}
          </a>
        );
      })}
    </>
  );
}
export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'image')
          return (
            <figure className="article-figure" key={i}>
              <img
                src={block.src}
                alt={block.alt}
                width={block.width}
                height={block.height}
                loading="lazy"
              />
              <figcaption>{block.alt}</figcaption>
            </figure>
          );
        if (block.type === 'table')
          return (
            <div className="article-table-container" key={i}>
              <p className="table-hint">
                资料整理参考 · 手机上可左右滑动查看完整表格
              </p>
              <section
                className="article-table-scroll"
                aria-label={block.caption}
                tabIndex={0}
              >
                <table>
                  <caption className="sr-only">{block.caption}</caption>
                  <thead>
                    <tr>
                      {block.rows[0].map((cell, j) => (
                        <th scope="col" key={j}>
                          <InlineText runs={cell} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.slice(1).map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>
                            <InlineText runs={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          );
        if (block.type === 'heading')
          return (
            <h3 key={i}>
              <InlineText runs={block.runs} />
            </h3>
          );
        return (
          <p key={i}>
            <InlineText runs={block.runs} />
          </p>
        );
      })}
    </>
  );
}
