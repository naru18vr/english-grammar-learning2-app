import React from 'react';
import { Outlet } from 'react-router-dom';
import { GRADES_DATA } from '../constants';
import { AppProvider } from '../contexts/AppContext';

// 中1〜中3の教材が必要なルートだけで、全問題データを読み込む。
const GradeDataBoundary: React.FC = () => (
  <AppProvider grades={GRADES_DATA}>
    <Outlet />
  </AppProvider>
);

export default GradeDataBoundary;
