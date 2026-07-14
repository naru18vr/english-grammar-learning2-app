import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import { loadGrade1Review } from '../services/grade1ReviewService';
import { loadDailyProgress } from '../services/eiken4DailyService';
import { loadReadingProgress } from '../services/eiken4ReadingService';
import { areWordCardsDoneToday } from '../services/eiken4WordMasteryService';

const Eiken4DailyCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const grade1Done = Boolean(loadGrade1Review().completedAt);
  const dailyDone = Boolean(loadDailyProgress().completedAt);
  const readingDone = Boolean(loadReadingProgress().completedAt);
  const cardsDone = areWordCardsDoneToday();
  const steps = [
    { title: '中1のおさらい', detail: '単語3語＋文法3問・約5分', path: '/eiken4/grade1-review', done: grade1Done },
    { title: '今日の15分', detail: '単語・文法・リスニング・本番形式18問', path: '/eiken4/daily', done: dailyDone },
    { title: 'ミニ長文', detail: '英文1題＋設問2問', path: '/eiken4/reading', done: readingDone },
    { title: '英単語カード', detail: '未学習・苦手な8語', path: '/eiken4/words', done: cardsDone },
    { title: '紙の類似プリント', detail: '印刷リンクをお母さんへ送る', path: '/eiken4/daily', done: false },
  ];
  const nextIndex = steps.findIndex(step => !step.done);
  const next = steps[nextIndex < 0 ? steps.length - 1 : nextIndex];
  const completed = steps.slice(0, 4).filter(step => step.done).length;
  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-xl">
    <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2"/>英検4級に戻る</Button>
    <header className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 shadow-lg">
      <p className="text-sm font-bold opacity-90">迷わず上から順番に</p><h1 className="text-3xl font-bold mt-1">今日の学習コース</h1><p className="mt-2">アプリ学習 {completed} / 4 完了</p>
    </header>
    <div className="mt-5 space-y-3">{steps.map((step, index) => {
      const isNext = index === nextIndex;
      return <button key={step.title} onClick={() => navigate(step.path)} className={`w-full rounded-xl border-2 p-4 text-left shadow-sm flex items-center gap-3 ${step.done ? 'bg-emerald-50 border-emerald-300' : isNext ? 'bg-amber-50 border-amber-400' : 'bg-white border-slate-200'}`}>
        <div className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center font-bold ${step.done ? 'bg-emerald-500 text-white' : isNext ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{step.done ? <CheckCircleIcon className="h-7 w-7"/> : index + 1}</div>
        <div className="flex-grow"><p className={`text-xs font-bold ${isNext ? 'text-amber-700' : step.done ? 'text-emerald-700' : 'text-slate-500'}`}>{step.done ? '完了！' : isNext ? '次はこれ' : index === 4 ? '最後にする' : 'このあと'}</p><h2 className="text-lg font-bold text-slate-800">{step.title}</h2><p className="text-sm text-slate-600">{step.detail}</p></div><ChevronRightIcon className="h-6 w-6 text-slate-400"/>
      </button>;
    })}</div>
    <Button onClick={() => navigate(next.path)} className="w-full mt-6" size="lg">{nextIndex === 4 ? '結果と印刷リンクを開く' : `次の「${next.title}」を始める`}</Button>
    <p className="text-xs text-center text-slate-500 mt-3">本番形式10問とミニ模試は、余裕のある日だけで大丈夫です。</p>
  </div>;
};
export default Eiken4DailyCoursePage;
