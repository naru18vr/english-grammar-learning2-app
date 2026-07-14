import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { eiken4Words } from '../data/eiken4Words';
import { importDailyWordAnswers, loadWordMastery, masteryLevel } from '../services/eiken4WordMasteryService';
import { loadDailyProgress } from '../services/eiken4DailyService';

const Eiken4WordMapPage: React.FC = () => {
  const navigate = useNavigate(); importDailyWordAnswers(loadDailyProgress()); const mastery = loadWordMastery();
  const groups = Object.entries(eiken4Words.reduce((result, word) => { (result[word.category] ||= []).push(word); return result; }, {} as Record<string, typeof eiken4Words>));
  const counts = eiken4Words.reduce((result, word) => { result[masteryLevel(mastery[word.id])]++; return result; }, { mastered: 0, learning: 0, new: 0 });
  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-3xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2" />英検4級に戻る</Button>
    <header className="mt-4 rounded-2xl bg-indigo-600 text-white p-6 shadow-lg"><p className="text-sm font-bold opacity-90">全128語</p><h1 className="text-3xl font-bold mt-1">英単語マップ</h1><p className="text-sm mt-2 opacity-90">2回続けて正解すると「覚えた」になります。</p></header>
    <section className="grid grid-cols-3 gap-2 mt-4 text-center"><div className="rounded-xl bg-emerald-100 p-3"><p className="text-xs">覚えた</p><p className="text-2xl font-bold text-emerald-800">{counts.mastered}</p></div><div className="rounded-xl bg-amber-100 p-3"><p className="text-xs">練習中</p><p className="text-2xl font-bold text-amber-800">{counts.learning}</p></div><div className="rounded-xl bg-slate-200 p-3"><p className="text-xs">未学習</p><p className="text-2xl font-bold text-slate-700">{counts.new}</p></div></section>
    <div className="mt-5 space-y-5">{groups.map(([category, words]) => <section key={category} className="rounded-xl bg-white shadow border border-slate-100 p-4"><h2 className="font-bold text-slate-800">{category}</h2><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">{words.map(word => { const level = masteryLevel(mastery[word.id]); return <div key={word.id} className={`rounded-lg border p-2 ${level === 'mastered' ? 'bg-emerald-50 border-emerald-300' : level === 'learning' ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}><p className="font-bold text-slate-800">{word.word}</p><p className="text-xs text-slate-600 mt-1">{word.meaning}</p></div>; })}</div></section>)}</div>
  </div>;
};
export default Eiken4WordMapPage;
