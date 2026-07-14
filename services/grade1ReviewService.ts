import { grade1ReviewWords } from '../data/grade1Review';
import { GRADE_1_UNITS } from '../data/grade1';
import { localDateKey } from './eiken4DailyService';

const KEY = 'grade1DailyReviewV1';
const COVERAGE_KEY = 'grade1DailyCoverageV1';
const SELECTION_KEY = 'grade1DailySelectionV1';
export type Grade1ReviewProgress = { date: string; answers: boolean[]; completedAt?: string };
export type Grade1Selection = { wordIndexes: number[]; grammarIndexes: number[] };
export const grade1GrammarItems = GRADE_1_UNITS.flatMap((unit, unitIndex) => unit.sentences.map(sentence => ({
  unitIndex,
  title: unit.title.split(':')[0],
  question: sentence.japaneseQuestion,
  answer: sentence.words.join(' ').replace(/ ([.,?!])/g, '$1'),
  note: `${sentence.grammarTag}：${sentence.explanation}`,
  words: sentence.words,
})));

const coverage = () => { try { return JSON.parse(localStorage.getItem(COVERAGE_KEY) || '{}') as Record<string, number>; } catch { return {}; } };

export const getGrade1DailyItems = (date = localDateKey()) => {
  if (typeof localStorage !== 'undefined') try {
    const saved = JSON.parse(localStorage.getItem(SELECTION_KEY) || 'null') as ({ date: string } & Grade1Selection) | null;
    if (saved?.date === date) return getGrade1ItemsBySelection(saved);
  } catch { /* choose again */ }
  const seen = typeof localStorage === 'undefined' ? {} : coverage();
  const pick = <T extends { word?: string; title?: string; question?: string }>(items: T[], count: number, prefix: string) => items
    .map((item, index) => ({ item, index, count: seen[`${prefix}-${index}`] || 0 }))
    .sort((a, b) => a.count - b.count || a.index - b.index)
    .slice(0, count);
  const seed = Number(date.replaceAll('-', '')) % GRADE_1_UNITS.length;
  const unitIndexes = Array.from({ length: 5 }, (_, offset) => (seed + offset) % GRADE_1_UNITS.length);
  const grammar = unitIndexes.map(unitIndex => grade1GrammarItems
    .map((item, index) => ({ item, index, count: seen[`grammar-${index}`] || 0 }))
    .filter(entry => entry.item.unitIndex === unitIndex)
    .sort((a, b) => a.count - b.count || a.index - b.index)[0])
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const result = { words: pick(grade1ReviewWords, 5, 'word'), grammar };
  if (typeof localStorage !== 'undefined') localStorage.setItem(SELECTION_KEY, JSON.stringify({ date, wordIndexes: result.words.map(item => item.index), grammarIndexes: result.grammar.map(item => item.index) }));
  return result;
};

export const getGrade1ItemsBySelection = (selection: Grade1Selection) => ({
  words: selection.wordIndexes.map(index => ({ item: grade1ReviewWords[index], index })).filter(entry => entry.item),
  grammar: selection.grammarIndexes.map(index => ({ item: grade1GrammarItems[index], index })).filter(entry => entry.item),
});

export const getGrade1DailySelection = (date = localDateKey()): Grade1Selection => {
  const items = getGrade1DailyItems(date);
  return { wordIndexes: items.words.map(item => item.index), grammarIndexes: items.grammar.map(item => item.index) };
};

export const loadGrade1Review = (): Grade1ReviewProgress => {
  try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved?.date === localDateKey()) return saved; } catch { /* start today */ }
  return { date: localDateKey(), answers: [] };
};

export const saveGrade1Review = (progress: Grade1ReviewProgress) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(progress));
  if (!progress.completedAt) return;
  const items = getGrade1DailyItems(progress.date);
  const next = coverage();
  [...items.words.map(item => `word-${item.index}`), ...items.grammar.map(item => `grammar-${item.index}`)].forEach((id, index) => {
    if (progress.answers[index]) next[id] = (next[id] || 0) + 1;
  });
  localStorage.setItem(COVERAGE_KEY, JSON.stringify(next));
};

export const resetTodayGrade1Review = () => {
  if (typeof localStorage !== 'undefined') localStorage.removeItem(KEY);
};
