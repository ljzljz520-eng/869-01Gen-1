import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, PartyPopper, Gift, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { useCheckinStore } from '@/store/useCheckinStore';
import { useConfigStore } from '@/store/useConfigStore';
import { formatTime } from '@/utils/anonymize';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { records } = useCheckinStore();
  const { industries, booths, getIndustryName, getBoothName } = useConfigStore();

  const [showContent, setShowContent] = useState(false);
  const recordId = (location.state as { recordId?: string })?.recordId;
  const record = records.find(r => r.id === recordId);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (industries.length === 0 || booths.length === 0) {
      useConfigStore.getState().loadConfig();
    }
  }, [industries.length, booths.length]);

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-slate-400 mb-4">未找到签到记录</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </Card>
      </div>
    );
  }

  const industryName = getIndustryName(record.industryId);
  const boothNames = record.interestedBoothIds.map(id => getBoothName(id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]" />
      </div>

      <Card glow className="w-full max-w-md p-8 relative z-10">
        <div className="text-center space-y-6">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-500/30">
              <CheckCircle2 className="w-12 h-12 text-white animate-bounce-slow" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-spin-slow">
              <PartyPopper className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className={`space-y-2 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl font-bold text-white">签到成功！</h1>
            <p className="text-slate-400 text-lg">
              欢迎来到 2026 科技创新博览会
            </p>
          </div>

          <div className={`h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent transition-all duration-700 delay-100 ${showContent ? 'opacity-100' : 'opacity-0'}`} />

          <div className={`space-y-4 text-left transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span className="text-slate-300">签到时间</span>
              </div>
              <span className="text-white font-mono">{formatTime(record.checkinTime)}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-3">
                <span className="text-slate-300">所属行业</span>
              </div>
              <Tag variant="cyan">{industryName}</Tag>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 space-y-3">
              <p className="text-slate-300">感兴趣的展位</p>
              <div className="flex flex-wrap gap-2">
                {boothNames.map(name => (
                  <Tag key={name} variant="primary">{name}</Tag>
                ))}
              </div>
            </div>

            {record.willingToTalk && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-green-400" />
                  <span className="text-green-300">愿意接受洽谈</span>
                </div>
                <span className="text-green-400 text-sm">展商将与您联系</span>
              </div>
            )}
          </div>

          <div className={`space-y-3 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-medium">专属福利</span>
              </div>
              <p className="text-slate-300 text-sm">
                请凭签到页面到服务台领取展会专属纪念品一份
              </p>
            </div>

            <Button
              size="lg"
              className="w-full group"
              onClick={() => navigate('/')}
            >
              完成
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <p className="text-xs text-slate-500">
            您的匿名编号：{record.anonymizedName}
          </p>
        </div>
      </Card>
    </div>
  );
}
