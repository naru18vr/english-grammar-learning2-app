
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Eiken4SessionProvider } from './contexts/Eiken4SessionContext';
import HomePage from './pages/HomePage';

const UnitSelectPage = lazy(() => import('./pages/UnitSelectPage'));
const BuilderPage = lazy(() => import('./pages/BuilderPage'));
const SetSelectPage = lazy(() => import('./pages/SetSelectPage'));
const ResultReportPage = lazy(() => import('./pages/ResultReportPage'));
const RandomChallengeOptionsPage = lazy(() => import('./pages/RandomChallengeOptionsPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const Eiken4HomePage = lazy(() => import('./pages/Eiken4HomePage'));
const Eiken4DailyPage = lazy(() => import('./pages/Eiken4DailyPage'));
const Eiken4WordCardsPage = lazy(() => import('./pages/Eiken4WordCardsPage'));
const Eiken4WordQuizPage = lazy(() => import('./pages/Eiken4WordQuizPage'));
const Eiken4SentencesPage = lazy(() => import('./pages/Eiken4SentencesPage'));
const Eiken4ResultPage = lazy(() => import('./pages/Eiken4ResultPage'));
const Eiken4ReadingPage = lazy(() => import('./pages/Eiken4ReadingPage'));
const Eiken4MockPage = lazy(() => import('./pages/Eiken4MockPage'));
const Eiken4ProgressPage = lazy(() => import('./pages/Eiken4ProgressPage'));
const Eiken4ExamPracticePage = lazy(() => import('./pages/Eiken4ExamPracticePage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const Eiken4WorksheetPage = lazy(() => import('./pages/Eiken4WorksheetPage'));
const Eiken4WordMapPage = lazy(() => import('./pages/Eiken4WordMapPage'));
const Grade1DailyReviewPage = lazy(() => import('./pages/Grade1DailyReviewPage'));
const Eiken4DailyCoursePage = lazy(() => import('./pages/Eiken4DailyCoursePage'));
const Eiken4GrammarGuidePage = lazy(() => import('./pages/Eiken4GrammarGuidePage'));
const GradeDataBoundary = lazy(() => import('./components/GradeDataBoundary'));

const PageLoading = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-6" role="status" aria-live="polite">
    <div className="rounded-2xl bg-white px-6 py-5 shadow text-center">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      <p className="font-bold text-slate-700">ページを読み込んでいます…</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Eiken4SessionProvider>
        <div className="min-h-screen flex flex-col">
          <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<GradeDataBoundary />}>
              <Route path="/random-challenge-options" element={<RandomChallengeOptionsPage />} />
              <Route path="/grade/:gradeId" element={<UnitSelectPage />} />
              <Route path="/grade/:gradeId/unit/:unitId/sets" element={<SetSelectPage />} />
              <Route path="/grade/:gradeId/unit/:unitId/set/:setIndex" element={<BuilderPage />} />
              <Route path="/report" element={<ResultReportPage />} />
              <Route path="/progress" element={<ProgressPage />} />
            </Route>
            <Route path="/eiken4" element={<Eiken4HomePage />} />
            <Route path="/eiken4/daily" element={<Eiken4DailyPage />} />
            <Route path="/eiken4/reading" element={<Eiken4ReadingPage />} />
            <Route path="/eiken4/mock" element={<Eiken4MockPage />} />
            <Route path="/eiken4/progress" element={<Eiken4ProgressPage />} />
            <Route path="/eiken4/exam-practice" element={<Eiken4ExamPracticePage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/eiken4/words" element={<Eiken4WordCardsPage />} />
            <Route path="/eiken4/words/quiz" element={<Eiken4WordQuizPage />} />
            <Route path="/eiken4/sentences" element={<Eiken4SentencesPage />} />
            <Route path="/eiken4/result" element={<Eiken4ResultPage />} />
            <Route path="/eiken4/worksheet" element={<Eiken4WorksheetPage />} />
            <Route path="/eiken4/word-map" element={<Eiken4WordMapPage />} />
            <Route path="/eiken4/grade1-review" element={<Grade1DailyReviewPage />} />
            <Route path="/eiken4/course" element={<Eiken4DailyCoursePage />} />
            <Route path="/eiken4/grammar-guide" element={<Eiken4GrammarGuidePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </div>
      </Eiken4SessionProvider>
    </HashRouter>
  );
};

export default App;
