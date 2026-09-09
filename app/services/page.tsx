import { services } from '@/lib/services';
import { pageMeta } from '@/lib/site';
import { JsonLd, PageIntro, ContactBand } from '@/components/site-shared';
import { breadcrumbSchema, webpageSchema, serviceSchema } from '@/lib/schema';
export const metadata=pageMeta('上海婚姻家庭法律服务','离婚、子女抚养、房产、夫妻债务、股权、婚前婚内协议与遗产继承。按问题了解江怀的服务方向与咨询准备。','/services/');
export default function Services(){return <main id="main"><JsonLd nodes={[webpageSchema('/services/','婚姻家庭法律服务','七类家事业务与咨询准备','CollectionPage'),breadcrumbSchema([{name:'业务领域',path:'/services/'}]),...services.map(serviceSchema)]}/><PageIntro eyebrow="OUR PRACTICE" title="婚姻家庭法律服务" description="从您正在面对的具体问题出发。先理解事实与争议，再讨论处理路径、材料准备和相应的法律服务。" items={[{name:'业务领域',path:'/services/'}]}/><section className="section"><div className="wrap"><div className="service-grid">{services.map((s,i)=><a className="service-card" key={s.slug} href={'/services/'+s.slug+'/'}><span className="num">0{i+1}</span><span className="arrow">↗</span><h3>{s.title}</h3><p>{s.scenarios[0]}</p></a>)}</div><p className="note">服务面向上海及周边有家事法律需求的当事人；具体受理范围、管辖及委托安排需结合个案确认。</p></div></section><ContactBand/></main>}
