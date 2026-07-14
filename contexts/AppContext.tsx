
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Grade, Unit, Sentence } from '../types';
import { GRADE_SUMMARIES } from '../data/gradeSummaries';

interface AppContextType {
  grades: Grade[];
  getGradeById: (gradeId: string) => Grade | undefined;
  getUnitById: (gradeId: string, unitId: string) => Unit | undefined;
  getSentencesForUnit: (gradeId: string, unitId: string) => Sentence[] | undefined;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode; grades?: Grade[] }> = ({ children, grades: suppliedGrades = GRADE_SUMMARIES }) => {
  const grades = suppliedGrades;
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    if (typeof localStorage === 'undefined') return true;
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('soundEnabled', JSON.stringify(isSoundEnabled));
    }
  }, [isSoundEnabled]);

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };


  const getGradeById = (gradeId: string): Grade | undefined => {
    return grades.find(g => g.id === gradeId);
  };

  const getUnitById = (gradeId: string, unitId: string): Unit | undefined => {
    const grade = getGradeById(gradeId);
    return grade?.units.find(u => u.id === unitId);
  };

  const getSentencesForUnit = (gradeId: string, unitId: string): Sentence[] | undefined => {
    const unit = getUnitById(gradeId, unitId);
    return unit?.sentences;
  };

  return (
    <AppContext.Provider value={{ grades, getGradeById, getUnitById, getSentencesForUnit, isSoundEnabled, toggleSound }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
