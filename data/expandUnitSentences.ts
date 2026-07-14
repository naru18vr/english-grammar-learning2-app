import { Sentence } from '../types';

// 同じ文法を、既習の基本語だけで言い換える。単純な複製ではなく、英文と和文を対で変更する。
const substitutions = [
  { en: 'book', next: 'letter', ja: '本', jaNext: '手紙' }, { en: 'letter', next: 'book', ja: '手紙', jaNext: '本' },
  { en: 'movie', next: 'book', ja: '映画', jaNext: '本' }, { en: 'park', next: 'library', ja: '公園', jaNext: '図書館' },
  { en: 'school', next: 'library', ja: '学校', jaNext: '図書館' }, { en: 'Japan', next: 'Canada', ja: '日本', jaNext: 'カナダ' },
  { en: 'English', next: 'Japanese', ja: '英語', jaNext: '日本語' }, { en: 'soccer', next: 'tennis', ja: 'サッカー', jaNext: 'テニス' },
  { en: 'mother', next: 'father', ja: '母', jaNext: '父' }, { en: 'father', next: 'mother', ja: '父', jaNext: '母' },
  { en: 'brother', next: 'sister', ja: '兄', jaNext: '姉' }, { en: 'sister', next: 'brother', ja: '姉', jaNext: '兄' },
  { en: 'dog', next: 'cat', ja: '犬', jaNext: '猫' }, { en: 'cat', next: 'dog', ja: '猫', jaNext: '犬' },
  { en: 'picture', next: 'photo', ja: '写真', jaNext: '写真' }, { en: 'train', next: 'bus', ja: '電車', jaNext: 'バス' },
  { en: 'teacher', next: 'student', ja: '先生', jaNext: '生徒' }, { en: 'room', next: 'classroom', ja: '部屋', jaNext: '教室' },
  { en: 'morning', next: 'afternoon', ja: '朝', jaNext: '午後' }, { en: 'one', next: 'two', ja: '1', jaNext: '2' },
  { en: 'he', next: 'she', ja: '彼', jaNext: '彼女' }, { en: 'she', next: 'he', ja: '彼女', jaNext: '彼' },
  { en: 'He', next: 'She', ja: '彼', jaNext: '彼女' }, { en: 'She', next: 'He', ja: '彼女', jaNext: '彼' },
  { en: 'busy', next: 'tired', ja: '忙し', jaNext: '疲れて' }, { en: 'tired', next: 'busy', ja: '疲れて', jaNext: '忙し' },
  { en: 'good', next: 'great', ja: '良い', jaNext: 'すばらしい' }, { en: 'happy', next: 'sad', ja: 'うれし', jaNext: '悲し' },
  { en: 'computer', next: 'phone', ja: 'コンピューター', jaNext: '電話' }, { en: 'car', next: 'bike', ja: '車', jaNext: '自転車' },
  { en: 'homework', next: 'work', ja: '宿題', jaNext: '仕事' }, { en: 'game', next: 'test', ja: '試合', jaNext: 'テスト' },
  { en: 'song', next: 'story', ja: '歌', jaNext: '物語' }, { en: 'window', next: 'door', ja: '窓', jaNext: 'ドア' },
  { en: 'today', next: 'tonight', ja: '今日', jaNext: '今夜' }, { en: 'Kyoto', next: 'Tokyo', ja: '京都', jaNext: '東京' },
  { en: 'friend', next: 'teacher', ja: '友達', jaNext: '先生' }, { en: 'student', next: 'teacher', ja: '生徒', jaNext: '先生' },
  { en: 'food', next: 'music', ja: '食べ物', jaNext: '音楽' }, { en: 'place', next: 'town', ja: '場所', jaNext: '町' },
  { en: 'country', next: 'city', ja: '国', jaNext: '都市' }, { en: 'story', next: 'song', ja: '話', jaNext: '歌' },
  { en: 'three', next: 'four', ja: '3', jaNext: '4' }, { en: 'two', next: 'three', ja: '2', jaNext: '3' },
  { en: 'year', next: 'month', ja: '年', jaNext: 'か月' }, { en: 'years', next: 'months', ja: '年間', jaNext: 'か月間' },
  { en: 'time', next: 'day', ja: '時間', jaNext: '日' }, { en: 'time', next: 'chance', ja: '機会', jaNext: 'チャンス' },
  { en: 'team', next: 'class', ja: 'チーム', jaNext: 'クラス' }, { en: 'music', next: 'art', ja: '音楽', jaNext: '美術' },
  { en: 'Hawaii', next: 'Canada', ja: 'ハワイ', jaNext: 'カナダ' }, { en: 'UFO', next: 'rainbow', ja: 'UFO', jaNext: '虹' },
  { en: 'horse', next: 'bike', ja: '馬', jaNext: '自転車' }, { en: 'mountain', next: 'river', ja: '山', jaNext: '川' },
  { en: 'famous', next: 'strong', ja: '有名', jaNext: '強く' }, { en: 'strong', next: 'happy', ja: '強く', jaNext: '幸せに' },
  { en: 'difficult', next: 'easy', ja: '難しい', jaNext: '簡単' }, { en: 'news', next: 'experience', ja: 'ニュース', jaNext: '経験' },
  { en: 'experience', next: 'news', ja: '経験', jaNext: 'ニュース' }, { en: 'test', next: 'game', ja: 'テスト', jaNext: '試合' },
  { en: 'dinner', next: 'lunch', ja: '夕食', jaNext: '昼食' }, { en: 'breakfast', next: 'lunch', ja: '朝食', jaNext: '昼食' },
  { en: 'Ken', next: 'Tom', ja: 'ケン', jaNext: 'トム' }, { en: 'Tom', next: 'Ken', ja: 'トム', jaNext: 'ケン' },
  { en: 'truth', next: 'answer', ja: '本当のこと', jaNext: '答え' }, { en: 'key', next: 'bag', ja: '鍵', jaNext: 'かばん' },
  { en: 'job', next: 'club', ja: '仕事', jaNext: 'クラブ' }, { en: 'family', next: 'school', ja: '家族', jaNext: '学校' },
  { en: 'piano', next: 'guitar', ja: 'ピアノ', jaNext: 'ギター' }, { en: 'guitar', next: 'piano', ja: 'ギター', jaNext: 'ピアノ' },
  { en: 'basketball', next: 'baseball', ja: 'バスケットボール', jaNext: '野球' }, { en: 'baseball', next: 'soccer', ja: '野球', jaNext: 'サッカー' },
  { en: 'parents', next: 'teachers', ja: '両親', jaNext: '先生たち' }, { en: 'children', next: 'students', ja: '子供たち', jaNext: '生徒たち' },
  { en: 'clean', next: 'open', ja: '掃除', jaNext: '開け' }, { en: 'carry', next: 'use', ja: '運ぶ', jaNext: '使う' },
  { en: 'question', next: 'problem', ja: '質問', jaNext: '問題' }, { en: 'problem', next: 'question', ja: '問題', jaNext: '質問' },
  { en: 'important', next: 'easy', ja: '重要', jaNext: '簡単' }, { en: 'quiet', next: 'kind', ja: '静か', jaNext: '親切' },
];

