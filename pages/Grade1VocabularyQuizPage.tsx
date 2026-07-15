import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import type { Grade1Word } from '../data/grade1Review';
import { gradeVocabularyData } from '../data/gradeVocabularyData';
import { useAppContext } from '../contexts/AppContext';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';
import { speakText } from '../services/speechService';
import { gradeVocabularyMasteryLevel, gradeWordId, loadGradeVocabularyMastery, recordGradeVocabularyAttempt } from '../services/gradeVocabularyService';

const QUESTION_COUNT = 10;
const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
};

type QuizWord = Grade1Word & { id: string };

const Grade1VocabularyQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { gradeId = '' } = useParams();
  const config = gradeVocabularyData[gradeId];
  const { isSoundEnabled } = useAppContext();
  const words = useMemo(() => {
    if (!config) return [];
    const mastery = loadGradeVocabularyMastery(config.grade);
    const rank = { learning: 0, new: 1, consolidating: 2, mastered: 3 };
    return shuffle(config.words.map((word, index) => ({ ...word, id: gradeWordId(config.grade, index) })))
      .sort((left, right) => rank[gradeVocabularyMasteryLevel(mastery[left.id])] - rank[gradeVocabularyMasteryLevel(mastery[right.id])])
      .slice(0, QUESTION_COUNT);
  }, [config]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const current = words[index];
  const choices = useMemo(() => current && config ? shuffle([current.meaning, ...shuffle(config.words.filter(item => item.word !== current.word)).slice(0, 3).map(item => item.meaning)]) : [], [current, config]);

  if (!config || !current) return <Navigate to="/vocabulary" replace />;

  const check = () => {
    const correct = selected === current.meaning;
    const nextAttempts = attempts + 1;
    recordGradeVocabularyAttempt(config.grade, current.id, correct);
    if (isSoundEnabled) (correct ? playCorrectSound : playIncorrectSound)();
    setAttempts(nextAttempts);
    setIsCorrect(correct);
    if (!correct && nextAttempts < 3) { setRetrying(true); return; }
    setChecked(true);
    setRetrying(false);
  };

  const next = () => {
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    if (index >= words.length - 1) { setCorrectCount(nextCorrect); setFinished(true); return; }
    setCorrectCount(nextCorrect);
    setIndex(value => value + 1);
    setSelected(''); setAttempts(0); setChecked(false); setRetrying(false); setIsCorrect(false);
  };

  if (finished) return (
    <div className="min-h-full flex-grow bg-slate-50 px-4 py-4 sm:px-6">
      <div className="mx-auto w-full max-w-xl"><Button onClick={() => navigate('/vocabulary')} variant="ghost" size="sm" className="-ml-2"><ArrowLeftIcon className="mr-2 h-5 w-5" />英単語に戻る</Button>
      <section className="mt-5 overflow-hidden rounded-[2rem] bg-white text-center shadow-lg ring-1 ring-slate-100"><div className="bg-gradient-to-br from-emerald-600 to-teal-500 px-6 py-8 text-white"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">✓</div><p className="mt-4 font-bold text-emerald-50">確認テスト完了！</p><h1 className="mt-1 text-5xl font-extrabold">{correctCount}<span className="text-2xl text-white/70"> / {words.length}</span></h1></div><div className="p-6"><p className="text-sm leading-6 text-slate-500">間違えた単語は、次回のテストで優先して出題されます。</p><div className="mt-6 space-y-3"><Button onClick={() => navigate(`/vocabulary/${gradeId}/map`)} size="lg" className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700">英単語マップを見る</Button><Button onClick={() => window.location.reload()} variant="secondary" size="lg" className="w-full rounded-2xl">もう10問やる</Button></div></div></section></div>
    </div>
  );

  return (
    <div className="min-h-full flex-grow bg-slate-50 px-4 pb-10 pt-4 sm:px-6">
      <div className="mx-auto w-full max-w-xl"><Button onClick={() => navigate('/vocabulary')} variant="ghost" size="sm" className="-ml-2"><ArrowLeftIcon className="mr-2 h-5 w-5" />英単語に戻る</Button>
      <header className="mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-emerald-600">中学{config.grade}年生</p><h1 className="mt-0.5 text-lg font-extrabold text-slate-800">英単語 確認テスト</h1></div><p className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-extrabold text-emerald-700">{index + 1} / {words.length}</p></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${((index + 1) / words.length) * 100}%` }} /></div></header>
      <main className="mt-4 rounded-[2rem] bg-white p-5 shadow-lg ring-1 ring-slate-100 sm:p-7">
        <p className="text-center text-sm font-bold text-slate-400">次の単語の意味は？</p><div className="mt-4 flex flex-wrap items-center justify-center gap-2"><h2 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">{current.word}</h2>{current.review && <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-bold text-violet-700">前学年の復習</span>}</div>
        <div className="text-center"><button onClick={() => speakText(current.word, 'en-US', 0.82)} className="mt-4 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-95"><SpeakerWaveIcon className="mr-2 h-5 w-5" />発音を聞く</button></div>
        <div className="mt-5 space-y-3">{choices.map((choice, choiceIndex) => {
          const answer = checked && choice === current.meaning;
          const wrong = (checked || retrying) && selected === choice && choice !== current.meaning;
          return <button key={`${choice}-${choiceIndex}`} disabled={checked || retrying} onClick={() => setSelected(choice)} className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border p-3 text-left font-bold transition active:scale-[0.99] ${answer ? 'border-emerald-400 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100' : wrong ? 'border-rose-400 bg-rose-50 text-rose-800 ring-2 ring-rose-100' : selected === choice ? 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-100' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm ${selected === choice ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{choiceIndex + 1}</span><span>{choice}</span></button>;
        })}</div>
        {retrying && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="font-bold text-amber-900">もう一度考えよう</p><p className="mt-1 text-sm text-amber-700">不正解（{attempts}/3回）</p><Button onClick={() => { setSelected(''); setRetrying(false); }} variant="secondary" className="mt-3 w-full rounded-xl">選びなおす</Button></div>}
        {checked && <div className={`mt-4 rounded-2xl border p-5 ${isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}><p className={`text-xl font-extrabold ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>{isCorrect ? '正解！' : '正解を確認しよう'}</p><p className="mt-2 font-bold text-slate-800">{current.word} ＝ {current.meaning}</p><p className="mt-3 rounded-xl bg-white/70 p-3 text-sm leading-6 text-slate-600">{current.example}</p><button onClick={() => speakText(current.example, 'en-US', 0.82)} className="mt-3 inline-flex items-center text-sm font-bold text-emerald-700"><SpeakerWaveIcon className="mr-1.5 h-4 w-4" />例文を聞く</button></div>}
        <div className="mt-5">{checked ? <Button onClick={next} size="lg" className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700">{index === words.length - 1 ? '結果を見る' : '次の問題へ'}</Button> : !retrying && <Button onClick={check} disabled={!selected} size="lg" className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500">答える</Button>}</div>
      </main></div>
    </div>
  );
};

export default Grade1VocabularyQuizPage;
