import { Sentence } from '../types';

const STORAGE_KEY = 'sentenceLearningProfileV1';
const REVIEW_INTERVALS = [1, 3, 7, 14] as const;

export type Difficulty = '基本' | '標準' | '応用';
export type MasteryLevel = '未学習' | '練習中' | '定着中' | '定着';

export interface SentenceLearningRecord {
  correct: number;
  wrong: number;
  days: Record<string, boolean>;
  lastSeen: string;
  nextReview: string;
  weakness: string;
}

type LearningProfile = Record<string, SentenceLearningRecord>;

const dayKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (date: string, days: number) => {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + days);
  return dayKey(next);
};

export const loadSentenceLearningProfile = (): LearningProfile => {
  if (typeof localStorage === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as LearningProfile; }
  catch { return {}; }
};

export const classifyWeakness = (sentence: Sentence): string => {
  const source = `${sentence.grammarTag} ${sentence.explanation}`;
  if (/三単現|三人称|does|has to/.test(source)) return '三単現';
  if (/疑問|疑問詞|what|when|where|who|how/.test(source)) return '疑問文・語順';
  if (/否定|not|never/.test(source)) return '否定文';
  if (/現在完了|過去|未来|進行形|時制/.test(source)) return '時制';
  if (/前置詞|to |for |in |on |at /.test(source)) return '前置詞・熟語';
  if (/受け身|過去分詞/.test(source)) return '受け身・過去分詞';
  if (/関係|分詞|不定詞|動名詞|仮定法|接続詞/.test(source)) return sentence.grammarTag.split(/[（(]/)[0].trim();
  if (/be動詞|There is|There are/.test(source)) return 'be動詞';
  return '語順・文の組み立て';
};

export const getSentenceDifficulty = (sentence: Sentence): Difficulty => {
  const source = `${sentence.grammarTag} ${sentence.words.join(' ')}`;
  if (/関係|仮定法|現在完了進行|間接疑問|疑問詞|複数文法|whether/.test(source) || sentence.words.length >= 12) return '応用';
  if (/疑問|否定|比較|受け身|不定詞|動名詞|接続詞|現在完了/.test(source) || sentence.words.length >= 8) return '標準';
  return '基本';
};

export const getCurriculumLabels = (gradeId: string, unitId: string, sentence: Sentence): string[] => {
  const grade = gradeId.replace('grade', '中');
  const unit = unitId.replace('u', 'Unit ');
  const labels = [`NEW HORIZON ${grade} ${unit}`];
  const source = `${sentence.grammarTag} ${sentence.words.join(' ')}`;
  if (/be動詞|一般動詞|疑問|否定|過去|未来|比較|不定詞|動名詞|接続詞|受け身/.test(source)) labels.push('英検4級重要');
  if (gradeId === 'grade1') labels.push('基礎固め');
  return labels;
};

export const recordSentenceLearning = (gradeId: string, unitId: string, sentence: Sentence, correct: boolean) => {
  if (typeof localStorage === 'undefined') return;
  const profile = loadSentenceLearningProfile();
  const key = `${gradeId}_${unitId}_${sentence.id}`;
  const today = dayKey();
  const current = profile[key] || { correct: 0, wrong: 0, days: {}, lastSeen: '', nextReview: today, weakness: classifyWeakness(sentence) };
  const previousToday = current.days[today];
  const days = { ...current.days, [today]: previousToday === undefined ? correct : previousToday && correct };
  const successfulDays = Object.values(days).filter(Boolean).length;
  const interval = correct ? REVIEW_INTERVALS[Math.min(successfulDays - 1, REVIEW_INTERVALS.length - 1)] : 1;
  profile[key] = {
    correct: current.correct + (correct ? 1 : 0),
    wrong: current.wrong + (correct ? 0 : 1),
    days,
    lastSeen: new Date().toISOString(),
    nextReview: addDays(today, interval),
    weakness: classifyWeakness(sentence),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const getSentenceLearningRecord = (gradeId: string, unitId: string, sentenceId: string) =>
  loadSentenceLearningProfile()[`${gradeId}_${unitId}_${sentenceId}`];

export const getMasteryLevel = (record?: SentenceLearningRecord): MasteryLevel => {
  if (!record) return '未学習';
  const successfulDays = Object.values(record.days).filter(Boolean).length;
  if (successfulDays >= 4 && record.days[Object.keys(record.days).sort().at(-1) || '']) return '定着';
  if (successfulDays >= 2) return '定着中';
  return '練習中';
};

export const getWeaknessSummary = (records: Array<SentenceLearningRecord | undefined>) => {
  const counts = new Map<string, number>();
  records.filter((record): record is SentenceLearningRecord => Boolean(record?.wrong)).forEach(record => {
    counts.set(record.weakness, (counts.get(record.weakness) || 0) + record.wrong);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
};

export const formatReviewDate = (date?: string) => {
  if (!date) return '初回学習後に設定';
  const today = dayKey();
  if (date <= today) return '今日復習';
  const tomorrow = addDays(today, 1);
  if (date === tomorrow) return '明日復習';
  return `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}復習`;
};
