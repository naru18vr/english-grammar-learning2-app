
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UnitSelectPage from './pages/UnitSelectPage';
import BuilderPage from './pages/BuilderPage';
import SetSelectPage from './pages/SetSelectPage';
import ResultReportPage from './pages/ResultReportPage';
import RandomChallengeOptionsPage from './pages/RandomChallengeOptionsPage';
import ProgressPage from './pages/ProgressPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/random-challenge-options" element={<RandomChallengeOptionsPage />} />
          <Route path="/grade/:gradeId" element={<UnitSelectPage />} />
          <Route path="/grade/:gradeId/unit/:unitId/sets" element={<SetSelectPage />} />
          <Route path="/grade/:gradeId/unit/:unitId/set/:setIndex" element={<BuilderPage />} />
          <Route path="/report" element={<ResultReportPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;