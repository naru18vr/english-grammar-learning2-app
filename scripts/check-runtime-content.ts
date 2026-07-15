import { GRADE_1_UNITS } from '../data/grade1';
import { GRADE_2_UNITS } from '../data/grade2';
import { GRADE_3_UNITS } from '../data/grade3';
import { eiken4CoreExamQuestions, eiken4CoreSentences } from '../data/eiken4Curriculum';
import { eiken4Words } from '../data/eiken4Words';
import { gradeVocabularyData } from '../data/gradeVocabularyData';

const errors: string[] = [];
const grades = [GRADE_1_UNITS, GRADE_2_UNITS, GRADE_3_UNITS];
const allowedGrammar: Record<string, RegExp> = {
  g1u1: /be動詞|一般動詞|I (am|play|like|eat|study|drink)|You are|Are you|Do you|We are/,
  g1u2: /This|That|He|She|Is (this|that|he|she)|can|Can you/,
  g1u3: /What|Who|How|Where|When/,
  g1u4: /How many|命令文|What \+ 名詞/,
  g1u5: /三人称単数/,
  g1u6: /目的格|Whose|Which|him|her/,
  g1u7: /現在進行形/,
  g1u8: /want|look \+ 形容詞|You look ~\. の文|look ~\. の文/,
  g1u9: /過去形/,
  g1u10: /be動詞の過去形|過去進行形|There|there/,
  g2u0: /過去進行形|There/,
  g2u1: /going to|will|Will you|A B/,
  g2u2: /when|if|because|Because|that/,
  g2u3: /to \+ 動詞|不定詞|important to|want to|hope to|would like to|It is .* to/,
  g2u4: /have to|has to|had to|must|Must|動名詞/,
  g2u5: /疑問詞|how to|what to|where to|when to|which|who to|sure/,
  g2u6: /比較級|最上級|不規則変化|as |one of|like/,
  g2u7: /受け身|過去分詞|be open|be known/,
  g3u0: /going to|will|Will|A B|when|if|that|because|to \+ 動詞|important to|want to|have to|must|Must|動名詞|how to|what to|sure|比較級|最上級|不規則変化|as |受け身|過去分詞/,
  g3u1: /現在完了形「経験」|tell \+ 人 \+ that|make A B|keep A B/,
  g3u2: /現在完了/,
  g3u3: /It is .*for \(人\)|want \+ 人 \+ to|原形不定詞|let・help|help \+ 人/,
  g3u4: /間接疑問文|分詞|修飾/,
  g3u5: /関係代名詞|接触節/,
  g3u6: /仮定法/,
};

for (const [gradeIndex, units] of grades.entries()) {
  const grade = gradeIndex + 1;
  for (const unit of units) {
    if (unit.sentences.length !== 50) errors.push(`中${grade} ${unit.id}: ${unit.sentences.length}問（50問必要）`);
    const ids = new Set<string>();
    const contents = new Set<string>();
    for (const item of unit.sentences) {
      if (ids.has(item.id)) errors.push(`中${grade} ${unit.id}: ID重複 ${item.id}`);
      ids.add(item.id);
      const content = `${item.japaneseQuestion}|${item.words.join(' ')}`;
      if (contents.has(content)) errors.push(`中${grade} ${unit.id}: 問題重複 ${item.id}`);
      contents.add(content);
      if (!item.words.length || !['.', '?', '!'].includes(item.words.at(-1) ?? '')) errors.push(`中${grade} ${unit.id}: 文末記号なし ${item.id}`);
      if (/忙しいる|ににしました|have day|watch a book/.test(content)) errors.push(`中${grade} ${unit.id}: 不自然な既知表現 ${item.id}`);
      const allowed = allowedGrammar[`g${grade}${unit.id}`];
      if (!allowed?.test(item.grammarTag)) errors.push(`中${grade} ${unit.id}: UNIT範囲外の文法「${item.grammarTag}」 ${item.id}`);
    }
  }
}

const grade2Unit3 = GRADE_2_UNITS.find(unit => unit.id === 'u3')?.sentences ?? [];
for (const item of grade2Unit3) {
  if (/for \(人\)|of \(人\)/.test(item.grammarTag)) errors.push(`中2 u3: 中3文法が混入 ${item.id}`);
}

const advanced = /現在完了|受け身|関係代名詞|仮定法/;
for (const item of eiken4CoreSentences) {
  if (advanced.test(item.grammarTag)) errors.push(`英検4級並べ替え: 範囲外文法 ${item.id}`);
}
for (const item of eiken4CoreExamQuestions) {
  if (advanced.test(item.explanation)) errors.push(`英検4級演習: 範囲外文法 ${item.id}`);
}
if (eiken4Words.length < 120) errors.push(`英検4級単語: ${eiken4Words.length}語では不足`);
if (new Set(eiken4Words.map(item => item.id)).size !== eiken4Words.length) errors.push('英検4級単語: ID重複');
if (new Set(eiken4Words.map(item => item.word.toLowerCase())).size !== eiken4Words.length) errors.push('英検4級単語: 見出し語重複');

for (const [gradeId, config] of Object.entries(gradeVocabularyData)) {
  const expected = config.grade === 1 ? 72 : 96;
  if (config.words.length !== expected) errors.push(`${gradeId}英単語: ${config.words.length}語（${expected}語必要）`);
  if (new Set(config.words.map(item => item.word.toLowerCase())).size !== config.words.length) errors.push(`${gradeId}英単語: 見出し語重複`);
  if (config.words.some(item => !item.word || !item.meaning || !item.example)) errors.push(`${gradeId}英単語: 必須項目不足`);
  const covered = config.groups.flatMap(group => Array.from({ length: group.to - group.from }, (_, index) => group.from + index));
  if (covered.length !== config.words.length || new Set(covered).size !== config.words.length || Math.max(...covered) !== config.words.length - 1) {
    errors.push(`${gradeId}英単語: マップ分類の漏れ・重複`);
  }
}

if (errors.length) {
  console.error(errors.slice(0, 50).join('\n'));
  process.exit(1);
}

console.log(`実行時教材チェックOK: ${grades.flat().length} Units / ${grades.flat().reduce((sum, unit) => sum + unit.sentences.length, 0)}問 / 英検4級 ${eiken4CoreSentences.length}並べ替え・${eiken4Words.length}語 / 学年単語 ${Object.values(gradeVocabularyData).reduce((sum, config) => sum + config.words.length, 0)}語`);
