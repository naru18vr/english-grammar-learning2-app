import { eiken4ExamQuestions } from './eiken4ExamQuestions';
import { eiken4Sentences } from './eiken4Sentences';

// 英検4級（中学中級程度）の毎日学習では、中3で扱う文法を新規出題しない。
const advancedGrammarTags = ['現在完了', '受け身', '関係代名詞'];
const advancedExamIds = new Set(['x005', 'x010', 'x011', 'x014', 'x029', 'x030']);

export const eiken4CoreSentences = eiken4Sentences.filter(
  sentence => !advancedGrammarTags.some(tag => sentence.grammarTag.startsWith(tag)),
);

export const eiken4CoreExamQuestions = eiken4ExamQuestions.filter(
  question => !advancedExamIds.has(question.id),
);
