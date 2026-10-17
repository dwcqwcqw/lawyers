# 腾讯云正式站发布约定

记录日期：2026-10-17。正式网站为 `https://anxinlaw.xyz/`，腾讯云上海轻量实例 `lhins-noj80rny`，公网 IP `101.35.246.231`。Vercel 项目继续构建 main，作为备用部署。不要仅凭 Vercel READY 声称正式站已经更新。

## 2026-10-17 补完 10 月 16 日官网遗留 3 篇

- 页面源码提交：`2d61969716460c25b32d4e5dc15288433d1d0393`。2026-10-17 10:07:57（Asia/Shanghai）正式 HTTPS root 切换为 `/var/www/anxinlaw-release-2d61969`。
- B06、C06、E06 为 10 月 16 日未部署的遗留稿，本次首次公开，不计入 10 月 17 日全新官网 3 篇名额；页面日期与实际首次发布日一致。
- 完整导出 170 个文件、39 篇发布文章。服务器逐文件 SHA-256、`nginx -t` 通过；正式域名全部 170 个响应字节与构建一致，浏览器逐篇核验完整正文、各两张原图和两个表格。
- 完整包 SHA-256：`f97ff8ddeaa7b438c1ae812bfe09edfafe2cdb5865892328c1c21f88eb765b44`；材料分支 `codex/server-static-release-2d61969`，不可变材料提交 `7fbcc4807b18cb454151045db4d8f224c0123979`。
- 通过已有腾讯云 OrcaTerm TAT 上传四个部署材料，完整包校验后部署。上线前备份 `/home/ubuntu/anxinlaw-before-2d61969-20261017-020754.tgz` 及同名 `.conf`，root 0600；上一版本 `/var/www/anxinlaw-release-45a74f8` 保留。仅切换本项目 HTTPS 页面 root。

## 2026-10-15 全新官网 3 篇

- 页面源码提交：`45a74f8b4fbff7275fd01f684d35dcd9e8bacc29`。2026-10-15 12:22:14（Asia/Shanghai）正式 HTTPS root 切换为 `/var/www/anxinlaw-release-45a74f8`。
- 全新文章 B03（婚前首付经配偶账户付款）、C03（收入、两个孩子抚养与财产分割）、E03（婚前股票婚后解禁）已公开；不是旧稿补发，不占用或替换昨日名额。
- 本次完整导出 161 个文件，36 篇发布文章。服务器逐文件 SHA-256、`nginx -t` 均通过；正式域名全部 161 个文件响应字节匹配构建。浏览器逐篇核验完整正文、各两张原图和两个表格。
- 完整包 SHA-256：`ccb460d395fffe124f5e9c104d7b6428aadc691cc798f16569756922adc10e92`；材料分支 `codex/server-static-release-45a74f8`，不可变材料提交 `c6686c7f6150260ef74e6064825a38e4061db243`。
- 经已登录的腾讯云 OrcaTerm TAT 上传完整包。GitHub 直连下载过慢且中断，未使用其不完整包；上传后重新校验完整包再部署。
- 上线前备份 `/home/ubuntu/anxinlaw-before-45a74f8-20261015-042212.tgz` 及同名 `.conf`，root 0600；上一版本 `/var/www/anxinlaw-release-114c268` 保留。仅替换本项目 HTTPS 页面 root，证书、ACME、跳转及其他站点配置保持原值。

## 2026-10-14 正式站文章与来源链接修复

- 页面提交：`114c268808e654f7d176dbdc00b72fddf8cca311`。正式 HTTPS root 已切换至 `/var/www/anxinlaw-release-114c268`，2026-10-14 16:59:38（Asia/Shanghai）上线。
- 完整导出共 152 个文件，包含 33 篇已发布文章。服务器逐文件 SHA-256 校验、`nginx -t` 均通过；正式域名 152 个页面和资源响应字节与导出完全一致。
- 新文章 `/insights/prenuptial-agreement-asset-disclosure/` 与 `/insights/inherited-company-equity-marital-property/` 已返回 200；标题、来源网址附录及两张原稿配图核验通过。部分民法典分编来源链接统一至最高人民法院全文入口，保留法条引用文字。
- 部署材料分支：`codex/server-static-release-114c268`；不可变提交：`56cdc58aa0ed5d8b00c268a273db59954fa35b58`；完整包 `site.tar.xz` 的 SHA-256 为 `89950506b2a0b8db35a6c00b36dffb02bf4d92f89365a5421c41aa837409ab8c`。
- 上线前站点与配置备份：`/home/ubuntu/anxinlaw-before-114c268-20261014-085936.tgz`、同名 `.conf`，均为 root 0600。上一版本 `/var/www/anxinlaw-release-14f62f4` 保留，可回滚。
- 仅替换本项目 HTTPS root；证书、ACME webroot、www/HTTP 跳转与其他项目配置保持原值。GitHub main 推送仍只自动构建 Vercel 备用站，正式服务器同步步骤仍需执行。

以下为此前发布记录。

## 当前已验收状态

