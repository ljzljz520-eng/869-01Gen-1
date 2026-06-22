import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Building2, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select, MultiSelect } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Tag } from '@/components/ui/Tag';
import { useConfigStore } from '@/store/useConfigStore';
import { useCheckinStore } from '@/store/useCheckinStore';
import { generateBadgeCode } from '@/data/mockData';
import type { CheckinFormData } from '@/types';

export default function CheckinFormPage() {
  const navigate = useNavigate();
  const { industries, booths, loadConfig } = useConfigStore();
  const { addRecord } = useCheckinStore();

  const [formData, setFormData] = useState<CheckinFormData>({
    industryId: '',
    interestedBoothIds: [],
    willingToTalk: true,
    badgeCode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckinFormData, string>>>({});

  useEffect(() => {
    loadConfig();
    setFormData(prev => ({ ...prev, badgeCode: generateBadgeCode() }));
  }, [loadConfig]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckinFormData, string>> = {};

    if (!formData.industryId) {
      newErrors.industryId = '请选择您的行业';
    }
    if (formData.interestedBoothIds.length === 0) {
      newErrors.interestedBoothIds = '请至少选择一个感兴趣的展位';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const record = addRecord(formData);
    navigate('/checkin/success', { state: { recordId: record.id } });
  };

  const handleBoothToggle = (boothId: string) => {
    setFormData(prev => ({
      ...prev,
      interestedBoothIds: prev.interestedBoothIds.includes(boothId)
        ? prev.interestedBoothIds.filter(id => id !== boothId)
        : [...prev.interestedBoothIds, boothId],
    }));
    if (errors.interestedBoothIds) {
      setErrors(prev => ({ ...prev, interestedBoothIds: undefined }));
    }
  };

  const selectedBoothNames = formData.interestedBoothIds
    .map(id => booths.find(b => b.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 pb-8 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回首页</span>
        </button>

        <Card glow className="p-6 md:p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">完成签到信息</h1>
            <p className="text-slate-400">请填写以下信息，约需 30 秒</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">您的行业</h3>
                  <p className="text-slate-400 text-sm">选择最符合您的领域</p>
                </div>
              </div>
              <Select
                label=""
                placeholder="请选择行业..."
                value={formData.industryId}
                onChange={e => {
                  setFormData(prev => ({ ...prev, industryId: e.target.value }));
                  if (errors.industryId) {
                    setErrors(prev => ({ ...prev, industryId: undefined }));
                  }
                }}
              >
                {industries.map(industry => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </Select>
              {errors.industryId && (
                <p className="text-red-400 text-sm">{errors.industryId}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">感兴趣的展位</h3>
                  <p className="text-slate-400 text-sm">可多选，我们将为您推送相关资讯</p>
                </div>
              </div>

              <MultiSelect
                options={booths.map(b => ({ id: b.id, name: b.name }))}
                selected={formData.interestedBoothIds}
                onChange={ids => {
                  setFormData(prev => ({ ...prev, interestedBoothIds: ids }));
                  if (errors.interestedBoothIds && ids.length > 0) {
                    setErrors(prev => ({ ...prev, interestedBoothIds: undefined }));
                  }
                }}
                placeholder="点击展位标签进行选择..."
              />

              {selectedBoothNames.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedBoothNames.map(name => (
                    <Tag key={name} variant="cyan" closable onClose={() => {
                      const booth = booths.find(b => b.name === name);
                      if (booth) handleBoothToggle(booth.id);
                    }}>
                      {name}
                    </Tag>
                  ))}
                </div>
              )}

              {errors.interestedBoothIds && (
                <p className="text-red-400 text-sm">{errors.interestedBoothIds}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">愿意接受展商洽谈</h3>
                  <p className="text-slate-400 text-sm">开启后，相关展商可能会与您联系</p>
                </div>
                <Toggle
                  checked={formData.willingToTalk}
                  onChange={e => setFormData(prev => ({ ...prev, willingToTalk: e.target.checked }))}
                />
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

            <div className="space-y-4">
              <Button
                size="lg"
                glow
                className="w-full group"
                onClick={handleSubmit}
              >
                提交签到
                <Send className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </Button>

              <p className="text-center text-xs text-slate-500">
                胸牌编号：<span className="text-slate-400 font-mono">{formData.badgeCode}</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
