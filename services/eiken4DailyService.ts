import { eiken4Sentences } from '../data/eiken4Sentences';
import { eiken4Words } from '../data/eiken4Words';
import { eiken4ListeningQuestions } from '../data/eiken4Listening';
import { eiken4CoreExamQuestions, eiken4CoreSentences } from '../data/eiken4Curriculum';
import { recordEiken4Activity } from './eiken4ProgressService';

export const EIKEN4_DAILY_KEY = 'eiken4DailyProgressV4';
const REVIEW_KEY = 'eiken4ReviewScheduleV1';
const REVIEW_INTERVALS = [1, 3, 7, 14];

export type DailyQuestion = {
  id: string;
  prompt: string;
  detail: string;
  answer: string;
  choices: string[];
  explanation?: string;
  kind: string;
  audioText?: string;
  transcript?: string;
  translation?: string;
};

export type DailyAnswer = { id: string; correct: boolean };

export type DailyProgress = {
  date: string;
  questionIds: string[];
  answers: DailyAnswer[];
  retryIds: string[];
  retryAnswers: DailyAnswer[];
  completedAt?: string;
};

type ReviewRecord = { id: string; dueDate: string; step: number };

export const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateKey(date);
};

const hash = (value: string) => {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const seededItems = <T,>(items: T[], seed: string, count: number) =>
  items
    .map((item, index) => ({ item, order: hash(`${seed}-${index}`) }))
    .sort((a, b) => a.order - b.order)
    .slice(0, count)
    .map(({ item }) => item);

const choicesFor = (answer: string, distractors: string[], seed: string) => {
  const uniqueDistractors = Array.from(new Set(distractors)).filter(item => item !== answer);
  return seededItems([answer, ...seededItems(uniqueDistractors, `${seed}-distractors`, 3)], `${seed}-order`, 4);
};

const wordQuestion = (wordId: string, date: string): DailyQuestion | undefined => {
  const word = eiken4Words.find(item => `word-${item.id}` === wordId);
  if (!word) return undefined;
  return {
    id: wordId,
    prompt: word.word,
    detail: word.example,
    answer: word.meaning,
    choices: choicesFor(word.meaning, eiken4Words.filter(item => item.id !== word.id).map(item => item.meaning), `${date}-${word.id}`),
    kind: '単語',
  };
};

const sentenceQuestion = (sentenceId: string, date: string): DailyQuestion | undefined => {
  const sentence = eiken4Sentences.find(item => `sentence-${item.id}` === sentenceId);
  if (!sentence) return undefined;
  const answer = sentence.words.join(' ').replace(/ ([.,?!])/g, '$1');
  return {
    id: sentenceId,
    prompt: sentence.japaneseQuestion,
    detail: sentence.grammarTag,
    answer,
    choices: choicesFor(answer, eiken4Sentences.filter(item => item.id !== sentence.id).map(item => item.words.join(' ').replace(/ ([.,?!])/g, '$1')), `${date}-${sentence.id}`),
    explanation: sentence.explanation,
    kind: '文法・会話',
  };
};

const examQuestion = (examId: string, date: string): DailyQuestion | undefined => {
  const exam = eiken4CoreExamQuestions.find(item => `exam-${item.id}` === examId);
  if (!exam) return undefined;
  return {
    id: examId,
    prompt: exam.prompt,
    detail: exam.translation || exam.type,
    answer: exam.answer,
    choices: seededItems(exam.choices, `${date}-${exam.id}`, exam.choices.length),
    explanation: exam.explanation,
    kind: exam.type,
  };
};

const listeningQuestion = (listeningId: string, date: string): DailyQuestion | undefined => {
  const listening = eiken4ListeningQuestions.find(item => `listening-${item.id}` === listeningId);
  if (!listening) return undefined;
  return {
    id: listeningId,
    prompt: listening.question,
    detail: '音声を2回まで聞いて答えよう',
    answer: listening.answer,
    choices: seededItems(listening.choices, `${date}-${listening.id}`, listening.choices.length),
    explanation: listening.explanation,
    kind: 'リスニング',
    audioText: listening.audioText,
    transcript: listening.transcript,
    translation: listening.translation,
  };
};

export const getQuestionById = (id: string, date = localDateKey()) =>
  id.startsWith('word-') ? wordQuestion(id, date)
    : id.startsWith('listening-') ? listeningQuestion(id, date)
      : id.startsWith('exam-') ? examQuestion(id, date)
        : sentenceQuestion(id, date);

const loadReviews = (): ReviewRecord[] => {
  if (typeof localStorage === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(REVIEW_KEY) || '[]'); } catch { return []; }
};

