import { create } from 'zustand';
import type { CheckinRecord, CheckinFormData, SalesNote, DashboardStats } from '@/types';
import { getCheckinRecords, saveCheckinRecord, updateCheckinNote } from '@/data/seed';
import { calculateDashboardStats, generateId } from '@/utils/stats';
import { anonymizeName } from '@/utils/anonymize';
import { useConfigStore } from './useConfigStore';

interface CheckinState {
  records: CheckinRecord[];
  loadRecords: () => void;
  addRecord: (data: CheckinFormData) => CheckinRecord;
  updateNote: (recordId: string, note: Omit<SalesNote, 'id' | 'checkinRecordId' | 'updatedAt'>) => void;
  getFilteredRecords: (filters: {
    industryId?: string;
    boothId?: string;
    willingToTalk?: boolean;
    hasNote?: boolean;
    search?: string;
  }) => CheckinRecord[];
  getStats: () => DashboardStats;
  getRecentRecords: (count: number) => CheckinRecord[];
}

export const useCheckinStore = create<CheckinState>((set, get) => ({
  records: [],

  loadRecords: () => {
    set({ records: getCheckinRecords() });
  },

  addRecord: (data: CheckinFormData) => {
    const record: CheckinRecord = {
      id: generateId(),
      checkinTime: Date.now(),
      industryId: data.industryId,
      interestedBoothIds: data.interestedBoothIds,
      willingToTalk: data.willingToTalk,
      badgeCode: data.badgeCode,
      anonymizedName: anonymizeName(data.badgeCode),
    };

    saveCheckinRecord(record);
    set(state => ({ records: [record, ...state.records] }));
    return record;
  },

  updateNote: (recordId: string, noteData: Omit<SalesNote, 'id' | 'checkinRecordId' | 'updatedAt'>) => {
    const records = get().records;
    const recordIndex = records.findIndex(r => r.id === recordId);

    if (recordIndex === -1) return;

    const existingNote = records[recordIndex].note;
    const note: SalesNote = {
      id: existingNote?.id || generateId(),
      checkinRecordId: recordId,
      content: noteData.content,
      status: noteData.status,
      salesPerson: noteData.salesPerson,
      updatedAt: Date.now(),
    };

    updateCheckinNote(recordId, note);

    set(state => {
      const newRecords = [...state.records];
      newRecords[recordIndex] = { ...newRecords[recordIndex], note };
      return { records: newRecords };
    });
  },

  getFilteredRecords: (filters) => {
    const { records } = get();
    const { industryId, boothId, willingToTalk, hasNote, search } = filters;

    return records.filter(record => {
      if (industryId && record.industryId !== industryId) return false;
      if (boothId && !record.interestedBoothIds.includes(boothId)) return false;
      if (willingToTalk !== undefined && record.willingToTalk !== willingToTalk) return false;
      if (hasNote !== undefined) {
        const hasNoteRecord = !!record.note?.content;
        if (hasNote && !hasNoteRecord) return false;
        if (!hasNote && hasNoteRecord) return false;
      }
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = record.anonymizedName.toLowerCase().includes(searchLower);
        const matchesBadge = record.badgeCode.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesBadge) return false;
      }
      return true;
    });
  },

  getStats: () => {
    const { records } = get();
    const { industries, booths } = useConfigStore.getState();
    return calculateDashboardStats(records, booths, industries);
  },

  getRecentRecords: (count: number) => {
    return get().records.slice(0, count);
  },
}));
