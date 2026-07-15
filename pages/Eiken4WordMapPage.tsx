import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { eiken4Words } from '../data/eiken4Words';
import { loadDailyProgress } from '../services/eiken4DailyService';
import { importDailyWordAnswers, loadWordMastery, masteryLevel, MasteryLevel } from '../services/eiken4WordMasteryService';

const styles: Record<MasteryLevel, string> = { mastered: 'bg-emerald-50 border-emerald-300', consolidating: 'bg-sky-50 border-sky-300', learning: 'bg-amber-50 border-amber-300', new: 'bg-slate-50 border-slate-200' };
const Eiken4WordMapPage: React.FC = () => {
  const navigate = useNavigate(); importDailyWordAnswers(loadDailyProgress()); const mastery = loadWordMastery();
  const groups = Object.entries(eiken4Words.reduce((result, word) => { (result[word.category] ||= []).push(word); return result; }, {} as Record<string, typeof eiken4Words>));
  const counts = eiken4Words.reduce((result, word) => { result[masteryLevel(mastery[word.id])]++; return result; }, { mastered: 0, consolidating: 0, learning: 0, new: 0 });
  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-3xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2" />英検4級に戻る</Button>
    <header className="mt-4 rounded-2xl bg-indigo-600 text-white p-6 shadow-lg"><p className="text-sm font-bold opacity-90">全{eiken4Words.length}語</p><h1 className="text-3xl font-bold mt-1">英単語マップ</h1><p className="text-sm mt-2 opacity-90">異なる4日で正解し、直近も正解した単語だけ「覚えた」になります。同じ日の複数正解は1日分です。</p></header>
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-center"><div className="rounded-xl bg-emerald-100 p-3"><p className="text-xs">覚えた</p><p className="text-2xl font-bold text-emerald-800">{counts.mastered}</p></div><div className="rounded-xl bg-sky-100 p-3"><p className="text-xs">定着中</p><p className="text-2xl font-bold text-sky-800">{counts.consolidating}</p></div><div className="rounded-xl bg-amber-100 p-3"><p className="text-xs">練習中</p><p className="text-2xl font-bold text-amber-800">{counts.learning}</p></div><div className="rounded-xl bg-slate-200 p-3"><p className="text-xs">未学習</p><p className="text-2xl font-bold text-slate-700">{counts.new}</p></div></section>
    <div className="mt-5 space-y-5">{groups.map(([category, words]) => <section key={category} className="rounded-xl bg-white shadow border border-slate-100 p-4"><h2 className="font-bold text-slate-800">{category}</h2><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">{words.map(word => { const level = masteryLevel(mastery[word.id]); return <div key={word.id} className={`rounded-lg border p-2 ${styles[level]}`}><p className="font-bold text-slate-800">{word.word}</p><p className="text-xs text-slate-600 mt-1">{word.meaning}</p></div>; })}</div></section>)}</div>
  </div>;
};
export default Eiken4WordMapPage;
