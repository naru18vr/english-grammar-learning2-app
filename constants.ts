import { Grade } from './types';
import { GRADE_1_UNITS } from './data/grade1';
import { GRADE_2_UNITS } from './data/grade2';
import { GRADE_3_UNITS } from './data/grade3';


export const SENTENCES_PER_SET = 10;

export const GRADES_DATA: Grade[] = [
  {
    id: 'grade1',
    name: '中学1年生',
    iconColor: 'bg-green-500',
    units: GRADE_1_UNITS,
    aiDefaultConfig: {
      unitFocus: "基本的な文法（be動詞、一般動詞、疑問文、否定文など）",
    },
  },
  {
    id: 'grade2',
    name: '中学2年生',
    iconColor: 'bg-sky-500',
    units: GRADE_2_UNITS,
    aiDefaultConfig: {
      unitFocus: "未来形、不定詞、動名詞、接続詞など",
    },
  },
  {
    id: 'grade3',
    name: '中学3年生',
    iconColor: 'bg-indigo-500',
    units: GRADE_3_UNITS,
    aiDefaultConfig: {
      unitFocus: "受動態、現在完了形、関係代名詞など",
    },
  },
];
