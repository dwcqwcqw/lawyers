import { absolute, site } from './site';
import { lawyers, type findLawyer } from './lawyers';
import type { ServiceInfo } from './services';
export type SchemaNode = Record<string, unknown>;
export const firmId=absolute('/#firm');
export const websiteId=absolute('/#website');
export function firmSchema():SchemaNode {return {'@type':'LegalService','@id':firmId,name:site.name,url:site.origin,logo:absolute('/images/logo.jpg'),image:absolute('/images/office.jpg'),description:'上海江怀律师事务所婚姻家庭法律服务，涵盖离婚、子女抚养、财产与股权分割、夫妻债务、家庭协议和遗产继承。',telephone:site.phone,contactPoint:{'@type':'ContactPoint',telephone:site.phone,contactType:site.contactLabel,availableLanguage:'zh-CN',description:'电话与微信同号：'+site.wechat},address:{'@type':'PostalAddress',streetAddress:'大连路688号宝地广场B座905室',addressLocality:'杨浦区',addressRegion:'上海市',addressCountry:'CN'},areaServed:['上海市','上海周边地区'],openingHoursSpecification:{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'].map(d=>'https://schema.org/'+d),opens:'09:00',closes:'18:00'}};}
export function personSchema(l:NonNullable<ReturnType<typeof findLawyer>>):SchemaNode{return {'@type':'Person','@id':absolute('/lawyers/'+l.id+'/#person'),name:l.name,jobTitle:l.role,url:absolute('/lawyers/'+l.id+'/'),image:absolute(l.image),description:l.intro,worksFor:{'@id':firmId},knowsAbout:l.tags,...(l.id==='xu-taotao'?{alumniOf:{'@type':'CollegeOrUniversity',name:'东华大学'}}:l.id==='zhang-ziyuan'?{alumniOf:{'@type':'CollegeOrUniversity',name:'同济大学'}}:{})};}
export function webpageSchema(path:string,name:string,description:string,type='WebPage'):SchemaNode{return {'@type':type,'@id':absolute(path+'#webpage'),url:absolute(path),name,description,inLanguage:'zh-CN',isPartOf:{'@id':websiteId},publisher:{'@id':firmId}};}
export function breadcrumbSchema(items:{name:string;path:string}[]):SchemaNode{return {'@type':'BreadcrumbList',itemListElement:[{name:'首页',path:'/'},...items].map((i,n)=>({'@type':'ListItem',position:n+1,name:i.name,item:absolute(i.path)}))};}
export function serviceSchema(s:ServiceInfo):SchemaNode{return {'@type':'Service','@id':absolute('/services/'+s.slug+'/#service'),name:s.title,serviceType:s.title,description:s.intro,url:absolute('/services/'+s.slug+'/'),provider:{'@id':firmId},areaServed:['上海市','上海周边地区']};}
export function websiteSchema():SchemaNode{return {'@type':'WebSite','@id':websiteId,name:site.name+'婚姻家庭法律服务',url:site.origin,inLanguage:'zh-CN',publisher:{'@id':firmId}};}
export const corePeople=()=>lawyers.map(personSchema);
