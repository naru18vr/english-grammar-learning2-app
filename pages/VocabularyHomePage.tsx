import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import { gradeVocabularyData } from '../data/gradeVocabularyData';
import { gradeVocabularyMasteryLevel, gradeWordId, loadGradeVocabularyMastery } from '../services/gradeVocabularyService';

const gradeStyles = {
  1: { badge: 'bg-emerald-100 text-emerald-700', button: 'bg-emerald-600 hover:bg-emerald-700', bar: 'bg-emerald-500', border: 'border-emerald-100' },
  2: { badge: 'bg-sky-100 text-sky-700', button: 'bg-sky-600 hover:bg-sky-700', bar: 'bg-sky-500', border: 'border-sky-100' },
  3: { badge: 'bg-indigo-100 text-indigo-700', button: 'bg-indigo-600 hover:bg-indigo-700', bar: 'bg-indigo-500', border: 'border-indigo-100' },
} as const;

const VocabularyHomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-full flex-grow bg-slate-50 px-4 pb-10 pt-4 sm:px-6">
      <header className="mx-auto max-w-2xl">
        <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="-ml-2 mb-3">
          <ArrowLeftIcon className="mr-2 h-5 w-5" />ホームに戻る
        </Button>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-6 text-white shadow-lg shadow-emerald-200/70 sm:p-8">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 right-16 h-28 w-28 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-4">
            <span className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20"><BookOpenIcon className="h-8 w-8" /></span>
            <div><p className="text-xs font-bold tracking-[0.2em] text-emerald-100">VOCABULARY</p><h1 className="mt-1 text-3xl font-extrabold">英単語</h1></div>
          </div>
          <p className="relative mt-4 max-w-md text-sm leading-6 text-emerald-50">学年を選んで10問に挑戦。間違えた単語から優先して出題され、覚えた数がマップにたまります。</p>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-2xl space-y-4">
        <div className="flex items-end justify-between px-1"><div><p className="text-xs font-bold text-emerald-600">学年を選ぶ</p><h2 className="mt-1 text-xl font-extrabold text-slate-800">今日の10問をはじめよう</h2></div><p className="text-xs text-slate-500">全276語</p></div>
        {Object.entries(gradeVocabularyData).map(([gradeId, config]) => {
          const style = gradeStyles[config.grade as keyof typeof gradeStyles];
          const mastery = loadGradeVocabularyMastery(config.grade);
          const mastered = config.words.reduce((sum, _, index) => sum + (gradeVocabularyMasteryLevel(mastery[gradeWordId(config.grade, index)]) === 'mastered' ? 1 : 0), 0);
          const progress = Math.round((mastered / config.words.length) * 100);
          return (
            <section key={gradeId} className={`overflow-hidden rounded-3xl border ${style.border} bg-white shadow-sm`}>
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-extrabold ${style.badge}`}>{config.grade}</span><div><h3 className="text-xl font-extrabold text-slate-800">中学{config.grade}年生</h3><p className="mt-0.5 text-sm text-slate-500">基本{config.words.length}語</p></div></div>
                  <div className="text-right"><p className="text-2xl font-extrabold text-slate-800">{mastered}<span className="text-sm font-bold text-slate-400">/{config.words.length}</span></p><p className="text-[11px] font-bold text-slate-400">覚えた</p></div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${style.bar} transition-all`} style={{ width: `${progress}%` }} /></div>
                <div className="mt-5 grid gap-2.5 sm:grid-cols-[1.25fr_1fr]">
                  <Link to={`/vocabulary/${gradeId}/quiz`} className={`flex min-h-14 items-center justify-between rounded-2xl px-5 py-3 font-bold text-white shadow-sm transition active:scale-[0.98] ${style.button}`}><span><span className="block text-[11px] font-semibold text-white/75">毎回10問</span>確認テスト</span><span aria-hidden="true" className="text-xl">→</span></Link>
                  <Link to={`/vocabulary/${gradeId}/map`} className="flex min-h-14 items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"><span><span className="block text-[11px] font-semibold text-slate-400">進み具合</span>英単語マップ</span><span aria-hidden="true" className="text-slate-400">›</span></Link>
                </div>
              </div>
            </section>
          );
        })}
        <aside className="rounded-2xl bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900"><span className="font-bold">覚えたの基準：</span>異なる4日で正解し、直近の回答も正解した単語です。</aside>
      </main>
    </div>
  );
};

export default VocabularyHomePage;
