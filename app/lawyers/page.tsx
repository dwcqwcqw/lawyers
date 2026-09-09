import { PageIntro,LawyerCards,ContactBand,JsonLd } from '@/components/site-shared';
import { pageMeta,site } from '@/lib/site';
import { corePeople,breadcrumbSchema,webpageSchema } from '@/lib/schema';
export const metadata=pageMeta('上海婚姻家庭律师团队','认识许涛涛、蒋小霞、张子元律师，了解其履历、家事业务方向和相关服务。','/lawyers/');
export default function Lawyers(){return <main id="main"><JsonLd nodes={[webpageSchema('/lawyers/','婚姻家庭律师团队','许涛涛、蒋小霞、张子元律师的业务与履历','CollectionPage'),breadcrumbSchema([{name:'律师团队',path:'/lawyers/'}]),...corePeople()]}/><PageIntro eyebrow="OUR LAWYERS" title="认真听您说，专业为您解。" description="婚姻家庭事务既有情感处境，也有财产与程序问题。了解律师各自的工作背景，找到适合沟通的业务方向。" items={[{name:'律师团队',path:'/lawyers/'}]}/><section className="section"><div className="wrap"><LawyerCards/><p className="note">律师履历与业务信息依据本所提供的介绍整理。您可通过<a className="registry-link" href={site.registry} target="_blank" rel="noopener noreferrer">上海市司法局律师查询服务</a>核验执业信息。</p></div></section><ContactBand/></main>}