const saveReviews = (records: ReviewRecord[]) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(REVIEW_KEY, JSON.stringify(records));
};

export const getDueReviewCount = () => loadReviews().filter(record => record.dueDate <= localDateKey()).length;
export const getReviewCategoryCounts = () => loadReviews().reduce((counts, record) => {
  const category = record.id.startsWith('word-') ? '単語' : record.id.startsWith('listening-') ? 'リスニング' : record.id.startsWith('exam-') ? '本番形式' : '文法・会話';
  counts[category] = (counts[category] || 0) + 1; return counts;
}, {} as Record<string, number>);

export const recordReviewAnswer = (id: string, correct: boolean, isRetry: boolean) => {
  const records = loadReviews();
  const index = records.findIndex(record => record.id === id);
  const current = index >= 0 ? records[index] : undefined;
  if (!correct) {
    const next = { id, dueDate: addDays(isRetry ? 1 : 0), step: 0 };
    if (index >= 0) records[index] = next; else records.push(next);
  } else if (current) {
    if (current.step >= REVIEW_INTERVALS.length) records.splice(index, 1);
    else records[index] = { id, dueDate: addDays(REVIEW_INTERVALS[current.step]), step: current.step + 1 };
  }
  saveReviews(records);
};

const buildDailyQuestionIds = (date: string) => {
  const dueIds = loadReviews().filter(record => record.dueDate <= date).slice(0, 5).map(record => record.id);
  const wordIds = seededItems(eiken4Words, `${date}-words`, 8).map(word => `word-${word.id}`);
  const sentenceIds = seededItems(eiken4CoreSentences, `${date}-sentences`, 4).map(sentence => `sentence-${sentence.id}`);
  const listeningIds = seededItems(eiken4ListeningQuestions, `${date}-listening`, 3).map(item => `listening-${item.id}`);
  const examIds = seededItems(eiken4CoreExamQuestions, `${date}-exam`, 3).map(item => `exam-${item.id}`);
  const category = (prefix: string, fresh: string[], count: number) =>
    Array.from(new Set([...dueIds.filter(id => id.startsWith(prefix)), ...fresh])).slice(0, count);
  return [
    ...category('word-', wordIds, 8),
    ...category('sentence-', sentenceIds, 4),
    ...category('listening-', listeningIds, 3),
    ...category('exam-', examIds, 3),
  ];
};

const emptyProgress = (): DailyProgress => ({
  date: localDateKey(),
  questionIds: buildDailyQuestionIds(localDateKey()),
  answers: [],
  retryIds: [],
  retryAnswers: [],
});

export const loadDailyProgress = (): DailyProgress => {
  if (typeof localStorage === 'undefined') return emptyProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN4_DAILY_KEY) || 'null') as DailyProgress | null;
    if (saved?.date === localDateKey()) return saved;
    const v3 = JSON.parse(localStorage.getItem('eiken4DailyProgressV3') || 'null') as DailyProgress | null;
    if (v3?.date === localDateKey()) {
      const migrated = v3.answers.length ? v3 : { ...v3, questionIds: buildDailyQuestionIds(v3.date) };
      saveDailyProgress(migrated); return migrated;
    }
    const previous = JSON.parse(localStorage.getItem('eiken4DailyProgressV2') || 'null') as DailyProgress | null;
    if (previous?.date === localDateKey()) {
      const migrated = previous.answers.length ? previous : { ...previous, questionIds: buildDailyQuestionIds(previous.date) };
      saveDailyProgress(migrated);
      return migrated;
    }
    const legacy = JSON.parse(localStorage.getItem('eiken4DailyProgressV1') || 'null') as { date: string; answers: DailyAnswer[]; completedAt?: string } | null;
    if (legacy?.date === localDateKey()) {
      const migrated: DailyProgress = {
        date: legacy.date,
        questionIds: buildDailyQuestionIds(legacy.date),
        answers: legacy.answers,
        retryIds: legacy.answers.filter(answer => !answer.correct).map(answer => answer.id),
        retryAnswers: [],
        completedAt: legacy.answers.every(answer => answer.correct) ? legacy.completedAt : undefined,
      };
      saveDailyProgress(migrated);
      return migrated;
    }
    return emptyProgress();
  } catch { return emptyProgress(); }
};

export const saveDailyProgress = (progress: DailyProgress) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(EIKEN4_DAILY_KEY, JSON.stringify(progress));
  if (progress.completedAt) recordEiken4Activity('daily', progress.date);
};
