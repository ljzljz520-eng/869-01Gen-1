import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCheckinStore } from '@/store/useCheckinStore';
import { useConfigStore } from '@/store/useConfigStore';
import { seedData } from '@/data/seed';
import type { DashboardStats } from '@/types';
import DashboardHeader from './Header';
import { StatsCards } from './StatsCard';
import HeatmapPanel from './HeatmapPanel';
import RankingPanel from './RankingPanel';
import IndustryPanel from './IndustryPanel';
import ScrollMessage from './ScrollMessage';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { loadRecords, getStats } = useCheckinStore();
  const { loadConfig } = useConfigStore();

  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    seedData();
    loadConfig();
    loadRecords();

    const updateStats = () => {
      setStats(getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 30000);

    return () => clearInterval(interval);
  }, [loadConfig, loadRecords, getStats]);

  if (!user || !['sales', 'admin'].includes(user.role)) {
    return <Navigate to="/login" state={{ from: { pathname: '/dashboard' } }} replace />;
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <DashboardHeader />

      <main className="flex-1 p-8 overflow-auto relative z-10">
        <div className="max-w-[1800px] mx-auto space-y-6">
          <StatsCards
            stats={{
              total: stats.totalCheckins,
              today: stats.todayCheckins,
              current: stats.currentHourCheckins,
              rate: stats.willingToTalkRate,
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <HeatmapPanel
              hourlyData={stats.hourlyTrend}
              dailyData={stats.dailyTrend}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RankingPanel data={stats.boothRanking} />
          </div>

          <IndustryPanel
            data={stats.industryDistribution}
            willingRate={stats.willingToTalkRate}
          />
        </div>
      </main>

      <ScrollMessage />
    </div>
  );
}
