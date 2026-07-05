import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type Eiken4ResultData = {
  wordTotal: number;
  wordKnown: number;
  wordQuizTotal: number;
  wordQuizCorrect: number;
  wordQuizWrongWords: string[];
  sentenceTotal: number;
  sentenceCorrect: number;
  weakPoints: string[];
  startedAt?: string;
  durationMinutes?: number;
};

type Eiken4SessionContextType = {
  result: Eiken4ResultData;
  resetSession: () => void;
  completeWords: (wordTotal: number, wordKnown: number, weakPoints: string[]) => void;
  completeWordQuiz: (wordQuizTotal: number, wordQuizCorrect: number, wrongWords: string[]) => void;
  completeSentences: (sentenceTotal: number, sentenceCorrect: number, weakPoints: string[]) => void;
};

const initialResult = (): Eiken4ResultData => ({
  wordTotal: 0,
  wordKnown: 0,
  wordQuizTotal: 0,
  wordQuizCorrect: 0,
  wordQuizWrongWords: [],
  sentenceTotal: 0,
  sentenceCorrect: 0,
  weakPoints: [],
  startedAt: new Date().toISOString(),
  durationMinutes: 0,
});

const Eiken4SessionContext = createContext<Eiken4SessionContextType | undefined>(undefined);

const uniqueFirstThree = (items: string[]) => Array.from(new Set(items.filter(Boolean))).slice(0, 3);

export const Eiken4SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [result, setResult] = useState<Eiken4ResultData>(() => initialResult());

  const value = useMemo<Eiken4SessionContextType>(() => {
    const withDuration = (next: Eiken4ResultData): Eiken4ResultData => {
      const started = next.startedAt ? new Date(next.startedAt).getTime() : Date.now();
      const elapsed = Math.max(1, Math.round((Date.now() - started) / 60000));
      return { ...next, durationMinutes: elapsed };
    };

    return {
      result,
      resetSession: () => setResult(initialResult()),
      completeWords: (wordTotal, wordKnown, weakPoints) => {
        setResult(current =>
          withDuration({
            ...current,
            wordTotal,
            wordKnown,
            weakPoints: uniqueFirstThree([...weakPoints, ...current.weakPoints]),
          })
        );
      },
      completeWordQuiz: (wordQuizTotal, wordQuizCorrect, wrongWords) => {
        setResult(current =>
          withDuration({
            ...current,
            wordQuizTotal,
            wordQuizCorrect,
            wordQuizWrongWords: wrongWords,
            weakPoints: uniqueFirstThree([...current.weakPoints, ...wrongWords]),
          })
        );
      },
      completeSentences: (sentenceTotal, sentenceCorrect, weakPoints) => {
        setResult(current =>
          withDuration({
            ...current,
            sentenceTotal,
            sentenceCorrect,
            weakPoints: uniqueFirstThree([...current.weakPoints, ...weakPoints]),
          })
        );
      },
    };
  }, [result]);

  return <Eiken4SessionContext.Provider value={value}>{children}</Eiken4SessionContext.Provider>;
};

export const useEiken4Session = (): Eiken4SessionContextType => {
  const context = useContext(Eiken4SessionContext);
  if (!context) {
    throw new Error('useEiken4Session must be used within Eiken4SessionProvider');
  }
  return context;
};
