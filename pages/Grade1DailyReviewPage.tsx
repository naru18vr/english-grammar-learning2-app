import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { getGrade1DailyItems, loadGrade1Review, saveGrade1Review } from '../services/grade1ReviewService';
import { speakText } from '../services/speechService';

const Grade1DailyReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(loadGrade1Review);
  const [shown, setShown] = useState(false);
  const items = getGrade1DailyItems(progress.date);
  const all = [...items.words.map(item => ({ type: '単語', prompt: item.item.word, answer: item.item.meaning, note: item.item.example })), ...items.grammar.map(item => ({ type: item.item.title, prompt: item.item.question, answer: item.item.answer, note: item.item.note }))];
  const index = progress.answers.length;
  const current = all[index];
  const answer = (correct: boolean) => {
    const answers = [...progress.answers, correct];
    const next = { ...progress, answers, ...(answers.length === all.length ? { completedAt: new Date().toISOString() } : {}) };
    saveGrade1Review(next); setProgress(next); setShown(false);
  };
  if (!current) return <div className="flex-grow container mx-auto p-4 max-w-xl"><div className="mt-12 rounded-2xl bg-white shadow-xl p-7 text-center"><p className="text-emerald-700 font-bold">中1おさらい完了！</p><h1 className="text-3xl font-bold mt-2">今日の6問が終わりました</h1><p className="text-slate-600 mt-3">単語3語＋文法3問を確認しました。</p><Button onClick={() => navigate('/eiken4')} className="w-full mt-6">英検4級ホームへ</Button></div></div>;
  return <div className="flex-grow container mx-auto p-4 max-w-xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2"/>英検4級に戻る</Button><header className="mt-4 rounded-xl bg-amber-500 text-white p-5"><p className="font-bold">毎日5分・中1基礎</p><h1 className="text-2xl font-bold mt-1">単語3語＋文法3問</h1></header><section className="mt-4 rounded-2xl bg-white shadow-lg p-6 text-center"><p className="text-sm font-bold text-amber-700">{current.type}　{index + 1} / 6</p><h2 className="text-3xl font-bold mt-5">{current.prompt}</h2>{current.type === '単語' && <button onClick={() => speakText(current.prompt, 'en-US', .82)} className="mt-4 inline-flex items-center text-indigo-700 font-bold"><SpeakerWaveIcon className="h-5 w-5 mr-1"/>発音を聞く</button>}{!shown ? <Button onClick={() => setShown(true)} className="w-full mt-7">答えを見る</Button> : <div className="mt-6"><p className="text-2xl font-bold text-indigo-700">{current.answer}</p><p className="mt-3 rounded-lg bg-slate-50 p-3 text-slate-600">{current.note}</p><p className="font-bold mt-5">自分で答えられた？</p><div className="grid grid-cols-2 gap-3 mt-3"><Button onClick={() => answer(true)}>できた</Button><Button onClick={() => answer(false)} variant="secondary">まだ</Button></div></div>}</section></div>;
};
export default Grade1DailyReviewPage;
