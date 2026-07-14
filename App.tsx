
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Eiken4SessionProvider } from './contexts/Eiken4SessionContext';
import LoadingSpinner from './components/shared/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const UnitSelectPage = lazy(() => import('./pages/UnitSelectPage'));
const BuilderPage = lazy(() => import('./pages/BuilderPage'));
const SetSelectPage = lazy(() => import('./pages/SetSelectPage'));
const ResultReportPage = lazy(() => import('./pages/ResultReportPage'));
const RandomChallengeOptionsPage = lazy(() => import('./pages/RandomChallengeOptionsPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const Eiken4HomePage = lazy(() => import('./pages/Eiken4HomePage'));
const Eiken4WordCardsPage = lazy(() => import('./pages/Eiken4WordCardsPage'));
const Eiken4WordQuizPage = lazy(() => import('./pages/Eiken4WordQuizPage'));
const Eiken4SentencesPage = lazy(() => import('./pages/Eiken4SentencesPage'));
const Eiken4ResultPage = lazy(() => import('./pages/Eiken4ResultPage'));
const Eiken4DailyPage = lazy(() => import('./pages/Eiken4DailyPage'));
const Eiken4ReadingPage = lazy(() => import('./pages/Eiken4ReadingPage'));
const Eiken4MockPage = lazy(() => import('./pages/Eiken4MockPage'));
const Eiken4ProgressPage = lazy(() => import('./pages/Eiken4ProgressPage'));

const App: React.FC = () => {
  return (
    <HashRouter>
      <Eiken4SessionProvider>
        <div className="min-h-screen flex flex-col">
          <Suspense fallback={<div className="flex-grow flex items-center justify-center"><LoadingSpinner /></div>}><Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/random-challenge-options" element={<RandomChallengeOptionsPage />} />
            <Route path="/grade/:gradeId" element={<UnitSelectPage />} />
            <Route path="/grade/:gradeId/unit/:unitId/sets" element={<SetSelectPage />} />
            <Route path="/grade/:gradeId/unit/:unitId/set/:setIndex" element={<BuilderPage />} />
            <Route path="/report" element={<ResultReportPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/eiken4" element={<Eiken4HomePage />} />
            <Route path="/eiken4/daily" element={<Eiken4DailyPage />} />
            <Route path="/eiken4/reading" element={<Eiken4ReadingPage />} />
            <Route path="/eiken4/mock" element={<Eiken4MockPage />} />
            <Route path="/eiken4/progress" element={<Eiken4ProgressPage />} />
            <Route path="/eiken4/words" element={<Eiken4WordCardsPage />} />
            <Route path="/eiken4/words/quiz" element={<Eiken4WordQuizPage />} />
            <Route path="/eiken4/sentences" element={<Eiken4SentencesPage />} />
            <Route path="/eiken4/result" element={<Eiken4ResultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes></Suspense>
        </div>
      </Eiken4SessionProvider>
    </HashRouter>
  );
};

export default App;
