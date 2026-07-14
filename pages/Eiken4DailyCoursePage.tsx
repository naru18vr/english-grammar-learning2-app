import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import { loadGrade1Review, resetTodayGrade1Review } from '../services/grade1ReviewService';
import { loadDailyProgress, resetTodayDailyProgress } from '../services/eiken4DailyService';
import { loadReadingProgress, resetTodayReadingProgress } from '../services/eiken4ReadingService';
import { isWordQuizDoneToday, resetTodayWordCourse } from '../services/eiken4WordMasteryService';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';

const Eiken4DailyCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useEiken4Session();
  const [confirmReset, setConfirmReset] = useState(false);
  const [, setResetVersion] = useState(0);
  const grade1Done = Boolean(loadGrade1Review().completedAt);
  const dailyDone = Boolean(loadDailyProgress().completedAt);
  const readingDone = Boolean(loadReadingProgress().completedAt);
  const cardsDone = isWordQuizDoneToday();
  const steps = [
    { title: '中1のおさらい', detail: '英検4級頻出の単語5語＋文法5問・約8分', path: '/eiken4/grade1-review', done: grade1Done },
    { title: '今日の15分', detail: '単語・文法・リスニング・本番形式18問', path: '/eiken4/daily', done: dailyDone },
    { title: 'ミニ長文', detail: '英文1題＋設問2問', path: '/eiken4/reading', done: readingDone },
    { title: '英単語＋確認テスト', detail: 'カード8語を見て、同じ8語をテスト', path: '/eiken4/words', done: cardsDone },
    { title: '紙の類似プリント', detail: '印刷リンクをお母さんへ送る', path: '/eiken4/daily', done: false },
  ];
  const nextIndex = steps.findIndex(step => !step.done);
  const next = steps[nextIndex < 0 ? steps.length - 1 : nextIndex];
  const completed = steps.slice(0, 4).filter(step => step.done).length;
  const resetToday = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetTodayGrade1Review();
    resetTodayDailyProgress();
    resetTodayReadingProgress();
    resetTodayWordCourse();
    resetSession();
    setConfirmReset(false);
    setResetVersion(value => value + 1);
  };
  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-xl">
    <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2"/>英検4級に戻る</Button>
    <header className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 shadow-lg">
      <p className="text-sm font-bold opacity-90">迷わず上から順番に</p><h1 className="text-3xl font-bold mt-1">今日の学習コース</h1><p className="mt-2">アプリ学習 {completed} / 4 完了</p>
    </header>
    <button onClick={() => navigate('/eiken4/grammar-guide')} className="mt-4 w-full rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-left"><p className="text-xs font-bold text-cyan-700">問題の文法がわからないとき</p><p className="font-bold text-slate-800 mt-1">習う前でもわかる「英検4級文法」を読む →</p></button>
    <div className="mt-5 space-y-3">{steps.map((step, index) => {
      const isNext = index === nextIndex;
      return <button key={step.title} onClick={() => navigate(step.path)} className={`w-full rounded-xl border-2 p-4 text-left shadow-sm flex items-center gap-3 ${step.done ? 'bg-emerald-50 border-emerald-300' : isNext ? 'bg-amber-50 border-amber-400' : 'bg-white border-slate-200'}`}>
        <div className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center font-bold ${step.done ? 'bg-emerald-500 text-white' : isNext ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{step.done ? <CheckCircleIcon className="h-7 w-7"/> : index + 1}</div>
        <div className="flex-grow"><p className={`text-xs font-bold ${isNext ? 'text-amber-700' : step.done ? 'text-emerald-700' : 'text-slate-500'}`}>{step.done ? '完了！' : isNext ? '次はこれ' : index === 4 ? '最後にする' : 'このあと'}</p><h2 className="text-lg font-bold text-slate-800">{step.title}</h2><p className="text-sm text-slate-600">{step.detail}</p></div><ChevronRightIcon className="h-6 w-6 text-slate-400"/>
      </button>;
    })}</div>
    <Button onClick={() => navigate(next.path)} className="w-full mt-6" size="lg">{nextIndex === 4 ? '結果と印刷リンクを開く' : `次の「${next.title}」を始める`}</Button>
    {completed > 0 && <Button onClick={resetToday} variant={confirmReset ? 'danger' : 'secondary'} className="w-full mt-3">{confirmReset ? '本当に今日のコースをやり直す' : '今日のコースをやり直す'}</Button>}
    {confirmReset && <p className="text-xs text-center text-rose-600 mt-2">もう一度押すと今日の4ステップだけ未完了に戻ります。累積の定着記録は残ります。</p>}
    <p className="text-xs text-center text-slate-500 mt-3">本番形式10問とミニ模試は、余裕のある日だけで大丈夫です。</p>
  </div>;
};
export default Eiken4DailyCoursePage;
