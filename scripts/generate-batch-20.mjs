import { mkdir, readFile, writeFile } from 'node:fs/promises';

const published = '2026-09-19';
const approval = 'User explicitly requested writing and publishing these 20 new GEO articles to the Feishu GEO长文章库 and https://anxinlaw.xyz/insights/ on 2026-09-19; this is publication authorization, not a claim of lawyer review.';
const sourceDocument = 'https://u06iklqy2ah.feishu.cn/wiki/MIKrwPRYliemDdkKz1hcV6Cxn2b';
let feishuLinks = {};
try {
  feishuLinks = Object.fromEntries(
    JSON.parse(await readFile('../飞书文章审阅/batch20-feishu-result.json','utf8')).map(x=>[x.id,x.wiki]),
  );
} catch {}
const contact = '上海江怀律师事务所｜婚姻家庭法律服务。地址：上海市杨浦区大连路688号宝地广场B座905室。电话／微信同号：18321861851（律师助理）。联系时可先说明本文涉及的争议、当前程序阶段和已有材料；请先隐去身份证号、完整账号及未成年人的敏感信息。';

const S = {
  civil: { name: '中华人民共和国民法典', url: 'https://www.court.gov.cn/zixun/xiangqing/233181.html', kind: 'law' },
  marriage1: { name: '最高人民法院关于适用民法典婚姻家庭编的解释（一）', url: 'https://www.court.gov.cn/fabu/xiangqing/282071.html', kind: 'law' },
  marriage2: { name: '最高人民法院婚姻家庭编解释（二）及发布说明', url: 'https://www.court.gov.cn/zixun/xiangqing/452771.html', kind: 'law' },
  registration: { name: '婚姻登记条例（2025年修订）', url: 'https://xzfg.moj.gov.cn/mobile/law/detail?LawID=1766', kind: 'law' },
  registrationGuide: { name: '婚姻登记工作规范（2025年）', url: 'https://www.sz.gov.cn/ztfw/hysy/wyk/content/post_12377424.html', kind: 'official-guide' },
  shanghaiRegistration: { name: '上海市婚姻登记全国通办办事说明', url: 'https://mzj.sh.gov.cn/MZ_zhuzhan871_0-2-7-27/20250512/80c2a669f81b4d45b437f5faab5cbeef.html', kind: 'official-guide' },
  protection: { name: '最高人民法院关于办理人身安全保护令案件适用法律若干问题的规定', url: 'https://www.court.gov.cn/fabu/xiangqing/366021.html', kind: 'law' },
  protectionGuide: { name: '七部门关于加强人身安全保护令制度贯彻实施的意见', url: 'https://www.court.gov.cn/zixun/xiangqing/348601.html', kind: 'official-guide' },
  evidence: { name: '最高人民法院关于民事诉讼证据的若干规定', url: 'https://ipc.court.gov.cn/zh-cn/news/view-393.html', kind: 'law' },
  lending: { name: '最高人民法院关于审理民间借贷案件适用法律若干问题的规定', url: 'https://www.court.gov.cn/zixun/xiangqing/282621.html', kind: 'law' },
  company: { name: '中华人民共和国公司法（2023年修订）', url: 'https://www.npc.gov.cn/npc/c2/c30834/202312/t20231229_433999.html', kind: 'law' },
  bridePrice: { name: '最高人民法院关于审理涉彩礼纠纷案件适用法律若干问题的规定', url: 'https://gongbao.court.gov.cn/Details/d2fa08a82a91337bf6515842d1522e.html', kind: 'law' },
  inheritance: { name: '最高人民法院关于适用民法典继承编的解释（一）', url: 'https://www.court.gov.cn/fabu/xiangqing/282091.html', kind: 'law' },
  lawyers: { name: '中华人民共和国律师法', url: 'https://xzfy.moj.gov.cn/c/2021-01-06/487877.shtml', kind: 'law' },
  firmRecord: { name: '上海市律师行业信用信息服务平台：上海江怀律师事务所', url: 'https://credit.lawyers.org.cn/lawfirm.jsp?id=6d48422a5a2049e9b5918c27d4c73db2', kind: 'professional-record' },
};

