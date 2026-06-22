import { INDUSTRIES, BOOTHS, USERS, generateMockCheckinRecords } from './mockData';
import type { CheckinRecord } from '@/types';

const STORAGE_KEYS = {
  INDUSTRIES: 'exhibition_industries',
  BOOTHS: 'exhibition_booths',
  USERS: 'exhibition_users',
  CHECKIN_RECORDS: 'exhibition_checkin_records',
  INITIALIZED: 'exhibition_initialized',
};

export function seedData(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (initialized === 'true') {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.INDUSTRIES, JSON.stringify(INDUSTRIES));
  localStorage.setItem(STORAGE_KEYS.BOOTHS, JSON.stringify(BOOTHS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(USERS));

  const mockRecords = generateMockCheckinRecords(180);
  localStorage.setItem(STORAGE_KEYS.CHECKIN_RECORDS, JSON.stringify(mockRecords));

  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

export function getIndustries() {
  const data = localStorage.getItem(STORAGE_KEYS.INDUSTRIES);
  return data ? JSON.parse(data) : INDUSTRIES;
}

export function getBooths() {
  const data = localStorage.getItem(STORAGE_KEYS.BOOTHS);
  return data ? JSON.parse(data) : BOOTHS;
}

export function getUsers() {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : USERS;
}

export function getCheckinRecords(): CheckinRecord[] {
  const data = localStorage.getItem(STORAGE_KEYS.CHECKIN_RECORDS);
  return data ? JSON.parse(data) : [];
}

export function saveCheckinRecord(record: CheckinRecord): void {
  const records = getCheckinRecords();
  records.unshift(record);
  localStorage.setItem(STORAGE_KEYS.CHECKIN_RECORDS, JSON.stringify(records));
}

export function updateCheckinNote(recordId: string, note: CheckinRecord['note']): void {
  const records = getCheckinRecords();
  const index = records.findIndex(r => r.id === recordId);
  if (index !== -1) {
    records[index].note = note;
    localStorage.setItem(STORAGE_KEYS.CHECKIN_RECORDS, JSON.stringify(records));
  }
}

export function resetData(): void {
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  seedData();
}
