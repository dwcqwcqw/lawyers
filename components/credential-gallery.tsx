'use client';

import { useRef, useState } from 'react';
import type { Credential } from '@/lib/credentials';

export function CredentialGallery({ items, featured = false }: { items: Credential[]; featured?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Credential | null>(null);

  function open(item: Credential) {
    setSelected(item);
    dialog.current?.showModal();
  }

  return <>
    <div className={'credential-grid' + (featured ? ' credential-featured' : '')}>
      {items.map(item => <article className="credential-card" key={item.id}>
        {item.image && <button className="credential-image-button" onClick={() => open(item)} aria-label={'放大查看：' + item.title}>
          <img src={item.image} alt={item.title + '，' + item.issuer + '颁发的原件照片'}
            className={item.rotation ? 'credential-rotated' : undefined} loading="lazy" decoding="async"
            width={item.rotation ? 1706 : 1279} height={item.rotation ? 1279 : 1706} />
          <span className="credential-enlarge">查看原件 ↗</span>
        </button>}
        {!item.image && <div className="credential-text-panel" aria-hidden="true"><span>专业培训与进修</span><strong>{item.issuer}</strong><span>非学历教育 · 专题培训</span></div>}
        <div className="credential-copy">
          <p className="credential-period">{item.period}</p>
          <h3>{item.title}</h3>
          <p className="credential-issuer">{item.issuer}</p>
          <p className="credential-description">{item.description}</p>
        </div>
      </article>)}
    </div>
    <dialog ref={dialog} className="credential-dialog" aria-labelledby="credential-dialog-title"
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="credential-dialog-header">
        <h2 id="credential-dialog-title">{selected?.title}</h2>
        <button className="credential-close" onClick={() => dialog.current?.close()} aria-label="关闭证书预览" autoFocus>关闭 ×</button>
      </div>
      {selected?.image && <img src={selected.image} alt={selected.title + '原件照片'} className={selected.rotation ? 'credential-rotated' : undefined} />}
      <p className="credential-dialog-caption">{selected?.issuer} · {selected?.period}</p>
    </dialog>
  </>;
}
