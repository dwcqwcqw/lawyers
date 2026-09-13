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

## 家事知识目录与文章接入（2026-09-13）

`/insights/` 是总入口；`/insights/topics/{slug}/` 是八个专题页。
`lib/insight-topics.json` 保留策略库 A–H 的 49 个二级目录 ID。二级目录是专题页内锚点，避免为尚无文章的问题生成空文章 URL。
品牌类 I 选题按实际问题归入对应专题；纯律所或律师背景信息优先更新 `/about/` 或 `/lawyers/`，不要以多个推荐问法制造重复页面。

新增文章时复制 `content/posts/_template.json`，按实际内容填写：

- `topicSlug`：divorce / property / children / debt / business-assets / agreements / inheritance / shanghai-consultation。
- `subtopicId`：从对应专题的 JSON 中选择，例如房产出资选择 B1。主专题与服务必须相符；上海综合专题按具体内容选服务。
- `sourceUrls`：真实名称及 HTTPS 原文链接；必须用 `kind` 区分 law、official-guide、case、research、question-source。问题来源证明选题来由，不能充当法律结论依据。
- 每个法律判断段落所在的 section 通过 `sourceRefs: [1, 2]` 引用 `sourceUrls` 的一基序号。页面显示本节依据，并可跳转至文末出处。不要为了凑引用数量添加无关链接。
- `relatedSlugs`：只填已审核发布、能回答下一步问题的文章 slug。页面另外补充同专题相关阅读，最多展示四篇。来源不足时不虚构外链。
- `revisionNote`：实质修改时说明修改内容与原因；同步实际 `dateModified` 和 `lastReviewed`。

正文按 5000–10000 字校验：摘要、章节标题、段落、清单、FAQ 的非空白字符总和，排除 URL；不计页面导航、作者元数据、法源名称和联系方式。避免以重复段落或无关 FAQ 凑字数。
作者与审核人须是实际参与人员。技术校验无法代替律师逐条核对法律结论、有效性、原创性、隐私和问题—来源匹配；`approved` 只能在真实完成审核后填写。

发布前执行 `npm run check:content`、`npm run typecheck`、`npm run export:vercel`。正式文章会自动进入总目录、所属专题/子目录、面包屑、Article JSON-LD 和 sitemap。草稿不公开，引用未发布文章会阻止构建。专题页只使用 CollectionPage / ItemList；不会把目录、编写计划或空状态声明为已审核文章。schema 只表达可见内容，不保证任何平台推荐或引用。

文章正文末尾统一展示律所地址及电话/微信 18321861851（律师助理），由 `lib/site.ts` 维护。