const profiles = [
  ['A03','divorce-registration-documents','内地居民办理离婚登记，应准备哪些证件和协议材料？','离婚程序','divorce','A1','xu-taotao','办理离婚登记不能只带一份离婚协议。双方需要共同到有管辖权的婚姻登记机关申请，核对身份、婚姻状态、真实意思以及对子女、财产和债务的安排，并经历法定冷静期和领证阶段。2025年规则调整后，材料要求应以现行条例、工作规范和受理机关当日指引为准。',['双方身份和现有婚姻关系','离婚协议对子女的完整安排','共同财产和个人财产清单','共同债务、个人债务与履行方式','申请日、冷静期与领证期限'],['身份证件及婚姻登记信息','离婚协议草案和修改记录','子女身份与照护资料','房产、存款、车辆和股权清单','借款合同、还款记录和债权人信息'],[S.civil,S.registration,S.registrationGuide,S.shanghaiRegistration]],
  ['A04','divorce-cooling-off-period-deadlines','离婚冷静期30天包括休息日吗？超过领证期限要重新申请吗？','离婚程序','divorce','A1','jiang-xiaoxia','离婚冷静期按照自然日连续计算，期间包含周末和法定节假日；冷静期届满后的三十日是双方共同申请领取离婚证的期限。最后一日遇法定休假日时，具体顺延和窗口安排应结合现行规范及受理机关公告核对。双方未在领证期内共同申请的，视为撤回，需要重新申请。',['申请日是否计入期间','冷静期30日与领证期30日的区别','节假日和窗口非工作日','任一方撤回或不到场的效果','重新申请后的材料更新'],['申请受理回执','受理机关短信或平台记录','双方日历和到场安排','最新版离婚协议','窗口公告与预约记录'],[S.civil,S.registration,S.registrationGuide,S.shanghaiRegistration]],
  ['A09','domestic-violence-protection-order-evidence','遭遇家暴后，申请人身安全保护令需要整理哪些证据？','离婚程序','divorce','A6','xu-taotao','申请人身安全保护令不以先起诉离婚为前提，也不要求必须达到刑事案件的证明程度。关键是说明明确的被申请人、具体保护请求，以及已经遭受家庭暴力或面临现实危险。报警、就医、告诫书、保证书、聊天记录、录音录像和证人情况应按时间线保存；遇到正在发生的危险应先报警并寻求安全安置。',['当前是否存在紧迫危险','保护对象和禁止行为如何写明','报警与出警记录的证明作用','就医材料与伤情照片的形成时间','电子证据原始载体和上下文'],['报警回执与出警记录','病历、检查单和伤情照片','威胁信息、录音录像原件','保证书、悔过书或告诫书','亲友、邻居及学校知情线索'],[S.civil,S.protection,S.protectionGuide,S.evidence]],
  ['B04','parental-down-payment-spouse-name-property','父母付首付、房本只写儿子，婚后加配偶名字会怎样影响离婚分割？','房产与财产','property','B1','zhang-ziyuan','婚后加名通常会改变房屋权利外观，但不等于离婚时必然平均分割。需要同时核对原始购房和登记时间、父母出资目的、赠与意思、贷款偿还、加名时的真实约定、婚姻持续时间、共同生活及子女情况。房屋是否属于共同财产与最终分割比例是两个层次的问题。',['房屋取得和首次登记时间','父母首付款的赠与对象','婚后加名文件与沟通记录','贷款本金利息的实际来源','共同生活、孕育与房屋使用'],['购房合同与全部登记簿','首付款流水和父母账户资料','贷款合同及逐月还款明细','加名申请、税费和聊天记录','装修、还贷和家庭居住证据'],[S.civil,S.marriage1,S.marriage2,S.evidence]],
  ['B09','omitted-marital-property-after-divorce','离婚协议漏写婚内另购房屋，离婚后还能请求分割吗？','房产与财产','property','B2','jiang-xiaoxia','离婚后发现协议或裁判未处理的夫妻共同财产，可以先确认该房屋是否确属婚内共同财产、原离婚文件是否已经通过概括条款处理，以及是否存在隐藏、转移或双方当时明知而放弃的情形。不能只凭“协议没写房屋地址”就直接判断能否再分。',['原离婚协议的财产范围','房屋购买时间与资金来源','双方当时是否知情','是否存在隐瞒或转移行为','请求方式与时效起点'],['离婚协议或生效裁判全文','购房合同和登记信息','首付款及还贷流水','离婚谈判聊天与财产清单','发现房屋的时间和查询记录'],[S.civil,S.marriage1,S.marriage2,S.evidence]],
  ['B14','marital-property-gift-third-party-return','发现配偶把共同财产赠给婚外第三人，可以要求返还吗？','房产与财产','property','B4','jiang-xiaoxia','婚姻关系存续期间，一方为违反夫妻忠实义务的目的擅自将夫妻共同财产赠与第三人，相关赠与可能被认定无效，另一方可以依法请求返还。判断时要核对资金是否属于共同财产、收款人与配偶的关系、给付目的、对价和资金去向，避免把正常交易或明确个人财产支出一概认定为赠与。',['款项是否属于夫妻共同财产','转账是赠与、消费还是交易','第三人是否实际取得利益','忠实义务事实与隐私边界','返还范围和资金追踪'],['银行及支付平台原始流水','转账备注和完整聊天上下文','交易合同、发票和交付材料','婚姻关系及财产来源资料','第三人收款后转移线索'],[S.civil,S.marriage2,S.evidence]],
  ['C02','two-children-custody-separate-assessment','两个孩子年龄不同，离婚抚养方案要逐个核对哪些条件？','子女抚养','children','C1','xu-taotao','两个孩子的直接抚养安排不能用“一人一个”代替逐个判断。应分别核对每个孩子的年龄、长期照料者、生活和就学稳定性、兄弟姐妹关系、父母照护时间与条件，以及达到相应年龄的孩子真实意愿。最终方案还要能落实探望、费用和突发情况处理。',['每个孩子的年龄和表达能力','既往主要照料事实','兄弟姐妹共同生活利益','父母工作时间与备用照护','学校、医疗和住所稳定性'],['出生证明与户籍资料','连续照护日历和接送记录','学校、医疗及居住材料','父母工作与收入资料','孩子意见形成过程的客观记录'],[S.civil,S.marriage1,S.marriage2,S.evidence]],
  ['C09','child-extra-medical-expenses-support','离婚后孩子住院，已付抚养费的一方还要分担额外医疗费吗？','子女抚养','children','C2','jiang-xiaoxia','固定抚养费并不当然覆盖孩子后来发生的全部重大医疗支出。是否另行分担，要看原协议或裁判对医疗费的约定、费用是否必要合理、医保和保险报销、双方负担能力及事前沟通情况。紧急治疗应先保障孩子，之后再按凭证核算。',['原有抚养费条款的覆盖范围','诊疗必要性与费用合理性','医保、商保和救助抵扣','双方收入及其他抚养负担','紧急治疗与事前协商'],['原离婚协议或裁判文书','病历、诊断和费用清单','医保及保险结算单','双方沟通和通知记录','收入与其他子女负担资料'],[S.civil,S.marriage1,S.evidence]],
  ['C20','hidden-child-personality-rights-injunction','离婚诉讼中对方藏匿孩子，能申请人格权侵害禁令吗？','子女抚养','children','C6','xu-taotao','抢夺、藏匿未成年子女可能侵害另一方依法履行监护职责的权利，也会损害孩子的生活稳定和亲情联系。符合条件时，可以结合案件情况申请人格权侵害禁令，并同步请求法院处理临时照护、家庭教育指导或调查取证。不能把自行抢回孩子当作默认解决方式。',['孩子当前下落与安全状态','既往稳定照护和生活环境','对方阻断联系的具体行为','紧迫性及难以弥补的损害','禁令请求是否明确可执行'],['孩子既往居住就学资料','联系受阻的完整记录','报警、社区或学校记录','法院案件材料和送达信息','可立即落实的照护方案'],[S.civil,S.marriage2,S.evidence]],
  ['D02','spouse-confirmation-company-loan-guarantee','公司贷款担保中只签“配偶确认”，会承担什么责任？','夫妻债务','debt','D1','zhang-ziyuan','在“配偶确认”栏签字不当然等于成为借款人或保证人，也不能当然排除责任。应先看合同全文、签字位置附近文字、银行提示和签署过程，判断是同意配偶提供担保、确认知情、共同承担保证责任，还是对共同财产处分的确认；再结合款项用途和银行主张确定答辩。',['主合同、保证合同的主体','签字栏文字及引用条款','保证方式、范围和期间','贷款是否进入家庭或共同经营','银行是否履行提示说明'],['贷款与保证合同完整版本','签署录像、面签记录和短信','放款账户及资金流向','公司章程、股权和经营资料','催收通知及起诉材料'],[S.civil,S.lending,S.evidence]],
  ['D04','secret-stock-trading-debt-spouse-liability','丈夫瞒着妻子借钱炒股亏损，妻子一定要共同偿还吗？','夫妻债务','debt','D1','zhang-ziyuan','一方以个人名义借款炒股且超出家庭日常生活需要时，并不因为发生在婚内就当然属于共同债务。债权人如主张配偶共同偿还，需要证明款项用于夫妻共同生活、共同生产经营或基于共同意思表示。另一方应重点核对借款真实性、证券账户、资金闭环以及自己是否签字、追认或实际分享收益。',['借款是否真实交付','借款金额是否超出日常需要','证券账户与交易主体','配偶是否签字或事后追认','资金及收益是否回到家庭'],['借款合同和实际交付流水','证券账户交易及出入金记录','家庭账户同期资金变化','双方聊天和催收回复','债权人提交的起诉证据'],[S.civil,S.lending,S.evidence]],
  ['E02','undocumented-marital-company-equity','婚内出资开公司但未登记姓名，怎样核实约定的30%股权？','股权与经营资产','business-assets','E1','xu-taotao','婚内出资但没有登记股东姓名、也没有书面持股协议时，不能只凭口头所说“占30%”直接要求公司变更登记。需要区分夫妻内部财产权益、与登记股东之间是否存在代持或投资关系，以及公司法上的股东资格；通过出资、协商、利润分配和参与经营的连续证据还原。',['出资人、收款人和公司账户','30%比例的形成过程','登记股东是否认可代持','是否参与表决、分红和经营','夫妻内部权益与公司股东资格'],['公司登记、章程和股东名册','出资流水及会计凭证','设立前后完整沟通记录','分红、报销和经营权限资料','登记股东及其他股东的陈述'],[S.civil,S.company,S.marriage1,S.evidence]],
  ['E07','divorce-company-equity-articles-shareholders','离婚分割有限责任公司股权，要怎样核对章程和其他股东？','股权与经营资产','business-assets','E2','xu-taotao','离婚分割股权既涉及夫妻财产关系，也涉及公司的组织规则。应先确认股权属于一方个人财产还是夫妻共同财产，再查公司章程、股东名册、出资义务、转让限制及其他股东的优先购买权。分割股权价值与让配偶直接成为股东是不同结果。',['股权取得时间与资金来源','章程对转让的特别规定','其他股东优先购买权','认缴实缴及出资责任','股权归属、折价补偿和过户'],['最新章程和历次修正案','股东名册与登记档案','出资证明及会计资料','股东会决议和通知记录','估值资料与对外负债'],[S.civil,S.company,S.marriage1,S.evidence]],
  ['F03','prenuptial-parental-down-payment-spouse-name','父母付首付、婚后准备加名，婚前协议怎样衔接？','婚姻家庭协议','agreements','F1','zhang-ziyuan','婚前协议不能只写“房屋归谁”，还要把父母出资性质、产权登记计划、贷款承担、加名条件、婚后还贷和分手后的补偿方式写清楚。协议是夫妻之间的安排，不能未经父母、银行或登记机关同意就替他们设定义务。实际加名和付款应与文本保持一致。',['父母出资是赠与还是借款','房屋和贷款当前登记状态','加名的时间与前置条件','婚后还贷和增值处理','违约、出售和提前还贷安排'],['购房与贷款合同','父母付款流水和书面意思','不动产登记信息','双方资产债务披露表','协议签署及后续履行记录'],[S.civil,S.marriage1,S.marriage2,S.evidence]],
  ['F12','cohabitation-transfers-bride-price-return','同居期间的转账，分手后都能作为彩礼追回吗？','婚姻家庭协议','agreements','F6','jiang-xiaoxia','同居期间的每笔转账都不能直接等同于彩礼。应根据给付是否以结婚为目的、当地习俗、时间、方式、金额、接收人和实际用途区分彩礼、日常消费、一般赠与、共同生活支出与借款。只有完成分类后，才能进一步讨论返还范围。',['给付目的是否明确指向结婚','特殊节点与当地习俗','金额和双方经济状况','共同生活与资金实际使用','借款、赠与和彩礼的证据差异'],['银行和支付平台完整流水','转账备注及聊天上下文','婚礼、订婚和共同生活资料','家具车辆等实物去向','双方父母参与给付的记录'],[S.civil,S.bridePrice,S.evidence]],
  ['F19','bride-price-cohabitation-child-no-registration','没领证但共同生活多年并育有孩子，彩礼一定要全额返还吗？','婚姻家庭协议','agreements','F6','jiang-xiaoxia','双方未办理结婚登记但长期共同生活并育有子女时，彩礼返还通常不会机械适用“未登记即全额返还”。需要综合彩礼实际使用、嫁妆、共同生活时间、孕育情况、双方过错、金额及当地习俗确定是否返还和比例。孩子的抚养问题应另行安排。',['彩礼范围和实际接收人','共同生活的起止与稳定程度','孕育及对子女的共同投入','彩礼和嫁妆的实际使用','过错事实与返还能力'],['彩礼给付与接收流水','共同居住及家庭支出资料','孩子出生和照护记录','嫁妆清单及现状','分开经过和财产交接记录'],[S.civil,S.bridePrice,S.evidence]],
  ['G02','inherited-property-during-marriage','婚内继承的遗产，一定属于夫妻共同财产吗？','继承与遗嘱','inheritance','G1','zhang-ziyuan','婚姻关系存续期间因继承取得的财产，在没有特别安排时可能属于夫妻共同财产；但遗嘱明确只归一方的，通常属于该方个人财产。还要先区分遗产本身与被继承人配偶的既有共同财产，并核对继承开始、遗嘱内容、放弃继承及后续处分。',['遗产范围与被继承人个人份额','是否存在有效遗嘱或遗赠扶养协议','是否明确只归夫妻一方','继承开始和实际取得时间','继承后是否混同或再次处分'],['亲属关系和死亡证明','遗嘱原件及形成资料','不动产、存款和股权证明','遗产分割协议与公证材料','继承后资金流和登记变化'],[S.civil,S.inheritance,S.evidence]],
  ['G04','conflicting-handwritten-wills','两份自书遗嘱部分冲突，房屋安排还能有效吗？','继承与遗嘱','inheritance','G1','zhang-ziyuan','存在数份内容相抵触的遗嘱时，应先分别审查每份遗嘱的形式和真实意思，再按相互抵触的具体事项处理。后一份只改变现金安排，并不当然使前一份关于房屋的全部安排失效；但若文字之间存在关联、财产已经处分或份额不清，还需结合全文和后续行为解释。',['每份遗嘱是否亲笔书写签名注明日期','冲突发生在哪项财产','后一份是否明确撤销前文','房屋是否属于遗嘱人全部财产','立遗嘱后财产是否已处分'],['两份遗嘱原件和保存封装','笔迹、签名及日期线索','订立时健康和意思能力资料','房屋登记与夫妻财产资料','后续处分、谈话和见证线索'],[S.civil,S.inheritance,S.evidence]],
  ['H02','nationwide-divorce-registration-residence-permit','内地居民异地办理离婚登记，还需要提交居住证吗？','上海与综合咨询','divorce','H1','jiang-xiaoxia','2025年婚姻登记全国通办后，内地居民申请离婚登记原则上不再受一方常住户口所在地限制，现行国家规则不再把居住证作为全国通办的普遍前提。但双方身份、婚姻登记信息、离婚协议和共同到场仍需核验；涉外、港澳台、华侨以及档案信息异常等情况适用不同规则。',['双方是否均为内地居民','原婚姻登记信息能否联网核验','拟办理机关的预约要求','申请与领证能否在同一机关完成','特殊身份及档案异常'],['双方有效身份证件','结婚证或婚姻登记信息','离婚协议草案','预约和受理回执','特殊身份或档案补正材料'],[S.registration,S.registrationGuide,S.shanghaiRegistration,S.civil]],
  ['H11','verify-family-lawyer-license-engagement','网上找到家事律师，委托前怎样核验执业身份和律所？','上海与综合咨询','divorce','H2','xu-taotao','核验律师不能只看短视频账号、平台认证或聊天头像。应通过司法行政机关或律师协会公开渠道核对律师姓名、执业机构和状态，再确认接洽人与收款主体、委托合同、服务范围、费用和发票。宣传内容只能帮助了解方向，不能替代正式身份和委托文件。',['律师姓名、执业证号和执业状态','当前执业机构是否一致','联系者是律师还是助理','合同服务范围与阶段','收款账户、发票和材料交接'],['官方律师及律所查询截图','律师提供的执业信息','委托合同完整文本','收费说明和付款凭证','材料清单、交接和沟通记录'],[S.lawyers,S.firmRecord,S.civil]],
];