export const expandUnitToFifty = (sentences: Sentence[], prefix: string): Sentence[] => {
  const result = sentences.slice(0, 50).map(sentence => ({ ...sentence, words: [...sentence.words] }));
  const used = new Set(result.map(sentence => `${sentence.japaneseQuestion}|${sentence.words.join(' ')}`));
  let turn = 0;
  while (result.length < 50 && turn < 5000) {
    const source = result[turn % result.length];
    const start = Math.floor(turn / Math.max(1, result.length)) % substitutions.length;
    let added = false;
    for (let offset = 0; offset < substitutions.length && !added; offset += 1) {
      const change = substitutions[(start + offset) % substitutions.length];
      const wordIndex = source.words.findIndex(word => word === change.en);
      if (wordIndex < 0 || !source.japaneseQuestion.includes(change.ja)) continue;
      const words = [...source.words]; words[wordIndex] = change.next;
      const japaneseQuestion = source.japaneseQuestion.replace(change.ja, change.jaNext);
      const key = `${japaneseQuestion}|${words.join(' ')}`;
      if (used.has(key)) continue;
      result.push({ ...source, id: `${prefix}s${result.length + 1}`, words, japaneseQuestion });
      used.add(key); added = true;
    }
    turn += 1;
  }
  const modifiers = [
    { words: ['today'], ja: '今日、' }, { words: ['at', 'school'], ja: '学校で、' },
    { words: ['after', 'school'], ja: '放課後、' }, { words: ['every', 'day'], ja: '毎日、' },
  ];
  let modifierTurn = 0;
  while (result.length < 50 && modifierTurn < sentences.length * modifiers.length) {
    const source = sentences[modifierTurn % sentences.length];
    const modifier = modifiers[Math.floor(modifierTurn / sentences.length) % modifiers.length];
    const words = [...source.words];
    const punctuationIndex = words.findIndex(word => ['.', '?', '!'].includes(word));
    words.splice(punctuationIndex < 0 ? words.length : punctuationIndex, 0, ...modifier.words);
    const japaneseQuestion = `${modifier.ja}${source.japaneseQuestion}`;
    const key = `${japaneseQuestion}|${words.join(' ')}`;
    if (!used.has(key)) {
      result.push({ ...source, id: `${prefix}s${result.length + 1}`, words, japaneseQuestion });
      used.add(key);
    }
    modifierTurn += 1;
  }
  if (result.length !== 50) throw new Error(`${prefix}: 50問を作成できませんでした（${result.length}問）`);
  return result;
};
