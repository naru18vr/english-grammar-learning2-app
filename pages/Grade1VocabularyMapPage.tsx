import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { gradeVocabularyData } from '../data/gradeVocabularyData';
import { gradeVocabularyMasteryLevel, gradeWordId, loadGradeVocabularyMastery, VocabularyMasteryLevel } from '../services/gradeVocabularyService';

const wordStyles: Record<VocabularyMasteryLevel, string> = {
  mastered: 'bg-emerald-50 border-emerald-200 ring-emerald-100',
  consolidating: 'bg-sky-50 border-sky-200 ring-sky-100',
  learning: 'bg-amber-50 border-amber-200 ring-amber-100',
  new: 'bg-white border-slate-200 ring-slate-100',
};
const gradeHeaders = { 1: 'from-emerald-700 to-teal-500', 2: 'from-sky-700 to-cyan-500', 3: 'from-indigo-700 to-violet-500' } as const;

const Grade1VocabularyMapPage: React.FC = () => {
  const navigate = useNavigate();
  const { gradeId = '' } = useParams();
  const config = gradeVocabularyData[gradeId];
  if (!config) return <Navigate to="/vocabulary" replace />;
  const mastery = loadGradeVocabularyMastery(config.grade);
  const counts = config.words.reduce((result, _, index) => {
    result[gradeVocabularyMasteryLevel(mastery[gradeWordId(config.grade, index)])] += 1;
    return result;
  }, { mastered: 0, consolidating: 0, learning: 0, new: 0 });
  const progress = Math.round((counts.mastered / config.words.length) * 100);

  return (
    <div className="min-h-full flex-grow bg-slate-50 px-4 pb-28 pt-4 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <Button onClick={() => navigate('/vocabulary')} variant="ghost" size="sm" className="-ml-2"><ArrowLeftIcon className="mr-2 h-5 w-5" />英単語に戻る</Button>
        <header className={`relative mt-3 overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradeHeaders[config.grade as keyof typeof gradeHeaders]} p-6 text-white shadow-lg sm:p-8`}>
          <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative"><p className="text-sm font-bold text-white/75">中学{config.grade}年生・全{config.words.length}語</p><div className="mt-1 flex items-end justify-between"><h1 className="text-3xl font-extrabold">英単語マップ</h1><p className="text-2xl font-extrabold">{progress}<span className="text-sm">%</span></p></div><div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/15"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-3 text-xs leading-5 text-white/80">4日間正解して「覚えた」を増やそう</p></div>
        </header>

        <section className="mt-4 grid grid-cols-2 gap-2.5 text-center sm:grid-cols-4">
          {[['覚えた', counts.mastered, 'bg-emerald-100 text-emerald-800'], ['定着中', counts.consolidating, 'bg-sky-100 text-sky-800'], ['練習中', counts.learning, 'bg-amber-100 text-amber-800'], ['未学習', counts.new, 'bg-slate-200 text-slate-700']].map(([label, value, style]) => <div key={String(label)} className={`rounded-2xl p-3 ${style}`}><p className="text-xs font-bold opacity-75">{label}</p><p className="mt-1 text-2xl font-extrabold">{value}</p></div>)}
        </section>

        <div className="mt-6 space-y-4">{config.groups.map((group, groupIndex) => {
          const groupWords = config.words.slice(group.from, group.to);
          const groupMastered = groupWords.reduce((sum, _, offset) => sum + (gradeVocabularyMasteryLevel(mastery[gradeWordId(config.grade, group.from + offset)]) === 'mastered' ? 1 : 0), 0);
          return <section key={group.title} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm font-extrabold text-slate-500">{groupIndex + 1}</span><h2 className="font-extrabold text-slate-800">{group.title}</h2></div><p className="text-xs font-bold text-slate-400">{groupMastered}/{groupWords.length}</p></div><div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">{groupWords.map((word, offset) => { const index = group.from + offset; const level = gradeVocabularyMasteryLevel(mastery[gradeWordId(config.grade, index)]); return <div key={word.word} className={`min-h-20 rounded-2xl border p-3 ring-1 ${wordStyles[level]}`}><div className="flex flex-wrap items-center gap-1"><p className="font-extrabold text-slate-800">{word.word}</p>{word.review && <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">復習</span>}</div><p className="mt-1.5 text-xs leading-4 text-slate-600">{word.meaning}</p></div>; })}</div></section>;
        })}</div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/95 p-3 backdrop-blur"><div className="mx-auto max-w-3xl"><Button onClick={() => navigate(`/vocabulary/${gradeId}/quiz`)} size="lg" className="w-full rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-200 hover:bg-emerald-700">確認テストをはじめる</Button></div></div>
    </div>
  );
};

export default Grade1VocabularyMapPage;
