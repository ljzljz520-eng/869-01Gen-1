import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Drawer } from '@/components/ui/Modal';
import { Tag } from '@/components/ui/Tag';
import { useAuthStore } from '@/store/useAuthStore';
import { useCheckinStore } from '@/store/useCheckinStore';
import { useConfigStore } from '@/store/useConfigStore';
import { formatDate } from '@/utils/anonymize';
import { NOTE_STATUS_LABELS, NOTE_STATUS_COLORS, type NoteStatus } from '@/types';
import type { CheckinRecord } from '@/types';

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  record: CheckinRecord | null;
}

export default function NoteEditor({ isOpen, onClose, record }: NoteEditorProps) {
  const { user } = useAuthStore();
  const { updateNote } = useCheckinStore();
  const { getIndustryName, getBoothName } = useConfigStore();

  const [content, setContent] = useState('');
  const [status, setStatus] = useState<NoteStatus>('pending');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setContent(record.note?.content || '');
      setStatus(record.note?.status || 'pending');
    }
  }, [record]);

  if (!record) return null;

  const industryName = getIndustryName(record.industryId);
  const boothNames = record.interestedBoothIds.map(id => getBoothName(id));

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    updateNote(record.id, {
      content,
      status,
      salesPerson: user.name,
    });

    setSaving(false);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="客户跟进详情">
      <div className="space-y-6">
        <div className="space-y-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">匿名编号</span>
            <span className="text-white font-medium">{record.anonymizedName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">胸牌编号</span>
            <span className="text-white font-mono">{record.badgeCode}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">签到时间</span>
            <span className="text-white">{formatDate(record.checkinTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">所属行业</span>
            <Tag variant="cyan">{industryName}</Tag>
          </div>
          <div>
            <span className="text-slate-400 block mb-2">感兴趣的展位</span>
            <div className="flex flex-wrap gap-2">
              {boothNames.map(name => (
                <Tag key={name} variant="primary">{name}</Tag>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">会谈意愿</span>
            <Tag variant={record.willingToTalk ? 'success' : 'default'}>
              {record.willingToTalk ? '愿意' : '暂不考虑'}
            </Tag>
          </div>
          {record.note && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">上次跟进</span>
              <span className="text-slate-300 text-sm">
                {record.note.salesPerson} · {formatDate(record.note.updatedAt)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">跟进状态</label>
          <Select
            value={status}
            onChange={e => setStatus(e.target.value as NoteStatus)}
          >
            {Object.entries(NOTE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <div className="flex flex-wrap gap-2">
            {Object.entries(NOTE_STATUS_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value as NoteStatus)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  status === value
                    ? NOTE_STATUS_COLORS[value as NoteStatus]
                    : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:bg-slate-700/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">跟进备注</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="请输入跟进内容，如客户需求、联系方式、合作意向等..."
            rows={6}
            className="w-full px-4 py-3 text-white rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder-slate-500 resize-none"
          />
        </div>

        {record.note && (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-slate-400 text-sm mb-2">历史备注：</p>
            <p className="text-slate-300">{record.note.content}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-slate-700/30">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            <X className="w-4 h-4 mr-2" />
            取消
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                保存
              </>
            )}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
