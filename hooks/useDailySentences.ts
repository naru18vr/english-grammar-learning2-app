
import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Grade, Unit, Sentence } from '../types';
import { SENTENCES_PER_SET } from '../constants';

interface DailySet {
  grade: Grade;
  unit: Unit;
  setIndex: number;
  sentences: Sentence[];
  gradeId: string;
}

export const useDailySentences = () => {
  const { grades } = useAppContext();
  const [dailySet, setDailySet] = useState<DailySet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!grades || grades.length === 0) {
      return;
    }

    try {
      const allSets: DailySet[] = [];
      grades.forEach(grade => {
        grade.units.forEach(unit => {
          if (unit.sentences.length > 0) {
            const numberOfSets = Math.ceil(unit.sentences.length / SENTENCES_PER_SET);
            for (let i = 0; i < numberOfSets; i++) {
              const startIndex = i * SENTENCES_PER_SET;
              const endIndex = startIndex + SENTENCES_PER_SET;
              const setSentences = unit.sentences.slice(startIndex, endIndex);
              if (setSentences.length > 0) {
                  allSets.push({
                    grade: grade,
                    unit: unit,
                    setIndex: i,
                    sentences: setSentences,
                    gradeId: grade.id,
                  });
              }
            }
          }
        });
      });

      if (allSets.length === 0) {
        setError('利用可能な問題セットがありません。');
        setIsLoading(false);
        return;
      }

      // Generate a deterministic index based on the current date
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const year = today.getFullYear();
      const seed = dayOfYear + year; // Simple seed
      const dailyIndex = seed % allSets.length;
      
      setDailySet(allSets[dailyIndex]);

    } catch (e: any) {
      setError('今日のチャレンジの読み込み中にエラーが発生しました。');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [grades]);

  return { dailySet, isLoading, error };
};
