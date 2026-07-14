import { Grade } from '../types';

// トップ画面では教材本文を読み込まず、学年カードに必要な情報だけを使う。
export const GRADE_SUMMARIES: Grade[] = [
  { id: 'grade1', name: '中学1年生（NEW HORIZON 2025）', iconColor: 'bg-green-500', units: [] },
  { id: 'grade2', name: '中学2年生（NEW HORIZON 2025）', iconColor: 'bg-sky-500', units: [] },
  { id: 'grade3', name: '中学3年生（NEW HORIZON 2025）', iconColor: 'bg-indigo-500', units: [] },
];
