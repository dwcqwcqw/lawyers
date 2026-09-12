# 后续文章接入

当前官网结构包含首页、七类业务详情、三位律师主页、家事指南、三份准备清单、关于、联系、法源、编辑准则与隐私说明。正文使用服务端HTML输出。尚未发布正式律师署名文章。

## 添加一篇文章

1. 复制 `content/posts/_template.json` 为新的 JSON 文件，使用稳定英文短路径 `slug`，保持 `status: "draft"`。
2. 填写标题、摘要、服务主题、真实作者和复核律师；正文由 `sections` 组成，每节使用唯一 `id`、标题、段落数组和可选清单。填入准确的法源名称及原始 HTTPS URL。
3. `authorId` 和 `reviewerId` 使用 `xu-taotao`、`jiang-xiaoxia` 或 `zhang-ziyuan`。须由实际作者、复核人确认，不能因为系统要求字段而自动署名。新律师需先加入 `lib/lawyers.ts` 并维护校验脚本的允许名单。
4. `serviceSlug` 使用 `divorce`、`children`、`property`、`debt`、`business-assets`、`agreements`、`inheritance`。
5. 实际完成审核后再将 `reviewStatus` 设为 `approved`，填写真实 `lastReviewed`。准备正式发布时将 `status` 设为 `published`，填写真实发布日期和实质更新日期。复核日期不能早于最后修改日期。
6. 运行 `npm run check:content`、`npm run typecheck` 和 `npm run build`。重新部署后文章将出现在 `/insights/{slug}/`、指南列表、作者主页和 Sitemap，并生成 Article、WebPage、Person、BreadcrumbList 关系。

正文示例（仅格式演示，不是发布内容）：

```json
{"id":"conditions","title":"适用条件","paragraphs":["填写经律师审核的正文。"],"bullets":["填写必要的材料或例外。"]}
```

本轮不包含可视化CMS后台。内容保存在版本管理的文件中，后续可以继续由Codex写入，或在需要时对接CMS。不要把身份证、银行流水、完整案卷、未脱敏案例放进代码库或 `public/`。

## 正式域名与抓取开关

配置集中于 `lib/site.ts`。2026-09-12 按用户要求开放正式站抓取：`origin: https://anxinlaw.xyz`、`indexable: true`。Canonical、Sitemap 与 Schema 均使用正式域名，未审核草稿继续排除。后续内容维护要求：

- 律所确认机构身份、律师履历、案例使用范围、电话及服务介绍；法源与内容完成所需复核。
- 将 `origin` 改为律所控制的正式HTTPS域名，将 `indexable` 改为 `true`，构建并部署到公开访问环境。
- 移除部署平台的登录限制；只修改 robots 并不会使私有站点公开。
- 配置域名及必要备案信息，不复制其他域名的备案号；处理旧站内容分工和必要301。
- 核验正式 origin 下的 Canonical、Sitemap、Schema @id、HTTP状态码、无JS正文、移动体验及WAF/CDN。

当前 Schema 不含未经核实的执业证号、评分、胜率、奖项、排名或 reviewedBy。正式署名文章才根据真实审核字段生成 reviewedBy（WebPage）和 Article 作者关系。没有搜索功能，不输出虚假的 SearchAction。

## 当前材料的边界

公司及律师信息来自2026-09-08读取的飞书资料。电话与微信由用户指定为18321861851，接待备注为律师助理。地址与办公时间依公司资料。两张个人照片原始尺寸较小，保持真实人物，未生成替代肖像。

本站为可继续接入内容的结构版本。技术可读取和实际被AI引用/推荐需分别验证。

## Vercel 部署

2026-09-09 已部署到 Bailey's projects / jianghuai-family-law，生产地址为 https://jianghuai-family-law-seven.vercel.app 。本地 .vercel/project.json 保存项目绑定。

运行 npm run export:vercel 会先审核内容并构建，再通过临时本地服务器按 Sitemap 导出完整 HTML 和客户端资源到 vercel-static/。上传该目录的文件到现有 Vercel 项目；不用上传 Worker 产物。新增文章也会随 Sitemap 自动导出。当前只有静态页面、复制与打印交互，不含服务器表单或 CMS。若以后增加服务器接口，需单独实现 Vercel 运行适配。

正式域名 https://anxinlaw.xyz 已开放索引，旧 Vercel 生产域名永久跳转并保留路径。不要继续上传 Sites。
