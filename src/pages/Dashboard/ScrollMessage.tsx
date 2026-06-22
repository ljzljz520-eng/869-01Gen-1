import { useState, useEffect, useRef } from 'react';
import { anonymizeRecordForDisplay, formatTime } from '@/utils/anonymize';
import { useCheckinStore } from '@/store/useCheckinStore';
import { useConfigStore } from '@/store/useConfigStore';
import { Zap } from 'lucide-react';

export default function ScrollMessage() {
  const { getRecentRecords } = useCheckinStore();
  const { getIndustryName } = useConfigStore();
  const [messages, setMessages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const records = getRecentRecords(20);
    const msgs = records.map(record => {
      const industryName = getIndustryName(record.industryId);
      const time = formatTime(record.checkinTime);
      return `[${time}] ${anonymizeRecordForDisplay(industryName, record.willingToTalk)}`;
    });
    setMessages(msgs);
  }, [getRecentRecords, getIndustryName]);

  useEffect(() => {
    const interval = setInterval(() => {
      const records = getRecentRecords(20);
      if (records.length > 0) {
        const latest = records[0];
        const industryName = getIndustryName(latest.industryId);
        const time = formatTime(latest.checkinTime);
        const newMessage = `[${time}] ${anonymizeRecordForDisplay(industryName, latest.willingToTalk)}`;
        setMessages(prev => {
          if (prev[0] === newMessage) return prev;
          return [newMessage, ...prev.slice(0, 19)];
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [getRecentRecords, getIndustryName]);

  return (
    <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border-t border-cyan-500/20 py-3 px-8 overflow-hidden">
      <div className="flex items-center gap-4 max-w-full">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-cyan-400 font-medium whitespace-nowrap">实时动态</span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex gap-8 whitespace-nowrap animate-marquee"
          >
            {messages.map((msg, index) => (
              <span
                key={`${msg}-${index}`}
                className="text-slate-300 text-sm"
              >
                <span className="text-cyan-400">{msg.slice(0, 7)}</span>
                {msg.slice(7)}
              </span>
            ))}
            {messages.map((msg, index) => (
              <span
                key={`${msg}-${index}-dup`}
                className="text-slate-300 text-sm"
              >
                <span className="text-cyan-400">{msg.slice(0, 7)}</span>
                {msg.slice(7)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