const topicMeta = {
  '离婚程序':['divorce','pregnancy-divorce-rules'],
  '房产与财产':['property','premarital-home-mortgage-divorce-compensation'],
  '子女抚养':['children','child-custody-father-caregiving-evidence'],
  '夫妻债务':['debt','spousal-debt-liability-three-tests'],
  '股权与经营资产':['business-assets','divorce-company-shares-dividends-assets'],
  '婚姻家庭协议':['agreements','prenuptial-agreement-income-caregiving'],
  '继承与遗嘱':['inheritance','inheritance-estate-after-divorce-division'],
  '上海与综合咨询':['shanghai-consultation','divorce-agreement-lawyer-review-rewrite'],
};

const run = (text, href) => ({ text, ...(href ? { href } : {}) });
const para = (text) => ({ type: 'paragraph', runs: [run(text)] });
const table = (caption, headers, rows) => ({ type:'table', caption, rows:[headers,...rows].map(r=>r.map(x=>[run(x)])) });

function build(profile, index) {
  const [id,slug,title,topic,serviceSlug,subtopicId,authorId,direct,issues,evidence,sources] = profile;
  const peers = profiles.filter(p=>p[3]===topic && p[1]!==slug).map(p=>p[1]);
  const relatedSlugs = [...peers.slice(0,2), topicMeta[topic][1]];
  const issueText = issues.map((x,i)=>`${i+1}. ${x}`).join('；');
  const evidenceText = evidence.map((x,i)=>`${i+1}. ${x}`).join('；');
  const sections = [
    { title:'先给结论：把问题拆成规则、事实和可执行安排', refs:[1], ps:[direct,`这类问题容易出现两种误区：一是只抓住一个标签，例如“婚内”“加名”“签字”或“没领证”，就直接推导结果；二是把咨询中尚未确认的情况写成已经发生的事实。稳妥的分析方式是先确定适用规则，再把时间、主体、资金、文书和履行状态逐项放回证据中。本文提供的是一般核查框架，不替代针对具体材料形成的法律意见。`,`本文围绕五个判断点展开：${issueText}。任何一个判断点发生变化，都可能影响法律关系、举证责任或可选择的程序，因此应保留“已确认”“待核实”和“仅为假设”三种标记。`]},
    { title:'适用规则：先确认法律关系，再讨论结果', refs:sources.map((_,i)=>i+1), ps:[`第一步不是计算结果，而是确认争议属于哪一种法律关系。${issues[0]}决定基础入口；${issues[1]}关系到权利义务的具体范围；${issues[2]}往往决定需要由谁进一步举证。规则必须与事实对应，不能因为某个条文看起来相关就跳过前提。`,`现行法律通常同时保护婚姻家庭成员、交易相对人、未成年人或公司等不同主体。遇到权利冲突时，裁判不会只看一方的口头叙述，而会结合书面文书、付款或履行过程、行为发生顺序以及各方是否善意。官方来源支持的是判断框架，不代表对本文假设事实作出结论。`,`地方办理要求与全国实体规则也要分开。实体权利主要依全国性法律和司法解释判断；预约、材料格式、线上线下办理、窗口工作日等事项，则应以办理机关当日公开指引为准。`]},
    { title:'建立时间线：五个节点不要混在一起', refs:[1], ps:[`建议从最早的权利或关系形成时间开始，依次记录文书签署、付款或交付、登记或备案、实际履行、争议发生和当前程序状态。只写“婚前”“婚后”往往不够，应尽量精确到日期，并注明证据来源。`,`时间线需要特别标记：${issues.join('、')}。如果同一事实有两个版本，不急于选一个“更有利”的版本，而应把冲突并列写明，再找形成时间更早、来源更独立的资料核对。`,`对于截图、导出文件和复印件，要保留原始载体和取得方式。后补的说明可以作为线索，但不能自然替代当时形成的合同、流水、登记资料或连续沟通。`]},
    { title:'关键分支：哪些事实会真正改变判断', refs:[1,Math.min(2,sources.length)], ps:issues.map((x,i)=>`分支${i+1}｜${x}。核对这一项时，应分别写明谁主张、对方是否认可、现有材料能证明到什么程度，以及还有哪一份资料可能推翻当前理解。不要把“可能”“一般”“已经确认”混为同一种结论。`).concat([`把五个分支放在一起后，再判断是适合协商、补充书面约定、向有关机构查询，还是进入诉讼或其他程序。先行动后核对，容易造成证据灭失、履行困难或对外责任继续扩大。`])},
    { title:`针对“${title.replace(/？$/,'')}”的五项逐项核验`, refs:sources.map((_,i)=>i+1), ps:issues.flatMap((x,i)=>[
      `${i+1}｜先核对${x}。最直接的起点是${evidence[i]}，再用${evidence[(i+1)%evidence.length]}检查时间、主体和实际履行是否一致。若两份材料反映的内容不同，应保留各自原始版本，并说明差异产生在签署、付款、登记、使用还是争议之后。`,
      `这一项会影响本题的${['基础法律关系','责任或权益范围','举证方向','程序选择','最终履行'][i]}。现阶段能够确认到哪一步，就把结论写到哪一步；如果${evidence[(i+2)%evidence.length]}尚未取得，应暂时列为待核事实，而不是用对自己有利的推测补齐。`,
    ])},
    { title:'材料核查表：每份材料都要说明证明目的', refs:[sources.length], ps:[`材料不是越多越好，而是要与争点建立对应关系。下面的表格可用于第一次整理；“现有状态”一栏请填写原件、复印件、截图、可申请调取或暂缺，避免只列材料名称。`,`本题优先核对：${evidenceText}。对无法合法自行取得的材料，先记录准确线索，不要冒用他人身份、破解账号或诱导未成年人提供隐私。`], tbl:{caption:`${id} 证据—目的—风险核查表`,headers:['材料或事实','主要证明目的','常见局限','下一步'],rows:evidence.map((x,i)=>[x,issues[i%issues.length],i%2?'单份材料可能缺少上下文':'需核对形成时间和原始载体',i%2?'补充相互印证资料':'保留原件并制作时间线'])}},
    { title:'证据不足时怎样处理', refs:[sources.length], ps:[`资料暂缺时，可以先用“线索—保管人—形成时间—申请方式”记录，而不是直接填入想象中的内容。能够从本人账户、本人签署文件或公开登记取得的资料先行整理；涉及银行、平台、公司内部资料或他人隐私的，评估是否需要依法申请调查取证。`,`如果只有聊天截图，应补齐对话对象、时间、上下文和原始设备；如果只有转账，应同时核对账户主体、备注、前后沟通和实际用途；如果只有一份协议，应查看附件、修改稿、签署页以及后续是否按约履行。`,`证据不足并不等于一定败诉，但意味着结论只能写到相应强度。咨询时明确告诉律师哪些是亲历事实、哪些来自他人转述、哪些仍在核查，通常比给出一个过度确定的故事更有帮助。`]},
    { title:'常见误区：五种看似省事的判断并不可靠', refs:[1], ps:[`误区一：只按标题判断。例如看到“婚内”“共同生活”或“签字”就直接认定权利性质，忽略条文中的用途、意思表示、登记和例外条件。`,`误区二：把内部约定当成对所有第三人都当然有效。夫妻之间、家庭成员之间的安排，是否能约束银行、公司、登记机关或其他相对人，需要分别判断。`,`误区三：把金额示例当成统一标准。文章中的计算或比例只能帮助理解方法，具体结果取决于已确认事实、当地情况和裁判尺度。`,`误区四：为证明主张而删掉不利信息。完整时间线更容易发现真正争点，片面材料反而可能降低陈述可信度。`,`误区五：只解决“归谁”，不写交付、付款、过户、探望、保密或违约后的处理。不能履行的文本，即使表面清楚，也会把争议推迟。`]},
    { title:'当前可以做的三步', refs:[1], ps:[`第一步，按本文表格整理已有材料，把${issues.slice(0,3).join('、')}标成红色优先项。每项只写能够由材料或亲历事实支持的内容。`,`第二步，把希望得到的结果拆成“身份或权利确认”“金额或比例”“程序选择”“实际履行”四类。不同目标可能需要不同证据和路径，不能用一个笼统请求替代。`,`第三步，在签署新文件、支付大额款项、转移财产、放弃权利或采取可能影响孩子和第三人的行动前，让专业人员结合原件核对。存在现实人身危险时，先报警、就医和寻求安全帮助，不等待材料全部齐备。`]},
    { title:'把双方说法改写成可以验证的问题', refs:[1,sources.length], ps:[`当一方说“这是我的”“对方已经同意”或“大家一直都是这样处理”时，先不要围绕评价争论。把陈述改写成四个问题：具体是哪项权利或义务；同意发生在什么时间、以何种方式表达；之后有没有相反行为；目前有哪些独立资料可以验证。这样可以把情绪化分歧转成证据任务。`,`针对本题，可以依次追问：${issues.map(x=>`“${x}的具体事实是什么”`).join('、')}。每个问题都应允许回答“尚不知道”。不知道并不是缺陷，未核实却写成确定事实才会干扰下一步判断。`,`双方对同一笔款项、同一份文件或同一段照护经历描述不一致时，建议制作双栏表。左栏记录甲方版本及其依据，右栏记录乙方版本及其依据，中间单列无争议事实。不要在整理阶段删除与预期结论不一致的材料；律师需要先看见冲突，才能评估举证方向和风险。`,`公开查询资料也应标明查询日期。登记信息、公司状态、办理指南或执业信息可能变化，截图应同时保留网址、页面标题和查询时间。对于需要登录才能查看的数据，记录合法账号来源，不把未经授权取得的内容放入公开文章或随意转发。`]},
    { title:'协商、协议和裁判结果如何落地', refs:[1], ps:[`如果准备协商，不要只交换一个比例或一句“归一方”。至少要写明对象、范围、金额或计算方法、付款和交付时间、所需配合、税费或手续、逾期处理以及证明履行完成的材料。涉及持续义务的，还要约定信息更新、紧急情况和无法按期履行时的沟通机制。`,`如果争议涉及第三人，夫妻或家庭成员之间的文本不能当然替代第三人的同意。例如银行是否变更借款人、公司是否办理股东名册及登记、登记机关是否接受材料、学校或医疗机构如何配合，都要分别核实。协议可以约定双方相互配合，却不应写成第三人已经承诺。`,`进入诉讼后，诉讼请求要与证据和可执行结果对应。主张确认、返还、分割、补偿、停止侵害或履行手续，各自需要的事实基础不同。把所有不满写进一项笼统请求，可能导致争点不清；只追求文字上的“胜诉”，忽略财产现状、付款能力或孩子的实际生活，也可能造成执行困难。`,`无论协商还是诉讼，都应保存最终文本和履行凭证。付款要对应约定项目，交付材料要列明名称和份数，线上操作要保存成功页面或回执。后续发生变化时，先判断是否属于原约定范围，再决定是补充协议、申请执行还是另行处理。`]},
    { title:'哪些情况需要尽快获得个案意见', refs:[1], ps:[`出现以下情况时，不宜只依据通用文章自行决定：关键原件可能灭失；对方正在转移财产或变更登记；已经收到法院、银行、公司或行政机关的期限通知；孩子、人身安全或必要医疗面临现实风险；需要签署放弃权利、担保、和解或大额付款文件。期限和行为一旦经过，后续补救空间可能缩小。`,`咨询前不必等所有资料齐备。可先提供一页时间线、最核心的两三份文书和本文核查表，并明确希望先解决的问题。律师可以据此判断还需要哪些材料、哪些事实目前不能下结论，以及是否存在必须先处理的程序事项。`,`选择服务时应确认接洽人员身份、实际承办范围、收费方式、交付内容和沟通渠道。任何专业服务都不能保证固定结果；有价值的工作是把规则、证据、风险和可执行选项解释清楚，并随着新材料及时修正判断。`]},
    { title:'上海办理与咨询边界', refs:topic==='上海与综合咨询'?[1,2]:[1], ps:[`本文所述实体规则面向中国大陆的一般情形。上海的立案、登记、预约、材料补正和窗口安排可能随系统及部门通知调整，办理前应通过官方渠道核对。`,`文章没有根据标题虚构上海个案，也没有把其他地区的报道写成上海统一做法。若事实发生在多地，应分别记录婚姻登记地、经常居住地、财产所在地、公司所在地及孩子实际生活地，再判断受理和办理路径。`]},
    { title:'常见问题', refs:sources.map((_,i)=>i+1), ps:[`问：只有口头说法，没有书面材料，还能咨询吗？答：可以。先把时间、人物、金额或行为按亲历程度写清楚，同时列出材料由谁保管、能否合法取得。咨询的第一步通常就是识别缺口。`,`问：对方不配合提供材料怎么办？答：先保存自己能够合法取得的原件和线索。是否可以申请法院调查、律师调查令或向登记机构查询，要结合程序阶段和资料类型判断。`,`问：聊天记录截图可以直接使用吗？答：截图可以作为线索，但应尽量保留原始设备、完整上下文、对方身份对应关系和导出方式，避免只截取一句话。`,`问：双方已经签字，是否就一定按文本执行？答：还需核对签署人的身份和能力、意思表示、文本内容是否合法、是否涉及第三人，以及后续是否变更或实际履行。`,`问：能否先按网上计算器或模板得出结果？答：可以用于整理问题，不能当作个案结论。模板最容易遗漏前提、例外和履行条件。`,`问：是否必须公证？答：不同法律行为对形式要求不同。公证可以强化某些事实的证明，但不能替代权利人同意、登记、审批或合法内容。`,`问：准备咨询时最重要的三份材料是什么？答：完整时间线、核心文书原件和能够显示款项或行为实际发生的原始记录。具体主题还需增加本文证据表所列资料。`,`问：文章中的结论可以直接用于起诉状吗？答：不建议。诉讼请求、事实理由和证据组织需要与真实材料、管辖及程序阶段对应。`]},
    { title:'相关阅读与专业咨询', refs:[], ps:[`本题可继续阅读同专题文章，比较相邻问题的适用前提。官网专题页：${topic}；相关服务页提供咨询前材料清单。站内链接只用于帮助组织阅读，不代表外部机构对本所作出推荐。`,`作者署名不等于已经对读者个案形成律师意见。本稿依据用户发布授权上线，尚待人工律师复核；法律、行政和平台信息应以实际办理时的有效规则为准。`]},
    { title:'联系上海江怀律师事务所', refs:[], ps:[contact]},
  ];
  const heroSrc = `/images/articles/${slug}/hero.webp`;
  const article = {
    slug,status:'published',reviewStatus:'publication-approved',publicationApproval:approval,sourceDocument:feishuLinks[id]||sourceDocument,
    title,summary:direct,serviceSlug,topicSlug:topicMeta[topic][0],subtopicId,relatedSlugs,
    authorId,datePublished:published,dateModified:published,jurisdiction:'中国大陆；涉及上海本地办理条件时以当日官方指引为准',
    hero:{type:'image',src:heroSrc,alt:`${title}：AI生成的主题场景示意图，不代表真实个案`,width:1672,height:941},
    intro:[para(direct)],
    sourceUrls:sources,
    sections:sections.map((s,i)=>({id:`section-${i+1}`,title:s.title,paragraphs:s.ps,blocks:[...s.ps.map(para),...(s.tbl?[{type:'image',src:`/images/articles/${slug}/evidence-ai.webp`,alt:`${title}：AI生成的证据与办理路径示意图，不代表真实个案或材料`,width:1672,height:941},table(s.tbl.caption,s.tbl.headers,s.tbl.rows)]:[])],sourceRefs:s.refs})),
    faqs:[],revisionNote:'2026-09-19：依据文章计划首次发布，补充条件化结论、证据表、FAQ、官方法源、专题内链与联系入口；增加每篇独立生成的AI主视觉和证据路径图。'
  };
  const reading=article.sections.at(-2);
  reading.blocks=[
    {type:'paragraph',runs:[run('继续阅读：'),run(profiles.find(p=>p[1]===relatedSlugs[0])?.[2]||'同专题文章',`https://anxinlaw.xyz/insights/${relatedSlugs[0]}/`),run('；也可进入'),run(`${topic}专题`,`https://anxinlaw.xyz/insights/topics/${topicMeta[topic][0]}/`),run('按相邻问题继续核对。')]},
    {type:'paragraph',runs:[run('准备咨询时，可先查看'),run('对应业务范围',`https://anxinlaw.xyz/services/${serviceSlug}/`),run('、'),run('律师公开资料',`https://anxinlaw.xyz/lawyers/${authorId}/`),run('和'),run('咨询材料清单','https://anxinlaw.xyz/resources/consultation/'),run('。这些站内入口用于组织材料与阅读，不代表外部机构推荐。')]},
  ];
  reading.paragraphs=reading.blocks.map(b=>b.runs.map(r=>r.text).join(''));
  const contactSection=article.sections.at(-1);
  contactSection.blocks=[{type:'paragraph',runs:[run(contact+' '),run('查看咨询与到所指引','https://anxinlaw.xyz/contact/')]}];
  contactSection.paragraphs=[contactSection.blocks[0].runs.map(r=>r.text).join('')];
  return {id,index,article};
}

const out=[];
for (let i=0;i<profiles.length;i++) {
  const built=build(profiles[i],i);const {article}=built;
  const dest=`content/posts/${article.slug}.json`;
  await writeFile(dest,JSON.stringify(article,null,2)+'\n');
  const dir=`public/images/articles/${article.slug}`;await mkdir(dir,{recursive:true});
  out.push(built);
}
await writeFile('../飞书文章审阅/batch20-generated.json',JSON.stringify(out,null,2)+'\n');
console.log(`Generated ${out.length} articles.`);
