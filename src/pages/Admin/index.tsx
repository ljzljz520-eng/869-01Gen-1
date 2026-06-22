import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X, LogOut, Users, BarChart3, Settings, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/store/useAuthStore';
import { useConfigStore } from '@/store/useConfigStore';
import { useCheckinStore } from '@/store/useCheckinStore';
import { seedData, resetData } from '@/data/seed';
import type { Booth, Industry } from '@/types';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { industries, booths, loadConfig } = useConfigStore();
  const { loadRecords } = useCheckinStore();

  const [activeTab, setActiveTab] = useState<'booths' | 'industries'>('booths');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'booth' | 'industry'; data: Booth | Industry | null }>({ type: 'booth', data: null });
  const [formData, setFormData] = useState<Partial<Booth | Industry>>({});

  useEffect(() => {
    if (user) {
      seedData();
      loadConfig();
      loadRecords();
    }
  }, [user, loadConfig, loadRecords]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: { pathname: '/admin' } }} replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openAddModal = (type: 'booth' | 'industry') => {
    setEditingItem({ type, data: null });
    setFormData(type === 'booth' ? { name: '', category: '', floor: 1, zone: 'A区' } : { name: '' });
    setEditModalOpen(true);
  };

  const openEditModal = (type: 'booth' | 'industry', data: Booth | Industry) => {
    setEditingItem({ type, data });
    setFormData(data);
    setEditModalOpen(true);
  };

  const handleSave = () => {
    const storageKey = editingItem.type === 'booth' ? 'exhibition_booths' : 'exhibition_industries';
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (editingItem.data) {
      const index = existingData.findIndex((item: { id: string }) => item.id === editingItem.data!.id);
      if (index !== -1) {
        existingData[index] = { ...existingData[index], ...formData };
      }
    } else {
      const newItem = {
        id: `${editingItem.type}-${Date.now()}`,
        ...formData,
      };
      existingData.unshift(newItem);
    }

    localStorage.setItem(storageKey, JSON.stringify(existingData));
    loadConfig();
    setEditModalOpen(false);
  };

  const handleDelete = (type: 'booth' | 'industry', id: string) => {
    if (!confirm('确定要删除吗？')) return;

    const storageKey = type === 'booth' ? 'exhibition_booths' : 'exhibition_industries';
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const filteredData = existingData.filter((item: { id: string }) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filteredData));
    loadConfig();
  };

  const handleResetData = () => {
    if (confirm('确定要重置所有数据吗？这将清除所有签到记录和配置。')) {
      resetData();
      loadConfig();
      loadRecords();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">系统管理</h1>
                <p className="text-sm text-slate-400">2026 科技创新博览会</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/sales')}>
                <Users className="w-4 h-4 mr-2" />
                销售管理
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                数据大屏
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'booths' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('booths')}
          >
            <MapPin className="w-4 h-4 mr-2" />
            展位管理
          </Button>
          <Button
            variant={activeTab === 'industries' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('industries')}
          >
            <Building2 className="w-4 h-4 mr-2" />
            行业分类
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="ml-auto"
            onClick={handleResetData}
          >
            重置所有数据
          </Button>
        </div>

        {activeTab === 'booths' ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>展位列表</CardTitle>
                <Button size="sm" onClick={() => openAddModal('booth')}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加展位
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/30">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">展位名称</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">分类</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">楼层</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">区域</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booths.map(booth => (
                      <tr key={booth.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-4 text-white font-medium">{booth.name}</td>
                        <td className="py-4 px-4 text-slate-300">{booth.category}</td>
                        <td className="py-4 px-4 text-slate-300">{booth.floor}F</td>
                        <td className="py-4 px-4 text-slate-300">{booth.zone}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditModal('booth', booth)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete('booth', booth.id)}>
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>行业分类</CardTitle>
                <Button size="sm" onClick={() => openAddModal('industry')}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加行业
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {industries.map(industry => (
                  <div
                    key={industry.id}
                    className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{industry.name}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal('industry', industry)}
                          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleDelete('industry', industry.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={editingItem.data ? `编辑${editingItem.type === 'booth' ? '展位' : '行业'}` : `添加${editingItem.type === 'booth' ? '展位' : '行业'}`}
        size="md"
      >
        <div className="space-y-4">
          {editingItem.type === 'booth' ? (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">展位名称</label>
                <input
                  type="text"
                  value={(formData as Partial<Booth>).name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 text-white rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="请输入展位名称"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">分类</label>
                <input
                  type="text"
                  value={(formData as Partial<Booth>).category || ''}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 text-white rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="如：人工智能、新能源"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">楼层</label>
                  <input
                    type="number"
                    value={(formData as Partial<Booth>).floor || 1}
                    onChange={e => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 text-white rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">区域</label>
                  <input
                    type="text"
                    value={(formData as Partial<Booth>).zone || ''}
                    onChange={e => setFormData({ ...formData, zone: e.target.value })}
                    className="w-full px-4 py-3 text-white rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    placeholder="如：A区"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">行业名称</label>
              <input
                type="text"
                value={(formData as Partial<Industry>).name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-white rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                placeholder="请输入行业名称"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setEditModalOpen(false)}
            >
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!formData.name}
            >
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
