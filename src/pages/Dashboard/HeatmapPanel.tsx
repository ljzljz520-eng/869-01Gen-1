import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';
import type { TrendItem } from '@/types';

interface HeatmapPanelProps {
  hourlyData: TrendItem[];
  dailyData: TrendItem[];
}

export default function HeatmapPanel({ hourlyData, dailyData }: HeatmapPanelProps) {
  return (
    <Card glow className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>人流热度趋势</CardTitle>
        <div className="flex gap-2 mt-2">
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            24小时趋势
          </button>
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-700/50 transition-colors">
            7天趋势
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <AreaChart data={hourlyData} color="#00F0FF" height={320} />
      </CardContent>
    </Card>
  );
}