- 当前页面源码提交：`14f62f4ac68421d2a8f6efbacc1acd3a219fc0c0`。
- 完整站点目录：`/var/www/anxinlaw-release-14f62f4`，共 148 个导出文件，服务器逐文件 SHA-256 校验通过。包含 61 个 sitemap 页面、全部图片和客户端资源、404 页面及搜索引擎公共验证文件。
- Nginx：`/etc/nginx/sites-available/anxinlaw`，已通过 `nginx -t` 并 reload。其他站点配置不属于本项目，不应修改。
- 本次图标更新前备份：`/home/ubuntu/anxinlaw-before-favicon-20261011.tgz`（root 0600）；切换前 Nginx 配置为 `/home/ubuntu/anxinlaw-before-favicon.conf`。上一完整站点 `/var/www/anxinlaw-release-06ef1b4` 保留用于回滚。首次上线备份 `/home/ubuntu/anxinlaw-backup-20261011-2200.tgz` 与配置 `/home/ubuntu/anxinlaw-nginx-before-20261011.conf` 仍保留。
- 正式域名与 www 默认 A 记录均为腾讯云。Vercel 默认 A 记录已暂停；本轮临时的地区和 origin 记录也已暂停。
- HTTP 的 `/.well-known/acme-challenge/` 仍使用 `/var/www/anxinlaw`，这是既有 Certbot webroot。页面目录切换时不要破坏该路径。
- 现有 Certbot timer 已启用；`renewal-hooks/deploy/reload-nginx.sh` 在续期成功后重载 Nginx。`certbot renew --cert-name anxinlaw.xyz --dry-run --run-deploy-hooks --non-interactive` 实测成功。当前正式证书到期时间为 2027-01-01 17:23:52 UTC。

## 后续发布

1. 按文章审核与发布授权要求确定发布内容。运行 `npm run typecheck` 和 `npm run export:vercel`，保留本次构建日志。
2. 将本次 `vercel-static/` 的完整内容打包并记录逐文件 SHA-256。排除 `vercel.json` 等仅用于 Vercel 的配置、macOS 元数据及任何凭证。不要只上传 HTML，构建生成的 JS 文件名也会变化。
3. 通过用户已有的腾讯云控制台 TAT 免密登录或另行授权的既有通道上传。先备份当前站点和 Nginx，再解压到新的版本目录。不要覆盖正在提供服务的目录，也不要用旧简版首页替代完整网站。
4. 在服务器校验全部文件的 SHA-256；确认无缺失后，仅修改本项目 Nginx 的 HTTPS 页面 root。保留证书、ACME webroot、www/HTTP 跳转及其他项目配置。执行 `nginx -t`，通过后 reload。
5. 检查全部 sitemap 页面、公共验证文件、图片和脚本；检查 www/HTTP 跳转、真实 404 和搜索爬虫可读 HTML。以正式域名检查，并在 DNS 缓存存在时使用正确域名的 `curl --resolve` 保持 TLS 校验。
6. 回读官网内容，确认版本、URL、文章及联系方式后才能将发布状态记为完成。需要回滚时，将页面 root 指回上一版本并重新校验、reload；保留备份。

## 图标更新传输与验收（14f62f4）

2026-10-11，添加透明酒红色品牌 favicon、多尺寸 ICO/PNG 和 Apple touch icon；全站 metadata 使用带版本参数的引用。typecheck、完整导出和 61 页 SEO 检查通过。服务器在新目录按 manifest 校验全部 148 个文件后，切换 Nginx HTTPS 页面 root，`nginx -t` 通过并 reload。正式域名的首页、业务内页、6 个图标文件及 Google/百度验证文件共 10 项响应和 SHA-256 与构建一致；浏览器内页的图标标签均进入 head。

- 部署材料分支：`codex/server-favicon-release-14f62f4`；不可变提交：`80911de34320cf3ac3aeba1e1a04ba4df7e8c7a3`。
- `manifest.json` 记录完整 148 个文件；`site-patch.tar.xz` 含 74 个变更文件，其余文件从上一版本按本次 SHA-256 精确匹配复用。补全包不能独立部署空服务器。
- 补全包 SHA-256：`8a741e54d8ee871fbad358021472549700bd64b87a31d6d37c5e2a8ec26b0069`。
- Vercel 备用部署 `dpl_FsNfcuDySgQSRApR1bZ5H8GVJi4d` 同一页面提交 READY。

## 首次上线传输证据（06ef1b4）

受浏览器本地文件上传权限限制，本轮先同步公开静态资源，再用不可变 Git 提交补全同一次构建的 HTML/JS，最终 142 个文件全部匹配本地完整构建。

- 独立部署材料分支：`codex/server-static-release-06ef1b4`。
- 不可变提交：`bb1cad71e7e3922461b79611b054da513c0468c9`。
- `manifest.json`：142 个文件的路径与 SHA-256。
- `site-patch.tar.xz`：本轮补全包，只含 74 个 HTML/JS 文件；它不是完整站点备份，不能单独部署空服务器。
- 补全包 SHA-256：`edbdb4ae8c822ab4055451177f02cc738de1b30b077003aa0f88914a2dc21d98`。

后续发布应优先上传一次构建生成的完整包，不要混用不同构建产生的 HTML 和客户端资源。全部凭证只在运行时读取，不写入代码、操作记录或部署包。
