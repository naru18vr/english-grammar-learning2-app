import { eiken4Sentences } from '../data/eiken4Sentences';
import { eiken4Words } from '../data/eiken4Words';

export const EIKEN4_DAILY_KEY = 'eiken4DailyProgressV1';

export type DailyAnswer = {
  id: string;
  correct: boolean;
};

export type DailyProgress = {
  date: string;
  answers: DailyAnswer[];
  completedAt?: string;
};

export const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

const choicesFor = (answer: string, distractors: string[], seed: string) =>
  seededItems([answer, ...seededItems(distractors, `${seed}-distractors`, 3)], `${seed}-order`, 4);

export const getDailyWordQuestions = (date = localDateKey()) =>
  seededItems(eiken4Words, `${date}-words`, 10).map((word, index, selected) => ({
    id: `word-${word.id}`,
    prompt: word.word,
    detail: word.example,
    answer: word.meaning,
    choices: choicesFor(
      word.meaning,
      eiken4Words.filter(item => item.id !== word.id).map(item => item.meaning),
      `${date}-${word.id}-${index}`
    ),
    kind: index < 5 ? '今日の単語' : '単語の確認',
  }));

export const getDailySentenceQuestions = (date = localDateKey()) =>
  seededItems(eiken4Sentences, `${date}-sentences`, 5).map(sentence => ({
    id: `sentence-${sentence.id}`,
    prompt: sentence.japaneseQuestion,
    detail: sentence.grammarTag,
    answer: sentence.words.join(' ').replace(/ ([.,?!])/g, '$1'),
    choices: choicesFor(
      sentence.words.join(' ').replace(/ ([.,?!])/g, '$1'),
      eiken4Sentences
        .filter(item => item.id !== sentence.id)
        .map(item => item.words.join(' ').replace(/ ([.,?!])/g, '$1')),
      `${date}-${sentence.id}`
    ),
    explanation: sentence.explanation,
    kind: '文法・会話',
  }));

export const loadDailyProgress = (): DailyProgress => {
  const today = localDateKey();
  if (typeof localStorage === 'undefined') return { date: today, answers: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN4_DAILY_KEY) || 'null') as DailyProgress | null;
    return saved?.date === today ? saved : { date: today, answers: [] };
  } catch {
    return { date: today, answers: [] };
  }
};

export const saveDailyProgress = (progress: DailyProgress) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(EIKEN4_DAILY_KEY, JSON.stringify(progress));
  }
};
