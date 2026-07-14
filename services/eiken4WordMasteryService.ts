import type { DailyProgress } from './eiken4DailyService';
const KEY = 'eiken4WordMasteryV2';
const LEGACY_KEY = 'eiken4WordMasteryV1';
const IMPORT_KEY = 'eiken4WordMasteryImportedDaysV2';
const CARD_DAILY_KEY = 'eiken4WordCardsDailyV1';
const QUIZ_DAILY_KEY = 'eiken4WordQuizDailyV1';
export type WordMastery = { days: Record<string, boolean>; correct: number; wrong: number; lastSeen: string };
export type WordMasteryMap = Record<string, WordMastery>;
const localDay = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
export const recordWordCardsDone = (day = localDay()) => { if (typeof localStorage !== 'undefined') localStorage.setItem(CARD_DAILY_KEY, day); };
export const areWordCardsDoneToday = () => typeof localStorage !== 'undefined' && localStorage.getItem(CARD_DAILY_KEY) === localDay();
export const recordWordQuizDone = (day = localDay()) => { if (typeof localStorage !== 'undefined') localStorage.setItem(QUIZ_DAILY_KEY, day); };
export const isWordQuizDoneToday = () => typeof localStorage !== 'undefined' && localStorage.getItem(QUIZ_DAILY_KEY) === localDay();
export const loadWordMastery = (): WordMasteryMap => {
  if (typeof localStorage === 'undefined') return {};
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null') as WordMasteryMap | null;
    if (saved) return saved;
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || '{}') as Record<string, { correct?: number; wrong?: number; streak?: number; lastSeen?: string }>;
    return Object.fromEntries(Object.entries(legacy).map(([id, item]) => [id, { days: item.lastSeen ? { [item.lastSeen.slice(0, 10)]: (item.streak || 0) > 0 } : {}, correct: item.correct || 0, wrong: item.wrong || 0, lastSeen: item.lastSeen || '' }]));
  } catch { return {}; }
};
export const recordWordMastery = (rawId: string, correct: boolean, day = localDay()) => {
  if (typeof localStorage === 'undefined') return;
  const id = rawId.replace(/^word-/, ''); const map = loadWordMastery();
  const current = map[id] || { days: {}, correct: 0, wrong: 0, lastSeen: '' };
  const previousToday = current.days[day];
  map[id] = { days: { ...current.days, [day]: previousToday === undefined ? correct : previousToday && correct }, correct: current.correct + (correct ? 1 : 0), wrong: current.wrong + (correct ? 0 : 1), lastSeen: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(map));
};
export type MasteryLevel = 'new' | 'learning' | 'consolidating' | 'mastered';
export const masteryLevel = (mastery?: WordMastery): MasteryLevel => {
  if (!mastery) return 'new';
  const days = Object.entries(mastery.days).sort(([a], [b]) => a.localeCompare(b));
  const correctDays = days.filter(([, correct]) => correct).length;
  const latestCorrect = days.at(-1)?.[1] === true;
  if (correctDays >= 4 && latestCorrect) return 'mastered';
  if (correctDays >= 2) return 'consolidating';
  return 'learning';
};
export const importDailyWordAnswers = (progress: DailyProgress) => {
  if (typeof localStorage === 'undefined') return;
  const imported = JSON.parse(localStorage.getItem(IMPORT_KEY) || '[]') as string[];
  if (imported.includes(progress.date)) return;
  progress.answers.filter(answer => answer.id.startsWith('word-')).forEach(answer => recordWordMastery(answer.id, answer.correct, progress.date));
  localStorage.setItem(IMPORT_KEY, JSON.stringify([...imported, progress.date].slice(-60)));
};
