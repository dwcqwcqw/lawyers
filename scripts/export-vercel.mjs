import {spawn} from 'node:child_process';
import {mkdir,cp,rm,writeFile,readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const output=resolve('vercel-static');
const base='http://127.0.0.1:4318';
const server=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--config','dist/server/wrangler.json','--ip','127.0.0.1','--port','4318'],{stdio:'ignore',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});
try{
 let ready=false;for(let n=0;n<60;n++){try{const r=await fetch(base+'/sitemap.xml');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}
 if(!ready)throw new Error('Local build server did not start');
 await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
 await cp('dist/client',output,{recursive:true});
 await rm(output+'/_headers',{force:true});await rm(output+'/vinext-client-entry-manifest.json',{force:true});
 const sitemap=await (await fetch(base+'/sitemap.xml')).text();
 const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 if(!urls.length)throw new Error('Empty sitemap');
 for(const url of urls){const path=new URL(url).pathname;const r=await fetch(base+path);if(!r.ok)throw new Error('Failed '+path);const html=await r.text();if(!html.includes('18321861851')||html.includes('021-35050167'))throw new Error('Stale contact on '+path);if(html.includes('chatgpt.site'))throw new Error('Old hosting reference on '+path);const destination=resolve(output,'.'+path,'index.html');await mkdir(dirname(destination),{recursive:true});await writeFile(destination,html);}
 await writeFile(output+'/sitemap.xml',sitemap);await writeFile(output+'/robots.txt',await(await fetch(base+'/robots.txt')).text());
 const missing=await fetch(base+'/not-a-real-page/');if(missing.status!==404)throw new Error('Expected 404');await writeFile(output+'/404.html',await missing.text());
 const config=JSON.parse(await readFile('vercel.json','utf8'));
 const {framework,installCommand,buildCommand,outputDirectory,...staticConfig}=config;
 await writeFile(output+'/vercel.json',JSON.stringify(staticConfig,null,2));
 console.log('Exported '+urls.length+' complete HTML pages with client assets to '+output);
}finally{server.kill('SIGTERM');}
