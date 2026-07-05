import { Sentence } from '../types';

export const eiken4Sentences: Sentence[] = [
  {
    id: 'e4s001',
    japaneseQuestion: '私は7時に起きます。',
    words: ['I', 'get', 'up', 'at', 'seven', '.'],
    grammarTag: 'get up',
    explanation: 'get up で「起きる」という意味です。',
  },
  {
    id: 'e4s002',
    japaneseQuestion: '私は宿題を終えました。',
    words: ['I', 'finished', 'my', 'homework', '.'],
    grammarTag: '過去形',
    explanation: 'finished は finish の過去形です。',
  },
  {
    id: 'e4s003',
    japaneseQuestion: '彼は昨日家に帰ってきました。',
    words: ['He', 'came', 'home', 'yesterday', '.'],
    grammarTag: '不規則動詞',
    explanation: 'came は come の過去形です。',
  },
  {
    id: 'e4s004',
    japaneseQuestion: 'あなたのペンを借りてもいいですか。',
    words: ['Can', 'I', 'borrow', 'your', 'pen', '?'],
    grammarTag: 'Can I ...?',
    explanation: 'Can I ...? で「〜してもいいですか」とたずねます。',
  },
  {
    id: 'e4s005',
    japaneseQuestion: '私はサッカーをするのが好きです。',
    words: ['I', 'like', 'playing', 'soccer', '.'],
    grammarTag: '動名詞',
    explanation: 'like の後ろに -ing を置いて「〜することが好き」と表します。',
  },
  {
    id: 'e4s006',
    japaneseQuestion: '私はテレビを見るのが好きではありません。',
    words: ["I", "don't", 'like', 'watching', 'TV', '.'],
    grammarTag: '動名詞の否定',
    explanation: "don't like -ing で「〜することが好きではない」です。",
  },
  {
    id: 'e4s007',
    japaneseQuestion: '私は部屋を掃除しなければなりません。',
    words: ['I', 'have', 'to', 'clean', 'my', 'room', '.'],
    grammarTag: 'have to',
    explanation: 'have to は「〜しなければならない」という意味です。',
  },
  {
    id: 'e4s008',
    japaneseQuestion: 'りんごはバナナより安いです。',
    words: ['Apples', 'are', 'cheaper', 'than', 'bananas', '.'],
    grammarTag: '比較級',
    explanation: 'cheaper than ... で「〜より安い」です。',
  },
  {
    id: 'e4s009',
    japaneseQuestion: 'このゾウが一番年をとっています。',
    words: ['This', 'elephant', 'is', 'the', 'oldest', '.'],
    grammarTag: '最上級',
    explanation: 'the oldest で「一番年をとっている」です。',
  },
  {
    id: 'e4s010',
    japaneseQuestion: '公園がたくさんあります。',
    words: ['There', 'are', 'lots', 'of', 'parks', '.'],
    grammarTag: 'There are',
    explanation: 'There are ... で「〜があります」と表します。',
  },
];
