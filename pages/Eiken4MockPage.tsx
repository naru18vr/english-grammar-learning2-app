import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { clearMockAttempt, getWeeklyMock, loadMockAttempt, loadMockResult, saveMockAttempt, saveMockResult, weekKey } from '../services/eiken4MockService';
import { speakText } from '../services/speechService';

const LIMIT = 10 * 60;

const Eiken4MockPage: React.FC = () => {
  const navigate = useNavigate();
  const questions = useMemo(getWeeklyMock, []);
  const previous = loadMockResult();
  const savedAttempt = useMemo(loadMockAttempt, []);
  const [started, setStarted] = useState(Boolean(savedAttempt));
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(savedAttempt?.index || 0);
  const [remaining, setRemaining] = useState(savedAttempt?.remaining || LIMIT);
  const [answers, setAnswers] = useState<Record<string, string>>(savedAttempt?.answers || {});
  const [plays, setPlays] = useState<Record<string, number>>(savedAttempt?.plays || {});

  const finish = () => {
    const score = questions.filter(q => answers[q.id] === q.answer).length;
    saveMockResult({ week: weekKey(), score, total: questions.length, answers, completedAt: new Date().toISOString(), timeUsed: LIMIT - remaining });
    setFinished(true);
  };

  useEffect(() => {
    if (!started || finished) return;
    if (remaining <= 0) { finish(); return; }
    const timer = window.setInterval(() => setRemaining(value => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [started, finished, remaining]);

  useEffect(() => {
    if (started && !finished) saveMockAttempt({ week: weekKey(), index, remaining, answers, plays });
  }, [started, finished, index, remaining, answers, plays]);

  const restart = () => { clearMockAttempt(); setIndex(0); setRemaining(LIMIT); setAnswers({}); setPlays({}); setStarted(true); };

  if (!started) return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-xl">
    <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2"/>英検4級に戻る</Button>
    <div className="mt-8 rounded-2xl bg-white shadow-xl border border-violet-100 p-7 text-center"><p className="text-violet-700 font-bold">週1回</p><h1 className="text-3xl font-bold text-slate-800 mt-2">10分ミニ模試</h1><p className="text-slate-600 mt-3">単語5問・文法／本番形式6問・リスニング2問・長文2問</p><p className="text-sm text-slate-500 mt-2">開始後は途中で答えを表示しません。</p>
      {previous && <div className="mt-5 rounded-xl bg-slate-50 p-3"><p className="text-sm text-slate-500">前回の結果</p><p className="text-xl font-bold">{previous.score} / {previous.total}問</p></div>}
      <Button onClick={() => setStarted(true)} className="w-full mt-6">模試を始める</Button>
      {savedAttempt && <Button onClick={restart} variant="ghost" className="w-full mt-2">保存した模試を最初からやり直す</Button>}</div>
  </div>;

  if (finished) {
    const result = loadMockResult();
    return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-2xl"><div className="rounded-2xl bg-white shadow-xl p-6"><p className="text-center text-violet-700 font-bold">ミニ模試終了</p><h1 className="text-center text-4xl font-bold mt-2">{result?.score} / {questions.length}問</h1><p className="text-center text-slate-500 mt-2">所要時間 {Math.floor((result?.timeUsed || 0) / 60)}分{(result?.timeUsed || 0) % 60}秒</p>
      <div className="mt-6 space-y-3">{questions.map((q, i) => { const correct = answers[q.id] === q.answer; return <div key={q.id} className={`rounded-xl p-4 ${correct ? 'bg-emerald-50' : 'bg-rose-50'}`}><p className="font-bold">{i + 1}. {correct ? '正解' : `正解：${q.answer}`}</p><p className="text-sm mt-1">{q.prompt}</p>{!correct && <p className="text-sm text-slate-600 mt-1">{q.explanation}</p>}{q.evidence && <p className="text-sm text-sky-800 mt-1">根拠：“{q.evidence}”</p>}</div>; })}</div><Button onClick={() => navigate('/eiken4')} className="w-full mt-5">英検4級ホームへ</Button></div></div>;
  }

  const current = questions[index];
  const minutes = Math.floor(remaining / 60); const seconds = remaining % 60;
  const play = () => {
    if (!current.audioText || (plays[current.id] || 0) >= 2) return;
    speakText(current.audioText.replace(/(?:Girl|Boy|Mother|Ken): /g, ''), 'en-US', 0.9, { onStart: () => setPlays(value => ({ ...value, [current.id]: (value[current.id] || 0) + 1 })) });
  };
  const next = () => index === questions.length - 1 ? finish() : setIndex(value => value + 1);
  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-2xl"><header className="sticky top-0 z-10 rounded-xl bg-violet-700 text-white p-4 shadow flex justify-between"><span className="font-bold">{current.section}　{index + 1}/{questions.length}</span><span className={`font-mono text-xl font-bold ${remaining < 60 ? 'text-yellow-300' : ''}`}>{minutes}:{String(seconds).padStart(2, '0')}</span></header>
    {current.passage && <div className="mt-4 rounded-xl bg-white p-5 shadow"><p className="leading-8 text-slate-800">{current.passage}</p></div>}
    <section className="mt-4 rounded-xl bg-white p-5 shadow border border-violet-100">{current.audioText && <button onClick={play} disabled={(plays[current.id] || 0) >= 2} className="w-full mb-4 flex justify-center items-center rounded-xl bg-indigo-600 disabled:bg-slate-400 text-white font-bold py-3"><SpeakerWaveIcon className="h-6 w-6 mr-2"/>音声を聞く（あと{2 - (plays[current.id] || 0)}回）</button>}<h2 className="text-xl font-bold">{current.prompt}</h2><div className="grid gap-3 mt-4">{current.choices.map(choice => <button key={choice} onClick={() => setAnswers(value => ({ ...value, [current.id]: choice }))} className={`rounded-xl border-2 p-3 text-left font-bold ${answers[current.id] === choice ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}>{choice}</button>)}</div><Button onClick={next} disabled={!answers[current.id]} className="w-full mt-5">{index === questions.length - 1 ? '採点する' : '次の問題'}</Button></section>
  </div>;
};
export default Eiken4MockPage;
