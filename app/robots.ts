import type {MetadataRoute} from 'next';
import {absolute,site} from '@/lib/site';
export default function robots():MetadataRoute.Robots{return {rules:site.indexable?{userAgent:'*',allow:'/'}:{userAgent:'*',disallow:'/'},sitemap:absolute('/sitemap.xml')};}
