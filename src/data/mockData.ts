import type { Booth, Industry, User, CheckinRecord } from '@/types';

export const INDUSTRIES: Industry[] = [
  { id: 'ind-001', name: '人工智能' },
  { id: 'ind-002', name: '智能制造' },
  { id: 'ind-003', name: '新能源' },
  { id: 'ind-004', name: '新材料' },
  { id: 'ind-005', name: '生物医药' },
  { id: 'ind-006', name: '集成电路' },
  { id: 'ind-007', name: '软件服务' },
  { id: 'ind-008', name: '电子商务' },
  { id: 'ind-009', name: '金融科技' },
  { id: 'ind-010', name: '物联网' },
];

export const BOOTHS: Booth[] = [
  { id: 'booth-001', name: '华为', category: '通信技术', floor: 1, zone: 'A区' },
  { id: 'booth-002', name: '阿里巴巴', category: '云计算', floor: 1, zone: 'A区' },
  { id: 'booth-003', name: '腾讯', category: '互联网', floor: 1, zone: 'B区' },
  { id: 'booth-004', name: '字节跳动', category: '人工智能', floor: 1, zone: 'B区' },
  { id: 'booth-005', name: '比亚迪', category: '新能源', floor: 2, zone: 'C区' },
  { id: 'booth-006', name: '宁德时代', category: '动力电池', floor: 2, zone: 'C区' },
  { id: 'booth-007', name: '中芯国际', category: '集成电路', floor: 2, zone: 'D区' },
  { id: 'booth-008', name: '药明康德', category: '生物医药', floor: 3, zone: 'E区' },
  { id: 'booth-009', name: '小米', category: '智能硬件', floor: 1, zone: 'B区' },
  { id: 'booth-010', name: '京东', category: '电子商务', floor: 3, zone: 'F区' },
  { id: 'booth-011', name: '美团', category: '本地生活', floor: 3, zone: 'F区' },
  { id: 'booth-012', name: '蔚来', category: '新能源汽车', floor: 2, zone: 'C区' },
  { id: 'booth-013', name: '理想汽车', category: '新能源汽车', floor: 2, zone: 'C区' },
  { id: 'booth-014', name: '小鹏汽车', category: '新能源汽车', floor: 2, zone: 'D区' },
  { id: 'booth-015', name: '百度', category: 'AI技术', floor: 1, zone: 'A区' },
];

export const USERS: (User & { password: string })[] = [
  { id: 'user-001', username: 'admin', password: 'admin123', role: 'admin', name: '管理员' },
  { id: 'user-002', username: 'sales01', password: '123456', role: 'sales', name: '销售经理-张' },
  { id: 'user-003', username: 'sales02', password: '123456', role: 'sales', name: '销售经理-李' },
];

const FIRST_NAMES = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
const ANONYMIZE_SUFFIX = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];

export function generateAnonymizedName(badgeCode: string): string {
  const hash = badgeCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const prefix = ANONYMIZE_SUFFIX[hash % ANONYMIZE_SUFFIX.length];
  const suffix = hash % 1000;
  return `访客${prefix}${suffix.toString().padStart(3, '0')}`;
}

export function generateBadgeCode(): string {
  const prefix = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${suffix}`;
}

function randomTimeWithinDays(days: number): number {
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  const randomOffset = Math.floor(Math.random() * days * msPerDay);
  return now - randomOffset;
}

function randomPick<T>(arr: T[], min: number = 1, max: number = 3): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateMockCheckinRecords(count: number = 150): CheckinRecord[] {
  const records: CheckinRecord[] = [];

  for (let i = 0; i < count; i++) {
    const badgeCode = generateBadgeCode();
    const industries = randomPick(INDUSTRIES, 1, 1);
    const booths = randomPick(BOOTHS, 1, 4);

    records.push({
      id: `record-${Date.now()}-${i.toString().padStart(4, '0')}`,
      checkinTime: randomTimeWithinDays(3),
      industryId: industries[0].id,
      interestedBoothIds: booths.map(b => b.id),
      willingToTalk: Math.random() > 0.4,
      badgeCode,
      anonymizedName: generateAnonymizedName(badgeCode),
    });
  }

  return records.sort((a, b) => b.checkinTime - a.checkinTime);
}
