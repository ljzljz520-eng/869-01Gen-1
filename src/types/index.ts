export interface Booth {
  id: string;
  name: string;
  category: string;
  floor: number;
  zone: string;
}

export interface Industry {
  id: string;
  name: string;
}

export type NoteStatus = 'pending' | 'contacted' | 'negotiating' | 'closed';

export interface SalesNote {
  id: string;
  checkinRecordId: string;
  content: string;
  status: NoteStatus;
  updatedAt: number;
  salesPerson: string;
}

export interface CheckinRecord {
  id: string;
  checkinTime: number;
  industryId: string;
  interestedBoothIds: string[];
  willingToTalk: boolean;
  badgeCode: string;
  anonymizedName: string;
  note?: SalesNote;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'sales' | 'admin';
}

export interface BoothRankingItem {
  boothId: string;
  boothName: string;
  count: number;
}

export interface IndustryDistributionItem {
  industryId: string;
  industryName: string;
  count: number;
}

export interface TrendItem {
  time: string;
  count: number;
}

export interface DashboardStats {
  totalCheckins: number;
  todayCheckins: number;
  currentHourCheckins: number;
  willingToTalkRate: number;
  boothRanking: BoothRankingItem[];
  industryDistribution: IndustryDistributionItem[];
  hourlyTrend: TrendItem[];
  dailyTrend: TrendItem[];
}

export interface CheckinFormData {
  industryId: string;
  interestedBoothIds: string[];
  willingToTalk: boolean;
  badgeCode: string;
}

export const NOTE_STATUS_LABELS: Record<NoteStatus, string> = {
  pending: '待联系',
  contacted: '已联系',
  negotiating: '洽谈中',
  closed: '已成交',
};

export const NOTE_STATUS_COLORS: Record<NoteStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  negotiating: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  closed: 'bg-green-500/20 text-green-400 border-green-500/30',
};
