import { eiken4Words } from '../data/eiken4Words';
import { eiken4ListeningQuestions } from '../data/eiken4Listening';
import { eiken4Readings } from '../data/eiken4Readings';
import { eiken4CoreExamQuestions, eiken4CoreSentences } from '../data/eiken4Curriculum';
import { DailyQuestion, getQuestionById, localDateKey } from './eiken4DailyService';

export type PrepQuestion = DailyQuestion & { section: string; passage?: string; evidence?: string };
export type FullMockResult = { id: string; date: string; reading: number; listening: number; readingTotal: 35; listeningTotal: 30; timeUsed: number };
export type PastPaperResult = { id: string; date: string; label: string; reading: number; listening: number; note: string };

const FULL_RESULTS_KEY = 'eiken4FullMockResultsV1';
const PAST_RESULTS_KEY = 'eiken4PastPaperResultsV1';
const hash = (value: string) => [...value].reduce((sum, char) => Math.imul(sum, 31) + char.charCodeAt(0) | 0, 0) >>> 0;
const pick = <T,>(items: T[], seed: string, count: number) => items.map((item, index) => ({ item, order: hash(`${seed}-${index}`) })).sort((a, b) => a.order - b.order).slice(0, count).map(({ item }) => item);

export const listeningSection = (index: number) => index < 12 ? '第1部 会話の応答' : index < 24 ? '第2部 会話の内容' : '第3部 説明文の内容';

export const getFullMock = (seed = localDateKey()): PrepQuestion[] => {
  const basics = [
    ...pick(eiken4Words, `${seed}-word`, 15).map(word => getQuestionById(`word-${word.id}`, seed)),
    ...pick(eiken4CoreExamQuestions, `${seed}-exam`, 5).map(item => getQuestionById(`exam-${item.id}`, seed)),
    ...pick(eiken4CoreSentences, `${seed}-sentence`, 5).map(item => getQuestionById(`sentence-${item.id}`, seed)),
  ].filter((item): item is DailyQuestion => Boolean(item)).map((item, index) => ({ ...item, section: index < 15 ? 'リーディング1 語彙・文法' : index < 20 ? 'リーディング2 会話文' : 'リーディング3 語句整序' }));
  const passages = pick(eiken4Readings, `${seed}-reading`, 5).flatMap(reading => reading.questions.map((question, index) => ({
    id: `full-reading-${reading.id}-${index}`, prompt: question.question, detail: reading.title, answer: question.answer,
    choices: pick(question.choices, `${seed}-${reading.id}-${index}`, question.choices.length), explanation: question.explanation,
    kind: '長文', section: 'リーディング4 長文読解', passage: reading.passage, evidence: question.evidence,
  })));
  const selectedListening = [0, 12, 24].flatMap((from, section) => pick(eiken4ListeningQuestions.slice(from, from + 12), `${seed}-listening-${section}`, 10));
  const listening = selectedListening.map(item => {
    const sourceIndex = eiken4ListeningQuestions.findIndex(source => source.id === item.id);
    return { ...getQuestionById(`listening-${item.id}`, seed)!, section: listeningSection(sourceIndex) };
  });
  return [...basics, ...passages, ...listening];
};

const read = <T,>(key: string): T[] => { if (typeof localStorage === 'undefined') return []; try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
const save = <T,>(key: string, values: T[]) => { if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(values)); };
export const loadFullMockResults = () => read<FullMockResult>(FULL_RESULTS_KEY);
export const saveFullMockResult = (result: FullMockResult) => save(FULL_RESULTS_KEY, [...loadFullMockResults(), result].slice(-12));
export const loadPastPaperResults = () => read<PastPaperResult>(PAST_RESULTS_KEY);
export const savePastPaperResult = (result: PastPaperResult) => save(PAST_RESULTS_KEY, [...loadPastPaperResults(), result].slice(-20));
export const deletePastPaperResult = (id: string) => save(PAST_RESULTS_KEY, loadPastPaperResults().filter(item => item.id !== id));
