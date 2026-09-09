import {notFound} from 'next/navigation';
import {resources} from '@/lib/resources';
import {pageMeta} from '@/lib/site';
import {PageIntro,JsonLd,ContactBand} from '@/components/site-shared';
import {PrintGuide} from '@/components/document-actions';
import {webpageSchema,breadcrumbSchema} from '@/lib/schema';
type Props={params:Promise<{slug:string}>};
export const generateStaticParams=()=>resources.map(r=>({slug:r.slug}));
export async function generateMetadata({params}:Props){const {slug}=await params;const r=resources.find(r=>r.slug===slug);return r?pageMeta(r.title,r.description,'/resources/'+r.slug+'/'):{};}
export default async function Resource({params}:Props){const {slug}=await params;const r=resources.find(r=>r.slug===slug);if(!r)notFound();const path='/resources/'+r.slug+'/';const crumbs=[{name:'家事指南',path:'/insights/'},{name:r.title,path}];return <main id="main"><JsonLd nodes={[webpageSchema(path,r.title,r.description),breadcrumbSchema(crumbs)]}/><PageIntro eyebrow="PREPARE FOR YOUR CONSULTATION" title={r.title} description={r.description} items={crumbs}/><section className="section"><div className="wrap long-copy reading">{r.sections.map(s=><section key={s.title}><h2>{s.title}</h2><ul className="material-list">{s.items.map(i=><li key={i}>{i}</li>)}</ul></section>)}<section><h2>我的咨询笔记</h2><div className="print-sheet">{r.fields.map(f=><div key={f}><label>{f}</label><div className="blank-line"/><div className="blank-line"/></div>)}</div><p className="note">此页不收集或保存您的填写信息。可打印后在纸上记录；请妥善保管涉及家庭和财产的资料。</p><PrintGuide/></section><section><h2>接下来可以做什么</h2><p>带着已经整理的事实和问题，先与律师沟通具体服务范围。材料清单用于准备，不表示需要在首次联系时提交全部敏感文件。</p><div className="actions"><a className="btn" href="/contact/">咨询与到所 →</a><a className="text-link" href={'/services/'+r.related+'/'}>了解相关业务 →</a></div></section></div></section><ContactBand/></main>}
