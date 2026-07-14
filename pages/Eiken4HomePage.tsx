import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import SparklesIcon from '../components/shared/SparklesIcon';
import ClockIcon from '../components/shared/ClockIcon';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';
import { getDueReviewCount, loadDailyProgress } from '../services/eiken4DailyService';
import { loadReadingProgress } from '../services/eiken4ReadingService';
import { loadGrade1Review } from '../services/grade1ReviewService';

const Eiken4HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useEiken4Session();
  const dailyProgress = loadDailyProgress();
  const dailyDone = Boolean(dailyProgress.completedAt);
  const dueReviewCount = getDueReviewCount();
  const readingProgress = loadReadingProgress();
  const grade1Progress = loadGrade1Review();

  const startFresh = (path: string) => {
    resetSession();
    navigate(path);
  };

  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-800">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          ホームに戻る
        </Button>
        <div className="rounded-xl bg-indigo-600 text-white p-5 shadow-lg">
          <p className="text-sm font-semibold opacity-90">中学生向け</p>
          <h1 className="text-3xl font-bold mt-1">英検4級モード</h1>
          <p className="text-sm opacity-90 mt-2">単語と語順を短時間で確認しよう。</p>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
        <button onClick={() => navigate('/eiken4/course')} className="w-full p-6 rounded-2xl shadow-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-left hover:shadow-2xl active:scale-95 transition-all"><div className="flex items-center justify-between"><div><p className="text-sm font-bold opacity-90">毎日はここから</p><h2 className="text-2xl font-bold mt-1">今日の学習コース</h2><p className="text-sm mt-2">中1復習 → 15分 → 長文 → 英単語 → 紙</p></div><ChevronRightIcon className="h-9 w-9"/></div></button>
        <Link to="/guide" className="block rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4 text-indigo-800 shadow hover:shadow-md transition-all"><div className="flex items-center justify-between"><div><h2 className="font-bold text-lg">使い方を見る</h2><p className="text-sm">毎日のおすすめ順・できること</p></div><ChevronRightIcon className="h-6 w-6"/></div></Link>
        <button onClick={() => navigate('/eiken4/progress')} className="w-full p-5 rounded-xl shadow-lg bg-teal-600 text-white text-left hover:shadow-xl active:scale-95 transition-all">
          <div className="flex items-center justify-between"><div className="flex items-center"><ClockIcon className="h-9 w-9 mr-4"/><div><p className="text-xs font-bold opacity-80">試験までの日数・苦手</p><h2 className="text-xl font-bold">学習ダッシュボード</h2></div></div><ChevronRightIcon className="h-7 w-7 opacity-80"/></div>
        </button>
        <button
          onClick={() => navigate('/eiken4/daily')}
          className="w-full p-6 rounded-xl shadow-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-left hover:shadow-2xl active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold opacity-90">毎日これだけ</p>
              <h2 className="text-2xl font-bold mt-1">{dailyDone ? '今日の15分 完了！' : dailyProgress.answers.length ? '今日の続きをする' : '今日の15分を始める'}</h2>
              <p className="text-sm opacity-90 mt-1">単語・文法・リスニング{dueReviewCount > 0 ? `（復習${dueReviewCount}問あり）` : ''}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold">{dailyProgress.answers.length}</span>
              <span className="text-sm"> / {dailyProgress.questionIds.length}</span>
              <ChevronRightIcon className="h-7 w-7 ml-auto mt-1 opacity-80" />
            </div>
          </div>
        </button>

        <button onClick={() => navigate('/eiken4/reading')} className="w-full p-5 rounded-xl shadow-lg bg-sky-600 text-white text-left hover:shadow-xl active:scale-95 transition-all">
          <div className="flex items-center justify-between"><div className="flex items-center"><BookOpenIcon className="h-9 w-9 mr-4"/><div><h2 className="text-xl font-bold">1日1題 ミニ長文</h2><p className="text-sm opacity-90">{readingProgress.completedAt ? '今日の長文は完了！' : readingProgress.answers.length ? '今日の続きをしよう' : '短い英文＋2問'}</p></div></div><ChevronRightIcon className="h-7 w-7 opacity-80"/></div>
        </button>
        <button onClick={() => navigate('/eiken4/grade1-review')} className="w-full p-5 rounded-xl shadow-lg bg-amber-500 text-white text-left hover:shadow-xl active:scale-95 transition-all"><div className="flex items-center justify-between"><div><p className="text-xs font-bold opacity-90">英検4級につながる基礎を毎日5分</p><h2 className="text-xl font-bold">{grade1Progress.completedAt ? '中1おさらい 完了！' : grade1Progress.answers.length ? '中1おさらいの続きをする' : '中1 単語・文法おさらい'}</h2><p className="text-sm opacity-90">頻出場面の単語3語＋必要文法3問</p></div><div className="text-right"><span className="font-bold">{grade1Progress.answers.length} / 6</span><ChevronRightIcon className="h-7 w-7 ml-auto opacity-80"/></div></div></button>

        <button onClick={() => navigate('/eiken4/mock')} className="w-full p-5 rounded-xl shadow-lg bg-violet-700 text-white text-left hover:shadow-xl active:scale-95 transition-all">
          <div className="flex items-center justify-between"><div className="flex items-center"><ClockIcon className="h-9 w-9 mr-4"/><div><p className="text-xs font-bold opacity-80">週1回</p><h2 className="text-xl font-bold">10分ミニ模試</h2><p className="text-sm opacity-90">単語・文法・聞き取り・長文</p></div></div><ChevronRightIcon className="h-7 w-7 opacity-80"/></div>
        </button>
        <button onClick={() => navigate('/eiken4/exam-practice')} className="w-full p-5 rounded-xl shadow-lg bg-rose-600 text-white text-left hover:shadow-xl active:scale-95 transition-all"><div className="flex items-center justify-between"><div><p className="text-xs font-bold opacity-80">毎日10問</p><h2 className="text-xl font-bold">英検4級 本番形式</h2><p className="text-sm opacity-90">空所補充・会話・語句整序</p></div><ChevronRightIcon className="h-7 w-7 opacity-80"/></div></button>

        <button onClick={() => navigate('/eiken4/word-map')} className="w-full p-5 rounded-xl shadow-lg bg-indigo-50 border-2 border-indigo-200 text-left hover:shadow-xl active:scale-95 transition-all"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-indigo-600">全128語の進み具合</p><h2 className="text-xl font-bold text-indigo-900">英単語マップ</h2><p className="text-sm text-indigo-700">覚えた・練習中・未学習</p></div><ChevronRightIcon className="h-7 w-7 text-indigo-500" /></div></button>

        <button
          onClick={() => startFresh('/eiken4/words')}
          className="w-full p-5 rounded-xl shadow-lg bg-white border border-indigo-100 text-left hover:shadow-xl active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpenIcon className="h-9 w-9 text-indigo-600 mr-4" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">単語カード</h2>
                <p className="text-sm text-slate-500">未学習・苦手な8語を確認</p>
              </div>
            </div>
            <ChevronRightIcon className="h-7 w-7 text-slate-400" />
          </div>
        </button>

        <button
          onClick={() => startFresh('/eiken4/sentences')}
          className="w-full p-5 rounded-xl shadow-lg bg-white border border-indigo-100 text-left hover:shadow-xl active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SparklesIcon className="h-9 w-9 text-amber-500 mr-4" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">並べ替え問題</h2>
                <p className="text-sm text-slate-500">5問で語順をチェック</p>
              </div>
            </div>
            <ChevronRightIcon className="h-7 w-7 text-slate-400" />
          </div>
        </button>

        <Link
          to="/eiken4/result"
          className="block p-5 rounded-xl shadow-lg bg-white border border-indigo-100 hover:shadow-xl active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClockIcon className="h-9 w-9 text-teal-600 mr-4" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">今日の結果</h2>
                <p className="text-sm text-slate-500">スクショで報告しよう</p>
              </div>
            </div>
            <ChevronRightIcon className="h-7 w-7 text-slate-400" />
          </div>
        </Link>
      </main>
    </div>
  );
};

export default Eiken4HomePage;
