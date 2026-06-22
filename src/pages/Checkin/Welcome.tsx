import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useConfigStore } from '@/store/useConfigStore';
import { useCheckinStore } from '@/store/useCheckinStore';
import { seedData } from '@/data/seed';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { loadConfig } = useConfigStore();
  const { loadRecords } = useCheckinStore();

  useEffect(() => {
    seedData();
    loadConfig();
    loadRecords();
  }, [loadConfig, loadRecords]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <Card glow className="w-full max-w-md p-8 relative z-10 animate-fade-in-up">
        <div className="text-center space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30 animate-float">
              <QrCode className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce-slow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              2026 科技创新博览会
            </h1>
            <p className="text-slate-400 text-lg">
              欢迎您的到来
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <p className="text-white font-medium">选择您的行业</p>
                <p className="text-slate-400 text-sm">帮助我们更好地为您服务</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <p className="text-white font-medium">选择感兴趣的展位</p>
                <p className="text-slate-400 text-sm">可多选，获取更多资讯</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-semibold text-sm">3</span>
              </div>
              <div>
                <p className="text-white font-medium">完成签到</p>
                <p className="text-slate-400 text-sm">获取参观指南和专属礼品</p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            glow
            className="w-full group"
            onClick={() => navigate('/checkin/form')}
          >
            开始签到
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="text-xs text-slate-500">
            您的信息将被严格保密，仅用于展会服务
          </p>
        </div>
      </Card>
    </div>
  );
}
