
import { useReducer, useCallback, useEffect } from 'react';
import { Sentence } from '../types';
import { incrementSentenceMistakeCount } from '../localStorageService';

// Utility to shuffle array
export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface SentenceState {
  currentSentenceIndex: number;
  currentSentence: Sentence | null;
  builtWords: string[]; // Words in the construction area
  wordBank: Array<{ word: string; originalIndex: number; id: string }>; // Words in the bank, with original index for stable keys
  isCorrect: boolean | null;
  showResultModal: boolean;
  isLoading: boolean;
  error: string | null;
  allSentences: Sentence[];
}

type SentenceAction =
  | { type: 'LOAD_SENTENCES'; payload: Sentence[] }
  | { type: 'START_SENTENCE'; payload: { sentence: Sentence; index: number } }
  | { type: 'ADD_WORD_TO_BUILT'; payload: { word: string; bankIndex: number } }
  | { type: 'REMOVE_WORD_FROM_BUILT'; payload: { word: string; builtIndex: number } }
  | { type: 'CHECK_ANSWER' }
  | { type: 'NEXT_SENTENCE' }
  | { type: 'RETRY_SENTENCE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: SentenceState = {
  currentSentenceIndex: 0,
  currentSentence: null,
  builtWords: [],
  wordBank: [],
  isCorrect: null,
  showResultModal: false,
  isLoading: true,
  error: null,
  allSentences: [],
};

const sentenceReducer = (state: SentenceState, action: SentenceAction): SentenceState => {
  switch (action.type) {
    case 'LOAD_SENTENCES':
      return { ...initialState, allSentences: action.payload, isLoading: false };
    case 'START_SENTENCE': {
      const { sentence, index } = action.payload;
      const shuffledWords = shuffleArray([...sentence.words]);
      return {
        ...state,
        currentSentence: sentence,
        currentSentenceIndex: index,
        builtWords: [],
        wordBank: shuffledWords.map((word, i) => ({ word, originalIndex: sentence.words.indexOf(word), id: `${word}-${i}` })), // Use unique ID for keys
        isCorrect: null,
        showResultModal: false,
        isLoading: false,
      };
    }
    case 'ADD_WORD_TO_BUILT': {
      const { word, bankIndex } = action.payload;
      const newWordBank = [...state.wordBank];
      newWordBank.splice(bankIndex, 1); // Remove from bank
      return {
        ...state,
        builtWords: [...state.builtWords, word],
        wordBank: newWordBank,
      };
    }
    case 'REMOVE_WORD_FROM_BUILT': {
      const { word, builtIndex } = action.payload;
      const newBuiltWords = [...state.builtWords];
      newBuiltWords.splice(builtIndex, 1); // Remove from built
      if (!state.currentSentence) return state;

      const newWordBankEntry = { 
        word: word, 
        originalIndex: state.currentSentence.words.indexOf(word), 
        id: `${word}-${Date.now()}` 
      };
      
      const updatedWordBank = [...state.wordBank, newWordBankEntry];

      return {
        ...state,
        builtWords: newBuiltWords,
        wordBank: shuffleArray(updatedWordBank), // Re-shuffle bank using the consistent utility
      };
    }
    case 'CHECK_ANSWER': {
      if (!state.currentSentence) return state;
      const userAnswer = state.builtWords.join(' ');
      const correctAnswer = state.currentSentence.words.join(' ');
      const isCorrect = userAnswer === correctAnswer;
      
      return {
        ...state,
        isCorrect: isCorrect,
        showResultModal: true,
      };
    }
    case 'NEXT_SENTENCE': {
      const nextIndex = state.currentSentenceIndex + 1;
      if (nextIndex < state.allSentences.length) {
        const nextSentence = state.allSentences[nextIndex];
        const shuffledWords = shuffleArray([...nextSentence.words]);
        return {
          ...state,
          currentSentenceIndex: nextIndex,
          currentSentence: nextSentence,
          builtWords: [],
          wordBank: shuffledWords.map((word, i) => ({ word, originalIndex: nextSentence.words.indexOf(word), id: `${word}-${i}` })),
          isCorrect: null,
          showResultModal: false,
        };
      }
      // All sentences completed
      return { ...state, showResultModal: true }; // Or navigate, show summary, etc.
    }
    case 'RETRY_SENTENCE': {
      if (!state.currentSentence) return state;
      const shuffledWords = shuffleArray([...state.currentSentence.words]);
       return {
        ...state,
        builtWords: [],
        wordBank: shuffledWords.map((word, i) => ({ word, originalIndex: state.currentSentence!.words.indexOf(word), id: `${word}-${i}` })),
        isCorrect: null,
        showResultModal: false,
      };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

export const useSentenceLogic = (sentences: Sentence[] | undefined, gradeId?: string, unitId?: string) => {
  const [state, dispatch] = useReducer(sentenceReducer, initialState);

  useEffect(() => {
    if (sentences && sentences.length > 0) {
      dispatch({ type: 'LOAD_SENTENCES', payload: sentences });
      dispatch({ type: 'START_SENTENCE', payload: { sentence: sentences[0], index: 0 } });
    } else if (sentences) { // sentences is defined but empty
        dispatch({ type: 'LOAD_SENTENCES', payload: [] }); // Clear any old sentences
        dispatch({ type: 'SET_ERROR', payload: 'No sentences available for this unit.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentences]); // Re-run if sentences prop changes

  const addWordToBuilt = useCallback((word: string, bankIndex: number) => {
    dispatch({ type: 'ADD_WORD_TO_BUILT', payload: { word, bankIndex } });
  }, []);

  const removeWordFromBuilt = useCallback((word: string, builtIndex: number) => {
    dispatch({ type: 'REMOVE_WORD_FROM_BUILT', payload: { word, builtIndex } });
  }, []);

  const checkAnswer = useCallback(() => {
    dispatch({ type: 'CHECK_ANSWER' });
    
    // Check if answer is incorrect and increment mistake count
    if (gradeId && unitId && state.currentSentence) {
      const userAnswer = state.builtWords.join(' ');
      const correctAnswer = state.currentSentence.words.join(' ');
      if (userAnswer !== correctAnswer) {
        incrementSentenceMistakeCount(gradeId, unitId, state.currentSentence.id);
      }
    }
  }, [gradeId, unitId, state.builtWords, state.currentSentence]);

  const nextSentence = useCallback(() => {
    dispatch({ type: 'NEXT_SENTENCE' });
  }, []);
  
  const retrySentence = useCallback(() => {
    dispatch({ type: 'RETRY_SENTENCE' });
  }, []);

  return { state, addWordToBuilt, removeWordFromBuilt, checkAnswer, nextSentence, retrySentence };
};
