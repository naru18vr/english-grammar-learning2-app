
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Eiken4SessionProvider } from './contexts/Eiken4SessionContext';
import HomePage from './pages/HomePage';
import UnitSelectPage from './pages/UnitSelectPage';
import BuilderPage from './pages/BuilderPage';
import SetSelectPage from './pages/SetSelectPage';
import ResultReportPage from './pages/ResultReportPage';
import RandomChallengeOptionsPage from './pages/RandomChallengeOptionsPage';
import ProgressPage from './pages/ProgressPage';
import Eiken4HomePage from './pages/Eiken4HomePage';
import Eiken4DailyPage from './pages/Eiken4DailyPage';
import Eiken4WordCardsPage from './pages/Eiken4WordCardsPage';
import Eiken4WordQuizPage from './pages/Eiken4WordQuizPage';
import Eiken4SentencesPage from './pages/Eiken4SentencesPage';
import Eiken4ResultPage from './pages/Eiken4ResultPage';
import Eiken4ReadingPage from './pages/Eiken4ReadingPage';
import Eiken4MockPage from './pages/Eiken4MockPage';
import Eiken4ProgressPage from './pages/Eiken4ProgressPage';
import Eiken4ExamPracticePage from './pages/Eiken4ExamPracticePage';
import GuidePage from './pages/GuidePage';
import Eiken4WorksheetPage from './pages/Eiken4WorksheetPage';
import Eiken4WordMapPage from './pages/Eiken4WordMapPage';
import Grade1DailyReviewPage from './pages/Grade1DailyReviewPage';
import Eiken4DailyCoursePage from './pages/Eiken4DailyCoursePage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Eiken4SessionProvider>
        <div className="min-h-screen flex flex-col">
          <Routes>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Eiken4SessionProvider>
    </HashRouter>
  );
};

export default App;
