import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BarChart } from '@/components/charts/BarChart';
import { Trophy, Medal } from 'lucide-react';
import type { BoothRankingItem } from '@/types';

interface RankingPanelProps {
  data: BoothRankingItem[];
}

const rankColors = ['text-amber-400', 'text-slate-300', 'text-amber-600'];
const rankBgColors = ['bg-amber-400/20', 'bg-slate-400/20', 'bg-amber-600/20'];

export default function RankingPanel({ data }: RankingPanelProps) {
  return (
    <Card glow className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            热门展位排行
          </CardTitle>
          <span className="text-sm text-slate-400">TOP 10</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <div className="hidden lg:flex flex-col gap-3 w-48">
            {data.slice(0, 3).map((item, index) => (
              <div
                key={item.boothId}
                className={`flex items-center gap-3 p-3 rounded-xl ${rankBgColors[index]} animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rankBgColors[index]}`}>
                  {index === 0 ? (
                    <Medal className={`w-5 h-5 ${rankColors[index]}`} />
                  ) : (
                    <span className={`font-bold ${rankColors[index]}`}>{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{item.boothName}</p>
                  <p className="text-slate-400 text-sm">{item.count} 人关注</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <BarChart data={data} height={380} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
