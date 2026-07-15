import type { Grade1Word } from './grade1Review';
import { grade1ReviewWords } from './grade1Review';
import { grade2VocabularyWords } from './grade2Vocabulary';
import { grade3VocabularyWords } from './grade3Vocabulary';

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
  grade3: {
    grade: 3,
    words: grade3VocabularyWords,
    groups: [
      { title: '日本文化・表現', from: 0, to: 12 }, { title: '衣服・選択', from: 12, to: 24 }, { title: '現在完了で使う語', from: 24, to: 36 },
      { title: '動物・環境保護', from: 36, to: 48 }, { title: '災害・支援', from: 48, to: 60 }, { title: 'リーダー・協力', from: 60, to: 72 },
      { title: 'グローバル市民', from: 72, to: 84 }, { title: '経験・考えを伝える語', from: 84, to: 96 }, { title: '副詞・国際社会', from: 96, to: 108 },
    ],
  },
};
