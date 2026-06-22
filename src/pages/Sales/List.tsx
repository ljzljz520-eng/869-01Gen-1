import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Search, Filter, Edit3, LogOut, Users, BarChart3, Settings, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { Select } from '@/components/ui/Select';
import NoteEditor from './NoteEditor';
import { useAuthStore } from '@/store/useAuthStore';
import { useCheckinStore } from '@/store/useCheckinStore';
import { useConfigStore } from '@/store/useConfigStore';
import { formatDate } from '@/utils/anonymize';
import { NOTE_STATUS_LABELS, NOTE_STATUS_COLORS, type CheckinRecord } from '@/types';

const PAGE_SIZE = 10;

export default function SalesListPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { records, loadRecords, getFilteredRecords } = useCheckinStore();
  const { industries, booths, loadConfig, getIndustryName, getBoothName } = useConfigStore();

  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [boothFilter, setBoothFilter] = useState('');
  const [willingFilter, setWillingFilter] = useState<string>('');
  const [noteFilter, setNoteFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<CheckinRecord | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      loadConfig();
      loadRecords();
    }
  }, [user, loadConfig, loadRecords]);

  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: '/sales' } }} replace />;
  }

  const filteredRecords = useMemo(() => {
    return getFilteredRecords({
      industryId: industryFilter || undefined,
      boothId: boothFilter || undefined,
      willingToTalk: willingFilter === '' ? undefined : willingFilter === 'true',
      hasNote: noteFilter === '' ? undefined : noteFilter === 'true',
      search: search || undefined,
    });
  }, [records, industryFilter, boothFilter, willingFilter, noteFilter, search, getFilteredRecords]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleEditNote = (record: CheckinRecord) => {
    setSelectedRecord(record);
    setEditorOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const resetFilters = () => {
    setSearch('');
    setIndustryFilter('');
    setBoothFilter('');
    setWillingFilter('');
    setNoteFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">销售管理系统</h1>
                <p className="text-sm text-slate-400">2026 科技创新博览会</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    数据大屏
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                    <Settings className="w-4 h-4 mr-2" />
                    展位管理
                  </Button>
                </>
              )}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="text-white text-sm">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>签到记录列表</CardTitle>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => { loadRecords(); }}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新
                </Button>
                <Button
                  variant={showFilters ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="搜索匿名编号或胸牌编号..."
                  className="w-full pl-12 pr-4 py-2.5 text-white rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder-slate-500"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 font-medium">{filteredRecords.length}</span>
                <span className="text-cyan-400/70 text-sm">条记录</span>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                <Select
                  label="行业"
                  placeholder="全部行业"
                  value={industryFilter}
                  onChange={e => { setIndustryFilter(e.target.value); setCurrentPage(1); }}
                >
                  {industries.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                  ))}
                </Select>
                <Select
                  label="感兴趣展位"
                  placeholder="全部展位"
                  value={boothFilter}
                  onChange={e => { setBoothFilter(e.target.value); setCurrentPage(1); }}
                >
                  {booths.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </Select>
                <Select
                  label="会谈意愿"
                  placeholder="全部"
                  value={willingFilter}
                  onChange={e => { setWillingFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="true">愿意</option>
                  <option value="false">暂不考虑</option>
                </Select>
                <Select
                  label="跟进状态"
                  placeholder="全部"
                  value={noteFilter}
                  onChange={e => { setNoteFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="true">已跟进</option>
                  <option value="false">未跟进</option>
                </Select>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="md:col-span-4 w-fit">
                  重置筛选
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">签到时间</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">匿名编号</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">行业</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">感兴趣展位</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">会谈意愿</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">跟进状态</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map(record => (
                    <tr key={record.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-4 text-slate-300 text-sm whitespace-nowrap">
                        {formatDate(record.checkinTime)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{record.anonymizedName}</span>
                          <span className="text-slate-500 text-xs font-mono">{record.badgeCode}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Tag variant="cyan">{getIndustryName(record.industryId)}</Tag>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                          {record.interestedBoothIds.slice(0, 3).map(id => (
                            <Tag key={id} variant="primary" size="sm">
                              {getBoothName(id)}
                            </Tag>
                          ))}
                          {record.interestedBoothIds.length > 3 && (
                            <Tag variant="default" size="sm">
                              +{record.interestedBoothIds.length - 3}
                            </Tag>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Tag variant={record.willingToTalk ? 'success' : 'default'}>
                          {record.willingToTalk ? '愿意' : '暂不'}
                        </Tag>
                      </td>
                      <td className="py-4 px-4">
                        {record.note ? (
                          <Tag className={NOTE_STATUS_COLORS[record.note.status]}>
                            {NOTE_STATUS_LABELS[record.note.status]}
                          </Tag>
                        ) : (
                          <Tag variant="warning">待跟进</Tag>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(record)}
                        >
                          <Edit3 className="w-4 h-4 mr-1.5" />
                          {record.note ? '编辑备注' : '添加备注'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {paginatedRecords.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">暂无匹配的签到记录</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/30">
                <p className="text-slate-400 text-sm">
                  显示 {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredRecords.length)} 条，
                  共 {filteredRecords.length} 条
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NoteEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
