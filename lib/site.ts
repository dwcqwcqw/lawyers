import type { Metadata } from 'next';
export const site = {
  name: '上海江怀律师事务所',
  origin: 'https://jianghuai-family-law-seven.vercel.app',
  indexable: false, // Structure preview; search indexing remains disabled. Enable only on the approved public origin.
  updated: '2026-09-08',
  phone: '18321861851',
  phoneHref: 'tel:+8618321861851',
  wechat: '18321861851',
  contactLabel: '律师助理',
  address: '上海市杨浦区大连路688号宝地广场B座905室',
  hours: '工作日 09:00–18:00',
  registry: 'https://zwdt.sh.gov.cn/govPortals/bsfw/item/f8e907fd-4ceb-4036-a073-3c9956906b15',
  firmRegistry: 'https://zwdt.sh.gov.cn/govPortals/bsfw/item/4ac363b0-9fd6-4848-a08f-4ae12271a697',
};
export const absolute = (path: string) => new URL(path, site.origin).href;
export function pageMeta(title: string, description: string, path: string): Metadata {
  return { title: `${title}｜江怀律师事务所`, description, alternates: { canonical: absolute(path) }, robots: { index: site.indexable, follow: true }, openGraph: { type: 'website', locale: 'zh_CN', siteName: site.name, title, description, url: absolute(path) } };
}
export const sources = [
  { id: 'civil-code', name: '中华人民共和国民法典', issuer: '全国人民代表大会', url: 'https://www.court.gov.cn/zixun/xiangqing/233181.html', note: '婚姻家庭编、继承编及相关民事规则。' },
  { id: 'family-one', name: '民法典婚姻家庭编司法解释（一）', issuer: '最高人民法院', url: 'https://www.court.gov.cn/fabu/xiangqing/282071.html', note: '婚姻效力、财产、子女抚养等问题的司法解释。' },
  { id: 'family-two', name: '民法典婚姻家庭编司法解释（二）', issuer: '最高人民法院', url: 'https://www.court.gov.cn/zixun/xiangqing/452771.html', note: '2025年2月1日起施行，涉及房产给予、父母出资与其他家事争议。' },
];
export const nav = [{href:'/services/',label:'业务领域'},{href:'/lawyers/',label:'律师团队'},{href:'/insights/',label:'家事指南'},{href:'/about/',label:'关于江怀'},{href:'/contact/',label:'咨询与到所'}];
