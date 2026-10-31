// Transcribed from the nine original photographs supplied by the firm on 2026-10-31.
// Historical appointments are displayed with their documented terms.
export type Credential = {
  id: string;
  title: string;
  issuer: string;
  period: string;
  description: string;
  image?: string;
  rotation?: 180;
};

export const credentialsUpdated = '2026-10-31';
const image = (name: string) => '/images/credentials/' + name + '.jpg';

export const firmHonors: Credential[] = [{
  id: 'public-service-star-2020',
  title: '2020 年公益服务之星',
  issuer: '上海知识产权园',
  period: '2020 年',
  description: '上海江怀律师事务所获上海知识产权园颁发“公益服务之星”奖牌，奖牌主题为“疫情路上 律企同行”。',
  image: image('firm-public-service-star-2020'),
}];

export const xuHonors: Credential[] = [2019, 2017].map(year => ({
  id: 'outstanding-young-lawyer-' + year,
  title: year + ' 年度优秀青年律师',
  issuer: '上海江怀律师事务所',
  period: year + ' 年度',
  description: '许涛涛获上海江怀律师事务所颁发的“优秀青年律师”荣誉证书。',
  image: image('xu-outstanding-young-lawyer-' + year),
  rotation: 180,
}));

export const xuAppointments: Credential[] = [
  {
    id: 'jiangpu-161',
    title: '江浦 161 街坊第二业主委员会法律顾问',
    issuer: '上海市杨浦区江浦 161 街坊第二业主委员会',
    period: '2021 年 12 月—2024 年 11 月',
    description: '受聘担任该业主委员会法律顾问。',
    image: image('xu-jiangpu-161-counsel-2021-2024'),
    rotation: 180,
  },
  {
    id: 'dalian-apartment',
    title: '大连公寓业主委员会法律顾问',
    issuer: '上海市杨浦区大连公寓业主委员会',
    period: '2021 年 12 月—2024 年 8 月',
    description: '受聘担任该业主委员会法律顾问。',
    image: image('xu-dalian-apartment-counsel-2021-2024'),
    rotation: 180,
  },
  {
    id: 'yingda-court',
    title: '英达苑小区业主委员会法律顾问',
    issuer: '上海市杨浦区英达苑小区业主委员会',
    period: '2021 年 12 月—2023 年 11 月',
    description: '受聘担任该业主委员会法律顾问。',
    image: image('xu-yingda-court-counsel-2021-2023'),
    rotation: 180,
  },
  {
    id: 'jiangpu-liaosan',
    title: '江浦辽三业主委员会法律顾问',
    issuer: '上海市杨浦区江浦辽三业主委员会',
    period: '2021 年 12 月—2022 年 11 月',
    description: '受聘担任该业主委员会法律顾问。',
    image: image('xu-jiangpu-liaosan-counsel-2021-2022'),
    rotation: 180,
  },
];

export const xuTraining: Credential[] = [
  {
    id: 'young-lawyer-training-2026',
    title: '上海青年律师领军人才综合素质训练营（第十二期）',
    issuer: '上海市律师协会',
    period: '2026 年 8 月 14 日—8 月 18 日',
    description: '完成全部课程学习，获结业证书。',
    image: image('xu-young-lawyer-training-2026'),
  },
  {
    id: 'fudan-training-2025',
    title: '第一期杨浦区涉外法治人才专题培训班',
    issuer: '复旦大学',
    period: '2025 年 10 月 23 日—11 月 7 日',
    description: '在复旦大学脱产学习，修业期满、成绩合格，获非学历教育结业证书。课程涉及涉外法商谈判、国际商事仲裁司法审查、国际投融资与国际仲裁等内容。',
    // Original contains a government ID number. Keep it out of all public assets.
  },
];
