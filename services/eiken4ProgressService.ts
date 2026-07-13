const ACTIVITY_KEY = 'eiken4ActivityLogV1';
const EXAM_DATE_KEY = 'eiken4ExamDateV1';

export type ActivityKind = 'daily' | 'reading' | 'mock';
export type ActivityLog = Record<string, Partial<Record<ActivityKind, boolean>>>;

export const getLocalDate = (date = new Date()) => {
  const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const loadActivityLog = (): ActivityLog => {
  if (typeof localStorage === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '{}'); } catch { return {}; }
};

export const recordEiken4Activity = (kind: ActivityKind, date = getLocalDate()) => {
  if (typeof localStorage === 'undefined') return;
  const log = loadActivityLog(); log[date] = { ...log[date], [kind]: true };
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log));
};

export const getExamDate = () => typeof localStorage === 'undefined' ? '2026-09-25' : localStorage.getItem(EXAM_DATE_KEY) || '2026-09-25';
export const saveExamDate = (date: string) => { if (typeof localStorage !== 'undefined') localStorage.setItem(EXAM_DATE_KEY, date); };

export const daysUntilExam = (date: string) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
};

export const lastSevenDays = () => Array.from({ length: 7 }, (_, index) => {
  const date = new Date(); date.setDate(date.getDate() - (6 - index));
  return getLocalDate(date);
});

export const calculateStreak = (log: ActivityLog) => {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const date = new Date(); date.setDate(date.getDate() - i);
    if (log[getLocalDate(date)]?.daily) streak++; else if (i > 0 || log[getLocalDate(date)]) break;
  }
  return streak;
};
