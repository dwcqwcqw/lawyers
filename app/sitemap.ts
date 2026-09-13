import type { MetadataRoute } from 'next';
import {site,absolute} from '@/lib/site';
import {services} from '@/lib/services';
import {lawyers} from '@/lib/lawyers';
import {resources} from '@/lib/resources';
import {insightTopics,topicPath,topicsUpdated} from '@/lib/insight-topics';
import {publishedArticles} from '@/lib/articles';
const libraryUpdated=(slug?:string)=>[topicsUpdated,...publishedArticles.filter(a=>!slug||a.topicSlug===slug).map(a=>a.dateModified)].sort().at(-1)!;
export default function sitemap():MetadataRoute.Sitemap {return [...['/','/services/','/lawyers/','/insights/','/about/','/contact/','/sources/','/editorial-policy/','/privacy/'].map(path=>({url:absolute(path),lastModified:path==='/insights/'?libraryUpdated():site.updated})),...services.map(s=>({url:absolute('/services/'+s.slug+'/'),lastModified:site.updated})),...lawyers.map(l=>({url:absolute('/lawyers/'+l.id+'/'),lastModified:site.updated})),...resources.map(r=>({url:absolute('/resources/'+r.slug+'/'),lastModified:site.updated})),...insightTopics.map(t=>({url:absolute(topicPath(t.slug)),lastModified:libraryUpdated(t.slug)})),...publishedArticles.map(a=>({url:absolute('/insights/'+a.slug+'/'),lastModified:a.dateModified}))];}
