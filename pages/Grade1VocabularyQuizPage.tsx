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
    <div className="flex-grow p-4 sm:p-6 max-w-xl mx-auto w-full">
      <Button onClick={() => navigate('/vocabulary')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2" />英単語に戻る</Button>
      <section className="mt-8 rounded-2xl bg-white p-7 text-center shadow-xl"><p className="font-bold text-emerald-700">確認テスト完了！</p><h1 className="mt-2 text-4xl font-bold text-slate-800">{correctCount} / {words.length}</h1><p className="mt-3 text-sm text-slate-500">間違えた単語は次回も優先して出題されます。</p><div className="mt-6 space-y-3"><Button onClick={() => navigate(`/vocabulary/${gradeId}/map`)} className="w-full">英単語マップを見る</Button><Button onClick={() => window.location.reload()} variant="secondary" className="w-full">もう10問やる</Button></div></section>
    </div>
  );

  return (
    <div className="flex-grow p-4 sm:p-6 max-w-xl mx-auto w-full">
      <Button onClick={() => navigate('/vocabulary')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2" />英単語に戻る</Button>
      <header className="mt-4 rounded-2xl bg-emerald-600 p-5 text-white shadow"><p className="text-sm font-bold text-emerald-100">中学{config.grade}年生</p><h1 className="mt-1 text-2xl font-bold">英単語 確認テスト</h1><p className="mt-2 text-sm">{index + 1} / {words.length}</p></header>
      <main className="mt-5 rounded-2xl bg-white p-5 shadow-xl">
        <p className="text-sm font-bold text-slate-500">次の単語の意味は？</p><h2 className="mt-2 text-4xl font-bold text-slate-800">{current.word}</h2>
        <button onClick={() => speakText(current.word, 'en-US', 0.82)} className="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 font-bold text-emerald-700"><SpeakerWaveIcon className="h-5 w-5 mr-2" />発音を聞く</button>
        <div className="mt-5 space-y-3">{choices.map((choice, choiceIndex) => {
          const answer = checked && choice === current.meaning;
          const wrong = (checked || retrying) && selected === choice && choice !== current.meaning;
          return <button key={`${choice}-${choiceIndex}`} disabled={checked || retrying} onClick={() => setSelected(choice)} className={`w-full rounded-xl border p-4 text-left font-bold ${answer ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : wrong ? 'border-rose-400 bg-rose-50 text-rose-800' : selected === choice ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}>{choiceIndex + 1}. {choice}</button>;
        })}</div>
        {retrying && <div className="mt-4 rounded-xl bg-amber-50 p-4"><p className="font-bold text-amber-800">不正解。もう一度考えよう（{attempts}/3回）</p><Button onClick={() => { setSelected(''); setRetrying(false); }} variant="secondary" className="mt-3 w-full">もう一度</Button></div>}
        {checked && <div className={`mt-4 rounded-xl p-4 ${isCorrect ? 'bg-emerald-50' : 'bg-rose-50'}`}><p className="text-xl font-bold">{isCorrect ? '正解！' : '正解を確認しよう'}</p><p className="mt-2">{current.word} ＝ {current.meaning}</p><p className="mt-2 text-sm text-slate-600">{current.example}</p><button onClick={() => speakText(current.example, 'en-US', 0.82)} className="mt-2 text-sm font-bold text-emerald-700">例文を聞く</button></div>}
        <div className="mt-5">{checked ? <Button onClick={next} className="w-full">{index === words.length - 1 ? '結果を見る' : '次の問題へ'}</Button> : !retrying && <Button onClick={check} disabled={!selected} className="w-full">答える</Button>}</div>
      </main>
    </div>
  );
};

export default Grade1VocabularyQuizPage;
