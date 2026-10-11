# 腾讯云正式站发布约定

记录日期：2026-10-11。正式网站为 `https://anxinlaw.xyz/`，腾讯云上海轻量实例 `lhins-noj80rny`，公网 IP `101.35.246.231`。Vercel 项目继续构建 main，作为备用部署。不要仅凭 Vercel READY 声称正式站已经更新。

## 当前已验收状态

- 当前页面源码提交：`06ef1b457c464e01255ba13cde825475d987dd39`。
- 完整站点目录：`/var/www/anxinlaw-release-06ef1b4`，共 142 个导出文件，服务器逐文件 SHA-256 校验通过。包含 61 个 sitemap 页面、全部图片和客户端资源、404 页面及搜索引擎公共验证文件。
- Nginx：`/etc/nginx/sites-available/anxinlaw`，已通过 `nginx -t` 并 reload。其他站点配置不属于本项目，不应修改。
- 修改前备份：`/home/ubuntu/anxinlaw-backup-20261011-2200.tgz`，仅 root 可读；原 Nginx 配置另存 `/home/ubuntu/anxinlaw-nginx-before-20261011.conf`。
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

## 本轮传输证据

受浏览器本地文件上传权限限制，本轮先同步公开静态资源，再用不可变 Git 提交补全同一次构建的 HTML/JS，最终 142 个文件全部匹配本地完整构建。

- 独立部署材料分支：`codex/server-static-release-06ef1b4`。
- 不可变提交：`bb1cad71e7e3922461b79611b054da513c0468c9`。
- `manifest.json`：142 个文件的路径与 SHA-256。
- `site-patch.tar.xz`：本轮补全包，只含 74 个 HTML/JS 文件；它不是完整站点备份，不能单独部署空服务器。
- 补全包 SHA-256：`edbdb4ae8c822ab4055451177f02cc738de1b30b077003aa0f88914a2dc21d98`。

后续发布应优先上传一次构建生成的完整包，不要混用不同构建产生的 HTML 和客户端资源。全部凭证只在运行时读取，不写入代码、操作记录或部署包。
