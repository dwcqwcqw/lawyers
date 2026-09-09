# 江怀律师事务所 · 婚姻家庭官网

生产网站：https://jianghuai-family-law.vercel.app

## 本地开发与验证

使用 Node.js 22.13 或更新版本，运行 `npm ci`。

- `npm run typecheck`：类型检查。
- `npm run export:vercel`：审核文章、构建页面，并导出至 `vercel-static/`。
- `npm run start -- --ip 127.0.0.1 --port 3000`：构建后在本地运行。

## Vercel 自动部署

根目录 `vercel.json` 指定安装、构建命令及输出目录。将现有 Vercel 项目 `jianghuai-family-law` 的 Git 连接设置为此仓库，生产分支设为 `main`。推送后 Vercel 会重新构建全部页面及经过审核的文章。

导出程序仅在构建过程中启动临时本地服务器。最终部署为完整 HTML、CSS、JavaScript 和真实照片，包含移动导航、微信复制和打印功能；不需要 Cloudflare 运行时或数据库密钥。

文章流程见 [CONTENT_GUIDE.md](CONTENT_GUIDE.md)。电话与微信均为 18321861851，备注为律师助理。索引开关与规范域名在 `lib/site.ts`；目前保留 noindex。

不要将飞书密钥、案卷、当事人材料或未脱敏案例提交到仓库。
