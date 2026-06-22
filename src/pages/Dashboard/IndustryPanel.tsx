import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PieChart } from '@/components/charts/PieChart';
import { PieChart as PieChartIcon, MessageSquare } from 'lucide-react';
import type { IndustryDistributionItem } from '@/types';

interface IndustryPanelProps {
  data: IndustryDistributionItem[];
  willingRate: number;
}

export default function IndustryPanel({ data, willingRate }: IndustryPanelProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card glow>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-purple-400" />
            行业分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={data} height={320} />
        </CardContent>
      </Card>

      <Card glow>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            会谈意愿分析
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${willingRate * 4.4} 440`}
                  className="animate-progress"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#00F0FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {willingRate.toFixed(1)}%
                </span>
                <span className="text-slate-400 text-sm">愿意会谈</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 text-sm mb-1">愿意会谈</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {Math.round(total * willingRate / 100)}
                <span className="text-sm text-slate-400 font-normal ml-1">人</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <p className="text-slate-400 text-sm mb-1">暂不考虑</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {total - Math.round(total * willingRate / 100)}
                <span className="text-sm text-slate-400 font-normal ml-1">人</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <p className="text-cyan-300 text-sm mb-1">💡 销售线索提示</p>
            <p className="text-slate-300 text-sm">
              建议优先联系会谈意愿强的观众，他们的转化率通常高出 3 倍以上。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
