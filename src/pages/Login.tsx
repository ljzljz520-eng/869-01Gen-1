import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import { useConfigStore } from '@/store/useConfigStore';
import { useCheckinStore } from '@/store/useCheckinStore';
import { seedData } from '@/data/seed';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuthStore();
  const { loadConfig } = useConfigStore();
  const { loadRecords } = useCheckinStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/sales';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    seedData();
    loadConfig();
    loadRecords();

    const result = login(username, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || '登录失败');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <Card glow className="w-full max-w-md p-8 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">销售管理系统</h1>
          <p className="text-slate-400">请登录以访问客户数据</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">用户名</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className="w-full pl-12 pr-4 py-3 text-white rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full pl-12 pr-4 py-3 text-white rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder-slate-500"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full group"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                登录
                <LogIn className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>

          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-slate-400 text-xs mb-2">演示账号：</p>
            <div className="space-y-1 text-xs text-slate-500 font-mono">
              <p>管理员: admin / admin123</p>
              <p>销售: sales01 / 123456</p>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
