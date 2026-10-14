# 江怀律师事务所 · 婚姻家庭官网

生产网站：https://anxinlaw.xyz

## 本地开发与验证

使用 Node.js 22.13 或更新版本，运行 `npm ci`。

- `npm run typecheck`：类型检查。
- `npm run export:vercel`：审核文章、构建页面，并导出至 `vercel-static/`。
- `npm run start -- --ip 127.0.0.1 --port 3000`：构建后在本地运行。

## 正式站部署与 Vercel 备用构建

2026-10-11 起，正式域名及 www 的默认 DNS 指向腾讯云上海轻量服务器 `101.35.246.231`。
正式站运行完整静态导出，当前页面版本为 `114c268`（2026-10-14），目录 `/var/www/anxinlaw-release-114c268`。
www 与 HTTP 永久跳转至 `https://anxinlaw.xyz`；HTTPS 证书沿用服务器现有 Certbot 自动续期。

**推送 main 只会更新 Vercel 备用部署，不会自动更新腾讯云正式站。** 后续正式发布必须将同一版本的完整静态导出同步到腾讯云，核验文件及线上页面后再记录“官网已发布”。详见 [腾讯云发布约定](docs/tencent-static-deploy.md)。

根目录 `vercel.json` 指定安装、构建命令及输出目录。Vercel 项目 `jianghuai-family-law` 已连接 `dwcqwcqw/lawyers`，生产分支为 `main`。推送后 Vercel 会重新构建全部页面及经过审核的文章。

导出程序仅在构建过程中启动临时本地服务器。最终部署为完整 HTML、CSS、JavaScript 和真实照片，包含移动导航、微信复制和打印功能；不需要 Cloudflare 运行时或数据库密钥。

文章流程见 [CONTENT_GUIDE.md](CONTENT_GUIDE.md)。电话与微信均为 18321861851，备注为律师助理。索引开关与规范域名在 `lib/site.ts`；正式站已开放索引。

不要将飞书密钥、案卷、当事人材料或未脱敏案例提交到仓库。

## 搜索引擎发现与提交

首页以“上海江怀律师事务所”作为标题首词，正文与结构化数据保留完整品牌名及简称。
`public/google456e078ec42b1786.html` 是 Search Console 的公开验证文件，需要持续保留。
`public/indexnow-key.txt` 是 IndexNow 的公开站点验证文件，不授予账号访问权限。

发布后运行 `node scripts/check-seo.mjs --live` 检查全部页面、Googlebot、bingbot、Baiduspider 及验证文件。
运行 `node scripts/submit-indexnow.mjs` 预览；加 `--live` 才会将线上 sitemap 的 URL 提交给 IndexNow。
提交成功仅表示已接收，不表示已收录或获得排名；未变化的页面不要反复提交。
Google 已通过 Search Console 读取 `https://anxinlaw.xyz/sitemap.txt`（61 页）；XML 地图此前的报告仍有获取错误。两份地图由同一 URL 列表自动生成。首页网址检查已显示收录，其他页面仍以各自检查结果为准。
百度需要已验证站点的搜索资源平台账号；不要将百度推送 token 写入代码或文档。
