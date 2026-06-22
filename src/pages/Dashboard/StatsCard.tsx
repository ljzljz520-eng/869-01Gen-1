import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Clock, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  trend?: number;
  color: 'cyan' | 'blue' | 'purple' | 'green';
  delay?: number;
}

const colorClasses = {
  cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30',
  blue: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30',
  purple: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
  green: 'from-green-500/20 to-green-500/5 text-green-400 border-green-500/30',
};

const iconBgClasses = {
  cyan: 'bg-cyan-500/20 text-cyan-400',
  blue: 'bg-blue-500/20 text-blue-400',
  purple: 'bg-purple-500/20 text-purple-400',
  green: 'bg-green-500/20 text-green-400',
};

function AnimatedNumber({ value, duration = 1000, prefix = '', suffix = '' }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
    const startValue = 0;
    const endValue = value;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeProgress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsCard({ title, value, suffix, prefix, icon: Icon, trend, color, delay = 0 }: StatsCardProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      glow
      className={cn(
        'p-6 bg-gradient-to-br',
        colorClasses[color],
        'transition-all duration-700',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="text-4xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className={cn('w-4 h-4', trend >= 0 ? 'text-green-400' : 'text-red-400')} />
              <span className={cn('text-sm font-medium', trend >= 0 ? 'text-green-400' : 'text-red-400')}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-slate-500 text-sm">较昨日</span>
            </div>
          )}
        </div>
        <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', iconBgClasses[color])}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </Card>
  );
}

export function StatsCards({ stats }: { stats: { total: number; today: number; current: number; rate: number } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="累计签到人数"
        value={stats.total}
        icon={Users}
        color="cyan"
        delay={100}
      />
      <StatsCard
        title="今日签到"
        value={stats.today}
        icon={TrendingUp}
        color="blue"
        delay={200}
        trend={12.5}
      />
      <StatsCard
        title="当前时段签到"
        value={stats.current}
        icon={Clock}
        color="purple"
        delay={300}
      />
      <StatsCard
        title="会谈意愿率"
        value={stats.rate}
        suffix="%"
        icon={MessageCircle}
        color="green"
        delay={400}
      />
    </div>
  );
}
