
export interface Sentence {
  id: string;
  japaneseQuestion: string;
  words: string[]; // Correct words in order. Includes punctuation as separate words if needed.
  grammarTag: string;
  explanation: string;
}

export interface Unit {
  id: string;
  title: string;
  sentences: Sentence[];
}

export interface Grade {
  id: string;
  name: string;
  units: Unit[];
  iconColor?: string; 
  aiDefaultConfig?: {
    unitFocus: string;
  };
}

export interface UserProgress {
  [sentenceId: string]: {
    correct: boolean;
    attempts: number;
  };
}