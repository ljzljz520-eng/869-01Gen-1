import { useState, useEffect } from 'react';
import { Monitor, Maximize, Minimize, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${year}年${month}月${day}日 ${weekDays[date.getDay()]}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour12: false });
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Monitor className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            2026 科技创新博览会
          </h1>
          <p className="text-cyan-400/70 text-sm">REAL-TIME DATA DASHBOARD</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-3xl font-bold text-white tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {formatTime(currentTime)}
          </p>
          <p className="text-slate-400 text-sm">{formatDate(currentTime)}</p>
        </div>

        <div className="h-12 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <><Minimize className="w-4 h-4 mr-2" />退出全屏</>
            ) : (
              <><Maximize className="w-4 h-4 mr-2" />全屏展示</>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出
          </Button>
        </div>
      </div>
    </header>
  );
}
