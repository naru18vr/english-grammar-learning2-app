import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { eiken4Words } from '../data/eiken4Words';
import { recordWordMastery } from '../services/eiken4WordMasteryService';
import { speakText } from '../services/speechService';

type Mode = 'ja-en' | 'blank' | 'audio' | 'spell' | 'past';
const modes: [Mode, string, string][] = [
  ['ja-en', '日本語 → 英語', '意味から英単語を選ぶ'], ['blank', '例文の空所', '文に合う単語を選ぶ'],
  ['audio', '聞いて選ぶ', '発音を聞いて選ぶ'], ['spell', 'スペル並べ替え', '文字の順番を確認'], ['past', '不規則動詞', '不規則動詞だけを確認'],
];
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - .5);
const irregular = eiken4Words.filter(word => word.category === '不規則動詞');

const Eiken4WordChallengePage: React.FC = () => {
  const navigate = useNavigate(); const [mode, setMode] = useState<Mode | null>(null); const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(''); const [checked, setChecked] = useState(false); const [score, setScore] = useState(0);
  const words = useMemo(() => shuffle(mode === 'past' ? irregular : eiken4Words).slice(0, 10), [mode]); const current = words[index];
  const choices = useMemo(() => current ? shuffle([current, ...shuffle((mode === 'past' ? irregular : eiken4Words).filter(word => word.id !== current.id)).slice(0, 3)]) : [], [current, mode]);
  if (!mode) return <div className="flex-grow bg-slate-50 p-4"><div className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5" />戻る</Button><header className="mt-4 rounded-3xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 p-6 text-white"><p className="text-sm font-bold opacity-80">意味を選ぶだけで終わらない</p><h1 className="mt-1 text-3xl font-extrabold">単語5方向テスト</h1></header><div className="mt-4 grid grid-cols-2 gap-3">{modes.map(([id, title, detail]) => <button key={id} onClick={() => setMode(id)} className="rounded-2xl bg-white p-4 text-left shadow ring-1 ring-slate-200"><p className="text-xs font-bold text-fuchsia-600">10問</p><h2 className="mt-1 font-extrabold">{title}</h2><p className="mt-1 text-xs text-slate-500">{detail}</p></button>)}</div></div></div>;
  if (index >= words.length) return <div className="flex-grow bg-slate-50 p-4"><section className="mx-auto mt-10 max-w-xl rounded-3xl bg-white p-7 text-center shadow"><p className="font-bold text-fuchsia-600">テスト完了</p><h1 className="mt-2 text-4xl font-extrabold">{score}/10</h1><Button onClick={() => { setMode(null); setIndex(0); setScore(0); }} className="mt-6 w-full">別の形式へ</Button></section></div>;
  const answer = current.word;
  const prompt = mode === 'ja-en' ? current.meaning : mode === 'blank' ? current.example.replace(new RegExp(current.word, 'i'), '（　　）') : mode === 'spell' ? `${shuffle(current.word.split('')).join(' ・ ')} を正しく並べると？` : mode === 'past' ? `${current.meaning}：正しい不規則動詞は？` : '音声を聞いて選ぼう';
  return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl rounded-3xl bg-white p-5 shadow"><div className="flex justify-between text-sm font-bold text-fuchsia-600"><span>{modes.find(item => item[0] === mode)?.[1]}</span><span>{index + 1}/10</span></div>{mode === 'audio' && <button onClick={() => speakText(current.word, 'en-US', .8)} className="mt-5 flex w-full items-center justify-center rounded-xl bg-indigo-600 py-4 font-bold text-white"><SpeakerWaveIcon className="mr-2 h-5 w-5" />発音を聞く</button>}<h1 className="mt-5 text-xl font-bold">{prompt}</h1><div className="mt-4 space-y-2">{choices.map((word, choiceIndex) => <button disabled={checked} key={word.id} onClick={() => setSelected(word.word)} className={`w-full rounded-xl border p-4 text-left font-bold ${checked && word.word === answer ? 'border-emerald-400 bg-emerald-50' : selected === word.word ? 'border-fuchsia-400 bg-fuchsia-50' : 'border-slate-200'}`}>{choiceIndex + 1}. {word.word}</button>)}</div>{checked && <div className={`mt-4 rounded-xl p-4 ${selected === answer ? 'bg-emerald-50' : 'bg-rose-50'}`}><b>{selected === answer ? '正解！' : `正解：${answer}`}</b><p className="mt-2 text-sm">{current.example}</p></div>}<Button disabled={!selected} onClick={() => { if (!checked) { const correct = selected === answer; setChecked(true); recordWordMastery(current.id, correct); if (correct) setScore(score + 1); } else { setIndex(index + 1); setSelected(''); setChecked(false); } }} className="mt-5 w-full">{checked ? '次へ' : '答える'}</Button></main></div>;
};
export default Eiken4WordChallengePage;
