import { eiken4Words } from '../data/eiken4Words';
import { eiken4Sentences } from '../data/eiken4Sentences';
import { eiken4ListeningQuestions } from '../data/eiken4Listening';
import { eiken4Readings } from '../data/eiken4Readings';
import { DailyQuestion, getQuestionById } from './eiken4DailyService';
import { recordEiken4Activity } from './eiken4ProgressService';
import { eiken4ExamQuestions } from '../data/eiken4ExamQuestions';

const RESULT_KEY = 'eiken4WeeklyMockResultV1';
const HISTORY_KEY = 'eiken4MockHistoryV1';
const ATTEMPT_KEY = 'eiken4MockAttemptV1';

export type MockQuestion = DailyQuestion & { section: string; passage?: string; translation?: string; evidence?: string };
export type MockResult = { week: string; score: number; total: number; answers: Record<string, string>; completedAt: string; timeUsed: number };
export type MockAttempt = { week: string; index: number; remaining: number; answers: Record<string, string>; plays: Record<string, number> };

export const weekKey = () => {
  const date = new Date();
  const first = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil((((date.getTime() - first.getTime()) / 86400000) + first.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
};

const hash = (value: string) => {
  let result = 0;
  for (const character of value) result = Math.imul(31, result) + character.charCodeAt(0) | 0;
  return result >>> 0;
};
const pick = <T,>(items: T[], seed: string, count: number) => items.map((item, i) => ({ item, n: hash(`${seed}-${i}`) })).sort((a, b) => a.n - b.n).slice(0, count).map(x => x.item);

export const getWeeklyMock = (): MockQuestion[] => {
  const week = weekKey();
  const ids = [
    ...pick(eiken4Words, `${week}-w`, 5).map(x => `word-${x.id}`),
    ...pick(eiken4Sentences, `${week}-s`, 2).map(x => `sentence-${x.id}`),
    ...pick(eiken4ListeningQuestions, `${week}-l`, 2).map(x => `listening-${x.id}`),
  ];
  const basics = ids.map(id => getQuestionById(id, week)).filter((x): x is DailyQuestion => Boolean(x)).map(question => ({ ...question, section: question.kind }));
  const examQuestions: MockQuestion[] = pick(eiken4ExamQuestions, `${week}-exam`, 4).map(item => ({ id:`exam-${item.id}`,prompt:item.prompt,detail:item.type,answer:item.answer,choices:pick(item.choices,`${week}-${item.id}`,item.choices.length),explanation:item.explanation,kind:item.type,section:item.type }));
  const reading = pick(eiken4Readings, `${week}-r`, 1)[0];
  const readingQuestions: MockQuestion[] = reading.questions.map((question, index) => ({
    id: `mock-${reading.id}-${index}`,
    prompt: question.question,
    detail: reading.title,
    answer: question.answer,
    choices: pick(question.choices, `${week}-${reading.id}-${index}`, question.choices.length),
    explanation: question.explanation,
    kind: '長文', section: '長文', passage: reading.passage, translation: reading.translation, evidence: question.evidence,
  }));
  return [...basics, ...examQuestions, ...readingQuestions];
};

export const loadMockResult = (): MockResult | null => {
  if (typeof localStorage === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(RESULT_KEY) || 'null'); } catch { return null; }
};
export const loadMockHistory = (): MockResult[] => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as MockResult[];
    if (history.length) return history;
    const legacy = loadMockResult(); return legacy ? [legacy] : [];
  } catch { return []; }
};
export const saveMockResult = (result: MockResult) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(RESULT_KEY, JSON.stringify(result));
  if (typeof localStorage !== 'undefined') {
    const history = loadMockHistory(); history.push(result);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-20)));
    localStorage.removeItem(ATTEMPT_KEY);
  }
  recordEiken4Activity('mock');
};
export const loadMockAttempt = (): MockAttempt | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const attempt = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || 'null') as MockAttempt | null;
    return attempt?.week === weekKey() ? attempt : null;
  } catch { return null; }
};
export const saveMockAttempt = (attempt: MockAttempt) => { if (typeof localStorage !== 'undefined') localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt)); };
export const clearMockAttempt = () => { if (typeof localStorage !== 'undefined') localStorage.removeItem(ATTEMPT_KEY); };
