import type {
  CheckinRecord,
  DashboardStats,
  Booth,
  Industry,
  BoothRankingItem,
  IndustryDistributionItem,
  TrendItem,
} from '@/types';

export function calculateDashboardStats(
  records: CheckinRecord[],
  booths: Booth[],
  industries: Industry[]
): DashboardStats {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartTime = todayStart.getTime();

  const currentHourStart = new Date();
  currentHourStart.setMinutes(0, 0, 0);
  const currentHourStartTime = currentHourStart.getTime();

  const totalCheckins = records.length;
  const todayCheckins = records.filter(r => r.checkinTime >= todayStartTime).length;
  const currentHourCheckins = records.filter(r => r.checkinTime >= currentHourStartTime).length;
  const willingToTalkCount = records.filter(r => r.willingToTalk).length;
  const willingToTalkRate = totalCheckins > 0 ? (willingToTalkCount / totalCheckins) * 100 : 0;

  const boothCountMap = new Map<string, number>();
  records.forEach(record => {
    record.interestedBoothIds.forEach(boothId => {
      boothCountMap.set(boothId, (boothCountMap.get(boothId) || 0) + 1);
    });
  });

  const boothRanking: BoothRankingItem[] = booths
    .map(booth => ({
      boothId: booth.id,
      boothName: booth.name,
      count: boothCountMap.get(booth.id) || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const industryCountMap = new Map<string, number>();
  records.forEach(record => {
    industryCountMap.set(record.industryId, (industryCountMap.get(record.industryId) || 0) + 1);
  });

  const industryDistribution: IndustryDistributionItem[] = industries
    .map(industry => ({
      industryId: industry.id,
      industryName: industry.name,
      count: industryCountMap.get(industry.id) || 0,
    }))
    .sort((a, b) => b.count - a.count);

  const hourlyTrend: TrendItem[] = [];
  for (let i = 23; i >= 0; i--) {
    const hourStart = new Date();
    hourStart.setHours(hourStart.getHours() - i, 0, 0, 0);
    const hourEnd = new Date(hourStart);
    hourEnd.setHours(hourEnd.getHours() + 1);

    const count = records.filter(
      r => r.checkinTime >= hourStart.getTime() && r.checkinTime < hourEnd.getTime()
    ).length;

    hourlyTrend.push({
      time: `${hourStart.getHours().toString().padStart(2, '0')}:00`,
      count,
    });
  }

  const dailyTrend: TrendItem[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const count = records.filter(
      r => r.checkinTime >= dayStart.getTime() && r.checkinTime < dayEnd.getTime()
    ).length;

    dailyTrend.push({
      time: `${(dayStart.getMonth() + 1).toString().padStart(2, '0')}/${dayStart.getDate().toString().padStart(2, '0')}`,
      count,
    });
  }

  return {
    totalCheckins,
    todayCheckins,
    currentHourCheckins,
    willingToTalkRate,
    boothRanking,
    industryDistribution,
    hourlyTrend,
    dailyTrend,
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
