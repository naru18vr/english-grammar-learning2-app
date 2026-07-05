export type Eiken4Word = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  category: string;
  priority: 'A' | 'B' | 'C';
};

export const eiken4Words: Eiken4Word[] = [
  { id: 'w001', word: 'borrow', meaning: '借りる', example: 'Can I borrow your pen?', category: '基本動詞', priority: 'A' },
  { id: 'w002', word: 'share', meaning: '分け合う、共有する', example: 'Let us share this cake.', category: '基本動詞', priority: 'A' },
  { id: 'w003', word: 'use', meaning: '使う', example: 'You can use my pencil.', category: '基本動詞', priority: 'A' },
  { id: 'w004', word: 'cut', meaning: '切る', example: 'Please cut the paper.', category: '基本動詞', priority: 'A' },
  { id: 'w005', word: 'understand', meaning: '理解する', example: 'I understand your idea.', category: '基本動詞', priority: 'A' },
  { id: 'w006', word: 'finish', meaning: '終える', example: 'I will finish my homework.', category: '基本動詞', priority: 'A' },
  { id: 'w007', word: 'come', meaning: '来る', example: 'Please come to my house.', category: '不規則動詞', priority: 'A' },
  { id: 'w008', word: 'came', meaning: '来た', example: 'He came home yesterday.', category: '不規則動詞', priority: 'A' },
  { id: 'w009', word: 'go', meaning: '行く', example: 'I go to school by bus.', category: '不規則動詞', priority: 'A' },
  { id: 'w010', word: 'went', meaning: '行った', example: 'We went to the park.', category: '不規則動詞', priority: 'A' },
  { id: 'w011', word: 'swim', meaning: '泳ぐ', example: 'I can swim fast.', category: '不規則動詞', priority: 'A' },
  { id: 'w012', word: 'swam', meaning: '泳いだ', example: 'She swam in the pool.', category: '不規則動詞', priority: 'A' },
  { id: 'w013', word: 'ticket', meaning: '切符、チケット', example: 'I bought a train ticket.', category: '名詞', priority: 'A' },
  { id: 'w014', word: 'contest', meaning: 'コンテスト', example: 'He joined a speech contest.', category: '名詞', priority: 'B' },
  { id: 'w015', word: 'subject', meaning: '教科', example: 'English is my favorite subject.', category: '名詞', priority: 'A' },
  { id: 'w016', word: 'trouble', meaning: '困りごと', example: 'I had trouble with math.', category: '名詞', priority: 'B' },
  { id: 'w017', word: 'moment', meaning: '少しの間', example: 'Please wait a moment.', category: '名詞', priority: 'B' },
  { id: 'w018', word: 'kind', meaning: '種類', example: 'What kind of music do you like?', category: '名詞', priority: 'A' },
  { id: 'w019', word: 'problem', meaning: '問題', example: 'This problem is easy.', category: '名詞', priority: 'A' },
  { id: 'w020', word: 'history', meaning: '歴史', example: 'I like history very much.', category: '名詞', priority: 'A' },
  { id: 'w021', word: 'museum', meaning: '博物館', example: 'We visited a museum.', category: '名詞', priority: 'A' },
  { id: 'w022', word: 'speech', meaning: 'スピーチ', example: 'Her speech was clear.', category: '名詞', priority: 'B' },
  { id: 'w023', word: 'performance', meaning: '演奏、発表', example: 'The performance was great.', category: '名詞', priority: 'B' },
  { id: 'w024', word: 'holiday', meaning: '休日', example: 'Sunday is a holiday.', category: '名詞', priority: 'A' },
  { id: 'w025', word: 'news', meaning: 'ニュース', example: 'The news made me happy.', category: '名詞', priority: 'A' },
  { id: 'w026', word: 'doctor', meaning: '医者', example: 'My sister is a doctor.', category: '名詞', priority: 'A' },
  { id: 'w027', word: 'bridge', meaning: '橋', example: 'This bridge is old.', category: '名詞', priority: 'B' },
  { id: 'w028', word: 'soap', meaning: '石けん', example: 'Wash your hands with soap.', category: '名詞', priority: 'B' },
];
