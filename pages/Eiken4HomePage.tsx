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

const Eiken4HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useEiken4Session();
  const dailyProgress = loadDailyProgress();
  const dailyDone = Boolean(dailyProgress.completedAt);
  const dueReviewCount = getDueReviewCount();

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
        <button
          onClick={() => navigate('/eiken4/daily')}
          className="w-full p-6 rounded-xl shadow-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-left hover:shadow-2xl active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold opacity-90">毎日これだけ</p>
              <h2 className="text-2xl font-bold mt-1">{dailyDone ? '今日の15分 完了！' : dailyProgress.answers.length ? '今日の続きをする' : '今日の15分を始める'}</h2>
              <p className="text-sm opacity-90 mt-1">単語・文法15問{dueReviewCount > 0 ? `（復習${dueReviewCount}問あり）` : ''}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold">{dailyProgress.answers.length}</span>
              <span className="text-sm"> / 15</span>
              <ChevronRightIcon className="h-7 w-7 ml-auto mt-1 opacity-80" />
            </div>
          </div>
        </button>

        <button
          onClick={() => startFresh('/eiken4/words')}
          className="w-full p-5 rounded-xl shadow-lg bg-white border border-indigo-100 text-left hover:shadow-xl active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpenIcon className="h-9 w-9 text-indigo-600 mr-4" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">単語カード</h2>
                <p className="text-sm text-slate-500">10語をテンポよく確認</p>
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
