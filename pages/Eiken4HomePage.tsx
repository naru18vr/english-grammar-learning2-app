import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import SparklesIcon from '../components/shared/SparklesIcon';
import ClockIcon from '../components/shared/ClockIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';
import { getDueReviewCount, loadDailyProgress } from '../services/eiken4DailyService';
import { loadReadingProgress } from '../services/eiken4ReadingService';
import { loadGrade1Review } from '../services/grade1ReviewService';
import { areWordCardsDoneToday } from '../services/eiken4WordMasteryService';

const Eiken4HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useEiken4Session();
  const dailyProgress = loadDailyProgress();
  const dailyDone = Boolean(dailyProgress.completedAt);
  const dueReviewCount = getDueReviewCount();
  const readingProgress = loadReadingProgress();
  const grade1Progress = loadGrade1Review();
  const cardsDone = areWordCardsDoneToday();
  const courseDone = [Boolean(grade1Progress.completedAt), dailyDone, Boolean(readingProgress.completedAt), cardsDone].filter(Boolean).length;

  const startFresh = (path: string) => {
    resetSession();
    navigate(path);
  };

  return (
    <div className="flex-grow bg-gradient-to-b from-indigo-50 via-slate-50 to-white px-4 py-5 sm:p-7">
      <header className="mb-6 max-w-xl mx-auto">
        <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-800">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          ホームに戻る
        </Button>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-500 text-white p-6 shadow-xl shadow-indigo-200">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10"/><div className="absolute right-16 -bottom-10 h-24 w-24 rounded-full bg-white/10"/>
          <div className="relative"><p className="text-xs font-bold tracking-widest text-indigo-100">EIKEN GRADE 4</p><h1 className="text-3xl font-bold mt-2">英検4級対策</h1><p className="text-sm text-indigo-100 mt-2">毎日少しずつ、合格に必要な力を身につけよう。</p></div>
        </div>
      </header>

      <main className="max-w-xl mx-auto">
        <button onClick={() => navigate('/eiken4/course')} className="w-full p-6 rounded-3xl shadow-xl shadow-orange-200 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-left hover:shadow-2xl active:scale-[.98] transition-all"><div className="flex items-start justify-between"><div><span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold">毎日はここだけ押せばOK</span><h2 className="text-2xl font-bold mt-3">今日の学習コース</h2><p className="text-sm mt-2 text-orange-50">中1復習 → 15分 → 長文 → 英単語 → 紙</p></div><span className="rounded-full bg-white/20 p-2"><ChevronRightIcon className="h-7 w-7"/></span></div><div className="mt-5 flex items-center gap-3"><div className="h-2 flex-grow overflow-hidden rounded-full bg-white/30"><div className="h-full rounded-full bg-white transition-all" style={{width:`${courseDone * 25}%`}}/></div><span className="text-sm font-bold">{courseDone}/4</span></div></button>

        <section className="mt-8"><div className="flex items-end justify-between"><div><p className="text-xs font-bold tracking-wider text-indigo-500">TODAY</p><h2 className="text-xl font-bold text-slate-800 mt-1">今日のコース</h2></div><p className="text-xs text-slate-500">個別にも開けます</p></div><div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/eiken4/grade1-review')} className={`rounded-2xl border p-4 text-left shadow-sm transition active:scale-95 ${grade1Progress.completedAt ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-amber-200'}`}><div className="flex items-center justify-between"><span className="text-xs font-bold text-amber-700">STEP 1</span>{grade1Progress.completedAt && <CheckCircleIcon className="h-5 w-5 text-emerald-500"/>}</div><h3 className="font-bold mt-2 text-slate-800">中1おさらい</h3><p className="text-xs text-slate-500 mt-1">{grade1Progress.completedAt ? '完了！' : `${grade1Progress.answers.length}/6問`}</p></button>
          <button onClick={() => navigate('/eiken4/daily')} className={`rounded-2xl border p-4 text-left shadow-sm transition active:scale-95 ${dailyDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-emerald-200'}`}><div className="flex items-center justify-between"><span className="text-xs font-bold text-emerald-700">STEP 2</span>{dailyDone && <CheckCircleIcon className="h-5 w-5 text-emerald-500"/>}</div><h3 className="font-bold mt-2 text-slate-800">今日の15分</h3><p className="text-xs text-slate-500 mt-1">{dailyDone ? '完了！' : dueReviewCount ? `復習${dueReviewCount}問あり` : `${dailyProgress.answers.length}/18問`}</p></button>
          <button onClick={() => navigate('/eiken4/reading')} className={`rounded-2xl border p-4 text-left shadow-sm transition active:scale-95 ${readingProgress.completedAt ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-sky-200'}`}><div className="flex items-center justify-between"><span className="text-xs font-bold text-sky-700">STEP 3</span>{readingProgress.completedAt && <CheckCircleIcon className="h-5 w-5 text-emerald-500"/>}</div><h3 className="font-bold mt-2 text-slate-800">ミニ長文</h3><p className="text-xs text-slate-500 mt-1">{readingProgress.completedAt ? '完了！' : readingProgress.answers.length ? `${readingProgress.answers.length}/2問` : '1題＋2問'}</p></button>
          <button onClick={() => startFresh('/eiken4/words')} className={`rounded-2xl border p-4 text-left shadow-sm transition active:scale-95 ${cardsDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-indigo-200'}`}><div className="flex items-center justify-between"><span className="text-xs font-bold text-indigo-700">STEP 4</span>{cardsDone && <CheckCircleIcon className="h-5 w-5 text-emerald-500"/>}</div><h3 className="font-bold mt-2 text-slate-800">英単語カード</h3><p className="text-xs text-slate-500 mt-1">{cardsDone ? '完了！' : '苦手優先・8語'}</p></button>
        </div></section>

        <section className="mt-9"><p className="text-xs font-bold tracking-wider text-rose-500">EXTRA</p><h2 className="text-xl font-bold text-slate-800 mt-1">余裕がある日に追加</h2><p className="text-sm text-slate-500 mt-1">毎日の必須メニューではありません</p><div className="mt-4 space-y-3">
          <button onClick={() => navigate('/eiken4/exam-practice')} className="w-full rounded-xl bg-rose-50 border border-rose-200 p-4 text-left flex items-center justify-between"><div><p className="text-xs font-bold text-rose-600">本番に慣れる・10問</p><h3 className="font-bold text-slate-800">英検4級 本番形式</h3></div><ChevronRightIcon className="h-6 w-6 text-rose-400"/></button>
          <button onClick={() => startFresh('/eiken4/sentences')} className="w-full rounded-xl bg-amber-50 border border-amber-200 p-4 text-left flex items-center justify-between"><div className="flex items-center"><SparklesIcon className="h-7 w-7 text-amber-500 mr-3"/><div><p className="text-xs font-bold text-amber-600">語順を確認・5問</p><h3 className="font-bold text-slate-800">並べ替え問題</h3></div></div><ChevronRightIcon className="h-6 w-6 text-amber-400"/></button>
        </div></section>

        <section className="mt-9"><p className="text-xs font-bold tracking-wider text-teal-500">CHECK</p><h2 className="text-xl font-bold text-slate-800 mt-1">週1回・記録を見る</h2><div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/eiken4/mock')} className="rounded-xl bg-violet-700 text-white p-4 text-left shadow"><ClockIcon className="h-7 w-7"/><h3 className="font-bold mt-2">10分ミニ模試</h3><p className="text-xs opacity-90">週1回</p></button>
          <button onClick={() => navigate('/eiken4/progress')} className="rounded-xl bg-teal-600 text-white p-4 text-left shadow"><ClockIcon className="h-7 w-7"/><h3 className="font-bold mt-2">ダッシュボード</h3><p className="text-xs opacity-90">試験まで・苦手</p></button>
          <button onClick={() => navigate('/eiken4/word-map')} className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 text-left"><BookOpenIcon className="h-7 w-7 text-indigo-600"/><h3 className="font-bold text-indigo-900 mt-2">英単語マップ</h3><p className="text-xs text-indigo-700">全128語</p></button>
          <Link to="/eiken4/result" className="rounded-xl bg-white border border-slate-200 p-4 text-left"><ClockIcon className="h-7 w-7 text-teal-600"/><h3 className="font-bold text-slate-800 mt-2">今日の結果</h3><p className="text-xs text-slate-500">報告用画面</p></Link>
        </div></section>

        <Link to="/guide" className="mt-9 mb-4 block rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm hover:shadow-md transition-all"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-400">HELP</p><h2 className="font-bold mt-1">使い方を見る</h2><p className="text-sm text-slate-500">できること・毎日の進め方</p></div><span className="rounded-full bg-slate-100 p-2"><ChevronRightIcon className="h-5 w-5"/></span></div></Link>
      </main>
    </div>
  );
};

export default Eiken4HomePage;
