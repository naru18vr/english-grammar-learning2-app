import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { getGrade1DailyItems, loadGrade1Review, saveGrade1Review } from '../services/grade1ReviewService';
import { speakText } from '../services/speechService';
import { useAppContext } from '../contexts/AppContext';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';
import Eiken4GrammarReference from '../components/Eiken4GrammarReference';

type ReviewItem = { type: string; prompt: string; answer: string; note: string; words?: string[] };

const Grade1DailyReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSoundEnabled } = useAppContext();
  const [progress, setProgress] = useState(loadGrade1Review);
  const [shown, setShown] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const items = getGrade1DailyItems(progress.date);
  const all: ReviewItem[] = [
    ...items.words.map(({ item }) => ({ type: '単語', prompt: item.word, answer: item.meaning, note: item.example })),
    ...items.grammar.map(({ item }) => ({ type: item.title, prompt: item.question, answer: item.answer, note: item.note, words: item.words })),
  ];
  const index = progress.answers.length;
  const current = all[index];
  const tokens = useMemo(() => {
    if (!current?.words) return [];
    return current.words.map((word, key) => ({ word, key })).sort(() => Math.random() - 0.5);
  }, [current?.prompt]);
  const selectedWords = picked.map(key => tokens.find(token => token.key === key)?.word || '');
  const builtAnswer = selectedWords.join(' ').replace(/ ([.,?!])/g, '$1');
  const grammarCorrect = builtAnswer === current?.answer;

  const finishItem = (correct: boolean) => {
    if (isSoundEnabled) (correct ? playCorrectSound : playIncorrectSound)();
    const answers = [...progress.answers, correct];
    const next = { ...progress, answers, ...(answers.length === all.length ? { completedAt: new Date().toISOString() } : {}) };
    saveGrade1Review(next);
    setProgress(next);
    setShown(false);
    setPicked([]);
    setChecked(false);
    setAttempts(0);
    setRetrying(false);
  };

  if (!current) return <div className="flex-grow container mx-auto p-4 max-w-xl"><div className="mt-12 rounded-2xl bg-white shadow-xl p-7 text-center"><p className="text-emerald-700 font-bold">中1おさらい完了！</p><h1 className="text-3xl font-bold mt-2">今日の10問が終わりました</h1><p className="text-slate-600 mt-3">英検4級でよく使う単語5語と文法並べ替え5問を確認しました。</p><Button onClick={() => navigate('/eiken4/daily')} className="w-full mt-6">次は「今日の15分」へ</Button><Button onClick={() => navigate('/eiken4/course')} variant="ghost" className="w-full mt-2">コース一覧を見る</Button></div></div>;

  const isWord = current.type === '単語';
  return <div className="flex-grow container mx-auto p-4 max-w-xl">
    <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2"/>英検4級に戻る</Button>
    <header className="mt-4 rounded-xl bg-amber-500 text-white p-5 shadow"><p className="font-bold">毎日8分・英検4級につながる中1基礎</p><h1 className="text-2xl font-bold mt-1">単語5語＋並べ替え5問</h1><p className="text-sm mt-2 opacity-95">英検4級頻出だけからランダム出題・未定着を優先</p></header>
    <div className="mt-4 flex justify-between text-sm font-bold text-slate-600"><span>{isWord ? '基本単語' : `文法並べ替え・${current.type}`}</span><span>{index + 1} / 10</span></div>
    <section className="mt-2 rounded-2xl bg-white shadow-lg p-6 text-center">
      <h2 className={`${isWord ? 'text-4xl' : 'text-xl'} font-bold text-slate-800 mt-2`}>{current.prompt}</h2>
      {isWord && <button onClick={() => speakText(current.prompt, 'en-US', .82)} className="mt-4 inline-flex items-center text-indigo-700 font-bold"><SpeakerWaveIcon className="h-5 w-5 mr-1"/>発音を聞く</button>}

      {isWord ? (!shown ? <Button onClick={() => setShown(true)} className="w-full mt-7">意味を見る</Button> : <div className="mt-6"><p className="text-2xl font-bold text-indigo-700">{current.answer}</p><p className="mt-3 rounded-lg bg-slate-50 p-3 text-slate-600">{current.note}</p><p className="font-bold mt-5">意味を言えた？</p><div className="grid grid-cols-2 gap-3 mt-3"><Button onClick={() => finishItem(true)}>できた</Button><Button onClick={() => finishItem(false)} variant="secondary">まだ</Button></div></div>) : <div className="mt-6">
        <div className="min-h-20 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-3 flex flex-wrap gap-2 items-center justify-center">
          {picked.length ? picked.map(key => { const token = tokens.find(item => item.key === key); return <button key={key} disabled={checked} onClick={() => !checked && setPicked(value => value.filter(item => item !== key))} className="rounded-lg bg-indigo-600 text-white px-3 py-2 font-bold shadow">{token?.word}</button>; }) : <p className="text-sm text-amber-700">下の単語を正しい順にタップ</p>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">{tokens.filter(token => !picked.includes(token.key)).map(token => <button key={token.key} disabled={checked} onClick={() => setPicked(value => [...value, token.key])} className="rounded-lg border-2 border-indigo-200 bg-white px-3 py-2 font-bold text-slate-700">{token.word}</button>)}</div>
        {!checked && !retrying ? <Button onClick={() => { const nextAttempts = attempts + 1; setAttempts(nextAttempts); if (grammarCorrect || nextAttempts >= 3) setChecked(true); else setRetrying(true); if (isSoundEnabled) (grammarCorrect ? playCorrectSound : playIncorrectSound)(); }} disabled={picked.length !== tokens.length} className="w-full mt-6">答え合わせ</Button> : retrying ? <div className="mt-5 rounded-xl bg-amber-50 p-4 text-left"><p className="font-bold text-amber-800">不正解。正解はまだ見せません（{attempts}/3回）</p><Button onClick={() => { setPicked([]); setRetrying(false); }} variant="secondary" className="w-full mt-3">もう一度並べる</Button></div> : <div className={`mt-5 rounded-xl p-4 text-left ${grammarCorrect ? 'bg-emerald-50' : 'bg-rose-50'}`}><p className={`font-bold ${grammarCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>{grammarCorrect ? '正解！' : `3回間違えました。正解：${current.answer}`}</p><p className="text-sm text-slate-600 mt-2">{current.note}</p>{!grammarCorrect && <Eiken4GrammarReference source={`${current.type} ${current.prompt} ${current.note}`} />}<Button onClick={() => finishItem(grammarCorrect)} className="w-full mt-4">次の問題</Button></div>}
      </div>}
    </section>
  </div>;
};
export default Grade1DailyReviewPage;
