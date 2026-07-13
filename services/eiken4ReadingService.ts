import { eiken4Readings } from '../data/eiken4Readings';
import { localDateKey } from './eiken4DailyService';
import { recordEiken4Activity } from './eiken4ProgressService';

const KEY = 'eiken4DailyReadingV1';
export type ReadingProgress = { date: string; readingId: string; answers: string[]; completedAt?: string };

export const getTodayReading = () => {
  const start = new Date(2026, 0, 1).getTime();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const day = Math.floor((today.getTime() - start) / 86400000);
  return eiken4Readings[((day % eiken4Readings.length) + eiken4Readings.length) % eiken4Readings.length];
};

export const loadReadingProgress = (): ReadingProgress => {
  const reading = getTodayReading();
  if (typeof localStorage === 'undefined') return { date: localDateKey(), readingId: reading.id, answers: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null') as ReadingProgress | null;
    if (saved?.date === localDateKey() && saved.readingId === reading.id) return saved;
  } catch { /* start fresh */ }
  return { date: localDateKey(), readingId: reading.id, answers: [] };
};

export const saveReadingProgress = (progress: ReadingProgress) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(progress));
  if (progress.completedAt) recordEiken4Activity('reading', progress.date);
};
