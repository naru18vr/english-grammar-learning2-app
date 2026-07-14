import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { useAppContext } from '../contexts/AppContext';
import { getTodayReading, loadReadingProgress, saveReadingProgress } from '../services/eiken4ReadingService';
import { loadDailyProgress } from '../services/eiken4DailyService';
import { createWorksheetShareLink } from '../services/eiken4WorksheetService';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';
import { speakText } from '../services/speechService';

const Eiken4ReadingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSoundEnabled } = useAppContext();
  const reading = getTodayReading();
  const [progress, setProgress] = useState(loadReadingProgress);
  const [selected, setSelected] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const index = progress.answers.length;
  const complete = index >= reading.questions.length;
  const question = reading.questions[Math.min(index, reading.questions.length - 1)];

  const answer = () => {
    if (!selected) return;
    if (isSoundEnabled) (selected === question.answer ? playCorrectSound : playIncorrectSound)();
    const answers = [...progress.answers, selected];
    const next = { ...progress, answers, ...(answers.length === reading.questions.length ? { completedAt: new Date().toISOString() } : {}) };
    saveReadingProgress(next);
    setProgress(next);
    setSelected('');
  };

  const copyParentMessage = async () => {
    const daily = loadDailyProgress();
    const dailyScore = daily.answers.filter(item => item.correct).length;
    const readingScore = reading.questions.filter((item, i) => progress.answers[i] === item.answer).length;
    const message = `今日の15分とミニ長文を完了しました！\n15分：${dailyScore} / ${daily.questionIds.length}問\nミニ長文：${readingScore} / ${reading.questions.length}問\n今日の類題プリントはこちら\n${createWorksheetShareLink(daily, progress)}`;
    try { await navigator.clipboard.writeText(message); setCopyStatus('copied'); }
    catch { setCopyStatus('error'); }
  };

  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-2xl">
    <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm" className="mb-4 text-slate-600"><ArrowLeftIcon className="h-5 w-5 mr-2" />英検4級に戻る</Button>
    <header className="rounded-xl bg-sky-600 text-white p-5 shadow-lg"><p className="text-sm font-bold opacity-90">今日のミニ長文・{reading.type}</p><h1 className="text-2xl font-bold mt-1">{reading.title}</h1></header>
    <section className="mt-4 rounded-xl bg-white border border-sky-100 shadow-lg p-5">
      <div className="flex justify-between items-center mb-3"><span className="text-xs font-bold text-sky-700">約{reading.passage.split(/\s+/).length}語</span><button onClick={() => speakText(reading.passage, 'en-US', 0.82)} className="inline-flex items-center text-sm font-bold text-indigo-700"><SpeakerWaveIcon className="h-5 w-5 mr-1" />英文を聞く</button></div>
      <p className="text-lg leading-8 text-slate-800">{reading.passage}</p>
    </section>
    {!complete ? <section className="mt-4 rounded-xl bg-white border border-slate-200 shadow p-5">
      <p className="text-sm font-bold text-slate-500">問題 {index + 1} / {reading.questions.length}</p><h2 className="text-xl font-bold text-slate-800 mt-2">{question.question}</h2>
      <div className="grid gap-3 mt-4">{question.choices.map(choice => <button key={choice} onClick={() => setSelected(choice)} className={`rounded-xl border-2 p-3 text-left font-bold ${selected === choice ? 'border-sky-500 bg-sky-50' : 'border-slate-200'}`}>{choice}</button>)}</div>
      <Button onClick={answer} disabled={!selected} className="w-full mt-4">答える</Button>
    </section> : <section className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-5">
      <div className="flex items-center"><BookOpenIcon className="h-7 w-7 text-emerald-700 mr-2" /><h2 className="text-xl font-bold text-emerald-800">今日の長文 完了！</h2></div>
      <p className="font-bold text-slate-700 mt-4">全文和訳</p><p className="text-slate-700 leading-7 mt-1">{reading.translation}</p>
      <div className="mt-5 space-y-4">{reading.questions.map((item, i) => <div key={item.question} className="rounded-lg bg-white p-4"><p className="font-bold">{i + 1}. {progress.answers[i] === item.answer ? '正解' : `正解：${item.answer}`}</p><p className="text-sm text-sky-800 mt-2">根拠：“{item.evidence}”</p><p className="text-sm text-slate-600 mt-1">{item.explanation}</p></div>)}</div>
      <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4"><p className="font-bold text-amber-900">保護者へ完了報告</p><p className="text-sm text-amber-900 mt-1">類似長文を含む印刷リンクをGoogle Chatへ送れます。</p><Button onClick={copyParentMessage} className="w-full mt-3">{copyStatus === 'copied' ? 'コピーしました！' : '結果と印刷リンクをコピー'}</Button>{copyStatus === 'error' && <p className="text-sm text-rose-700 font-bold mt-2">コピーできませんでした。Chromeの権限をご確認ください。</p>}</div>
      <Button onClick={() => navigate('/eiken4')} className="w-full mt-5">英検4級ホームへ</Button>
    </section>}
  </div>;
};

export default Eiken4ReadingPage;
