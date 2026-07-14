import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import ClockIcon from '../components/shared/ClockIcon';
import SparklesIcon from '../components/shared/SparklesIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import ChartBarIcon from '../components/shared/ChartBarIcon';

const dailySteps = [
  { number: '1', title: '「今日の15分」をする', text: '単語8問を含む全18問。間違えた問題は最後にもう一度出ます。', color: 'bg-emerald-500' },
  { number: '2', title: '「1日1題 ミニ長文」を読む', text: '短い英文を1つ読んで2問に答えます。終わったら和訳と答えの根拠を確認します。', color: 'bg-sky-500' },
  { number: '3', title: '「中1 単語・文法おさらい」をする', text: '英検4級で出やすい中1単語5語と文法並べ替え5問を約8分で確認します。頻出候補から毎日ランダムに出し、未定着問題を優先します。', color: 'bg-amber-500' },
  { number: '4', title: '時間があれば本番形式をする', text: '空所補充・会話・語句整序を10問。英検らしい問題に慣れます。', color: 'bg-rose-500' },
  { number: '週1', title: '10分ミニ模試に挑戦', text: '週末などに1回。途中では答えを見ず、単語・文法・聞き取り・長文をまとめて解きます。', color: 'bg-violet-600' },
];

const features = [
  { icon: BookOpenIcon, title: '単語を覚える', text: '単語カード、4択テスト、発音・例文の読み上げがあります。', color: 'text-indigo-600 bg-indigo-50' },
  { icon: SparklesIcon, title: '文法と語順を練習', text: '中1〜中3の学年別問題と、英検4級向けの並べ替え問題があります。', color: 'text-amber-600 bg-amber-50' },
  { icon: SpeakerWaveIcon, title: '英語を聞く', text: '会話を2回まで聞いて答えます。通常速度とゆっくり速度を選べます。', color: 'text-blue-600 bg-blue-50' },
  { icon: ClockIcon, title: '自動で復習', text: '間違えた問題は当日、翌日、3日後、7日後、14日後にもう一度出ます。', color: 'text-teal-600 bg-teal-50' },
  { icon: BookOpenIcon, title: '長文を読む', text: 'メール・日記・案内・会話などを読み、全文和訳と正解の根拠を確認できます。', color: 'text-sky-600 bg-sky-50' },
  { icon: ChartBarIcon, title: 'がんばりを確認', text: '試験までの日数、直近7日間の達成度、苦手分野、模試の点数を確認できます。', color: 'text-emerald-600 bg-emerald-50' },
];

const GuidePage: React.FC = () => {
  const navigate = useNavigate();
  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-2xl">
    <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="text-slate-600"><ArrowLeftIcon className="h-5 w-5 mr-2"/>前の画面に戻る</Button>
    <header className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 shadow-lg text-center">
      <p className="text-sm font-bold opacity-90">英検4級まで、毎日少しずつ</p>
      <h1 className="text-3xl font-bold mt-2">このアプリの使い方</h1>
      <p className="mt-3 text-sm leading-6 opacity-95">迷ったら「今日の学習コース」を開いて、上から順番に進めればOK！<br/>全部を一度にやらなくても大丈夫です。</p>
    </header>

    <section className="mt-6"><h2 className="text-2xl font-bold text-slate-800">毎日はこの順番</h2><div className="mt-4 space-y-3">
      {dailySteps.map(step => <div key={step.number} className="rounded-xl bg-white shadow border border-slate-100 p-4 flex gap-4"><div className={`${step.color} text-white h-12 min-w-12 px-2 rounded-full flex items-center justify-center font-bold`}>{step.number}</div><div><h3 className="font-bold text-lg text-slate-800">{step.title}</h3><p className="text-sm text-slate-600 mt-1 leading-6">{step.text}</p></div></div>)}
    </div></section>

    <section className="mt-8"><h2 className="text-2xl font-bold text-slate-800">できること</h2><div className="grid sm:grid-cols-2 gap-3 mt-4">
      {features.map(({icon:Icon,title,text,color}) => <div key={title} className="rounded-xl bg-white shadow border border-slate-100 p-4"><div className={`inline-flex rounded-full p-3 ${color}`}><Icon className="h-7 w-7"/></div><h3 className="font-bold text-lg mt-3">{title}</h3><p className="text-sm text-slate-600 mt-1 leading-6">{text}</p></div>)}
    </div></section>

    <section className="mt-8 rounded-xl bg-amber-50 border border-amber-200 p-5"><h2 className="font-bold text-amber-900 text-lg">続けるコツ</h2><ul className="mt-2 text-sm text-amber-900 leading-7 list-disc pl-5"><li>毎日全部できなくても、「今日の15分」だけはやる</li><li>分からなくても止まらず、答えと解説を読む</li><li>音が出ないときは端末の音量とChromeの音声設定を確認する</li><li>週に1回、学習ダッシュボードで苦手を確認する</li></ul></section>
    <section className="mt-4 rounded-xl bg-indigo-50 border border-indigo-200 p-5"><h2 className="font-bold text-indigo-900 text-lg">7/20〜8/16の夏休みノルマ</h2><p className="text-sm text-indigo-900 mt-2 leading-7">24日学習＋4日予備。曜日に関係なく、学習日は「中1おさらい10問→今日の15分（18問）→ミニ長文→単語カード8語→類似プリント」。休んでも未学習問題は次回へ持ち越されます。予備日を使わなかった日は復習またはミニ模試にします。</p></section>
    <Button onClick={() => navigate('/eiken4')} className="w-full mt-6">英検4級の学習を始める</Button>
  </div>;
};
export default GuidePage;
