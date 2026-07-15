import type { Grade1Word } from './grade1Review';
import { grade1ReviewWords } from './grade1Review';
import { grade2VocabularyWords } from './grade2Vocabulary';

export type VocabularyGroup = { title: string; from: number; to: number };
export type GradeVocabularyConfig = { grade: number; words: Grade1Word[]; groups: VocabularyGroup[] };

export const gradeVocabularyData: Record<string, GradeVocabularyConfig> = {
  grade1: {
    grade: 1,
    words: grade1ReviewWords,
    groups: [
      { title: '基本語', from: 0, to: 12 }, { title: '学校・家族', from: 12, to: 24 }, { title: '身の回り', from: 24, to: 36 },
      { title: '動作を表す語', from: 36, to: 54 }, { title: '形容詞・助動詞', from: 54, to: 66 }, { title: '前置詞・接続詞', from: 66, to: 72 },
    ],
  },
  grade2: {
    grade: 2,
    words: grade2VocabularyWords,
    groups: [
      { title: '旅行・未来', from: 0, to: 12 }, { title: '仕事・将来', from: 12, to: 24 }, { title: '食べ物・文化', from: 24, to: 36 },
      { title: 'ホームステイ・生活', from: 36, to: 48 }, { title: 'デザイン・説明', from: 48, to: 60 }, { title: '比較・数量', from: 60, to: 72 },
      { title: '世界遺産・環境', from: 72, to: 84 }, { title: '接続詞・副詞', from: 84, to: 96 },
    ],
  },
};
