import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { useAppContext } from '../contexts/AppContext';
import { getDailyExamQuestions, loadExamPractice, recordExamAnswer, saveExamPractice } from '../services/eiken4ExamService';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';

const Eiken4ExamPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const { isSoundEnabled } = useAppContext();
  const questions = useMemo(getDailyExamQuestions, []);
  const [progress, setProgress] = useState(loadExamPractice);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const index = Object.keys(progress.answers).length;
  const complete = index >= questions.length;
  const current = questions[Math.min(index, questions.length - 1)];
  const correct = selected === current.answer;

  const checkAnswer = () => {
    if (isSoundEnabled) (correct ? playCorrectSound : playIncorrectSound)();
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (correct || nextAttempts >= 3) setChecked(true);
    else setRetrying(true);
  };

  const next = () => {
    recordExamAnswer(current.id, correct);
    const answers = { ...progress.answers, [current.id]: selected };
    const nextProgress = { ...progress, answers, ...(Object.keys(answers).length === questions.length ? { completedAt: new Date().toISOString() } : {}) };
    saveExamPractice(nextProgress);
    setProgress(nextProgress);
    setSelected('');
    setChecked(false);
    setAttempts(0);
    setRetrying(false);
  };

  if (complete) {
    const score = questions.filter(question => progress.answers[question.id] === question.answer).length;
    return <div className="flex-grow container mx-auto p-4 max-w-xl"><div className="mt-12 rounded-2xl bg-white shadow-xl p-7 text-center"><p className="font-bold text-emerald-700">本番形式トレーニング完了</p><h1 className="text-4xl font-bold mt-2">{score} / {questions.length}問</h1><Button onClick={() => navigate('/eiken4')} className="w-full mt-6">英検4級ホームへ</Button></div></div>;
  }

  return <div className="flex-grow container mx-auto p-4 max-w-xl">
    <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2" />英検4級に戻る</Button>
    <div className="mt-4 flex justify-between text-sm font-bold"><span>{current.type}</span><span>{index + 1}/{questions.length}</span></div>
    <section className="mt-3 rounded-xl bg-white shadow-lg p-5">
      <h1 className="text-xl font-bold whitespace-pre-line leading-8">{current.prompt}</h1>
      {current.translation && <p className="text-sm text-slate-500 mt-2">{current.translation}</p>}
      <div className="grid gap-3 mt-5">{current.choices.map(choice => <button key={choice} disabled={checked || retrying} onClick={() => setSelected(choice)} className={`rounded-xl border-2 p-3 text-left font-semibold ${checked && choice === current.answer ? 'border-emerald-500 bg-emerald-50' : (checked || retrying) && choice === selected && !correct ? 'border-rose-500 bg-rose-50' : selected === choice ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>{choice}</button>)}</div>
      {checked ? <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="font-bold">{correct ? '正解！' : `3回間違えました。正解：${current.answer}`}</p><p className="text-sm mt-2">{current.explanation}</p><Button onClick={next} className="w-full mt-4">次の問題</Button></div> : retrying ? <div className="mt-5 rounded-xl bg-amber-50 p-4"><p className="font-bold text-amber-800">不正解。答えはまだ見せません（{attempts}/3回）</p><Button onClick={() => { setSelected(''); setRetrying(false); }} variant="secondary" className="w-full mt-3">もう一度</Button></div> : <Button onClick={checkAnswer} disabled={!selected} className="w-full mt-5">答え合わせ</Button>}
    </section>
  </div>;
};

export default Eiken4ExamPracticePage;
