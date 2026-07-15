import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import ChartBarIcon from '../components/shared/ChartBarIcon';
import { getReviewCategoryCounts, loadDailyProgress } from '../services/eiken4DailyService';
import { loadReadingProgress } from '../services/eiken4ReadingService';
import { loadMockHistory, loadMockResult, weekKey } from '../services/eiken4MockService';
import { calculateStreak, daysUntilExam, getExamDate, lastSevenDays, loadActivityLog, recordEiken4Activity, saveExamDate } from '../services/eiken4ProgressService';
import { loadFullMockResults, loadPastPaperResults } from '../services/eiken4ExamPrepService';
import { loadWordMastery, masteryLevel } from '../services/eiken4WordMasteryService';
import { eiken4Words } from '../data/eiken4Words';
import { createTransfer } from '../services/learningTransferService';

const Eiken4ProgressPage: React.FC = () => {
  const navigate = useNavigate(); const [examDate, setExamDate] = useState(getExamDate);
  const daily = loadDailyProgress(); const reading = loadReadingProgress(); const mock = loadMockResult();
  const [log, setLog] = useState(loadActivityLog);
  useEffect(() => {
    if (daily.completedAt) recordEiken4Activity('daily', daily.date);
    if (reading.completedAt) recordEiken4Activity('reading', reading.date);
    if (mock?.completedAt) recordEiken4Activity('mock', mock.completedAt.slice(0, 10));
    setLog(loadActivityLog());
  }, [daily.completedAt, reading.completedAt, mock?.completedAt]);
  const days = lastSevenDays(); const dailyDays = days.filter(date => log[date]?.daily).length; const readingDays = days.filter(date => log[date]?.reading).length;
  const mockDone = mock?.week === weekKey(); const readiness = Math.round((dailyDays / 7) * 50 + (readingDays / 7) * 25 + (mockDone ? 25 : 0));
  const weak = Object.entries(getReviewCategoryCounts()).sort((a, b) => b[1] - a[1]); const remaining = daysUntilExam(examDate);
  const updateDate = (value: string) => { setExamDate(value); saveExamDate(value); };
  const history = loadMockHistory().slice(-5).reverse();
  const fullHistory = loadFullMockResults(); const pastHistory = loadPastPaperResults();
  const recentScores = [...fullHistory.map(item => ({ date:item.date, reading:item.reading, listening:item.listening, source:'フル模試' })), ...pastHistory.map(item => ({ date:item.date, reading:item.reading, listening:item.listening, source:item.label }))].slice(-8);
  const lastThree = recentScores.slice(-3); const readingAverage = lastThree.length ? Math.round(lastThree.reduce((sum,item)=>sum+item.reading,0)/lastThree.length) : 0; const listeningAverage = lastThree.length ? Math.round(lastThree.reduce((sum,item)=>sum+item.listening,0)/lastThree.length) : 0;
  const mastery = loadWordMastery(); const masteredWords = eiken4Words.filter(word => masteryLevel(mastery[word.id]) === 'mastered').length; const wordRate = Math.round(masteredWords/eiken4Words.length*100);
  const abilityScore = Math.round((wordRate*.25)+(readingAverage/35*100*.4)+(listeningAverage/30*100*.35)); const abilityLabel = lastThree.length < 2 ? '判定には模試があと2回必要' : abilityScore >= 80 ? '安全圏' : abilityScore >= 70 ? '合格圏' : 'まだ練習';
  const daysForStudy = Math.max(1, remaining); const wordsPerDay = Math.max(3, Math.ceil((eiken4Words.length-masteredWords)/daysForStudy)); const priority = readingAverage && listeningAverage ? (readingAverage/35 < listeningAverage/30 ? 'リーディング' : 'リスニング') : weak[0]?.[0] || '毎日のコース';
  const transfer = createTransfer();
  const weeklyMessage = `英検4級 週間報告\n学習：${dailyDays}/7日　長文：${readingDays}/7日\n単語：${masteredWords}/${eiken4Words.length}語\n模試平均：読解 ${readingAverage}/35・聞く ${listeningAverage}/30\n判定：${abilityLabel}\n今週の優先：${priority}\n引き継ぎ番号：${transfer.code}\nスマホ・タブレット引き継ぎリンク\n${transfer.link}`;
  const copyReport = async () => { try { await navigator.clipboard.writeText(weeklyMessage); alert('週間報告をコピーしました！'); } catch { window.prompt('下の文章をコピーしてください', weeklyMessage); } };
  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-2xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2"/>英検4級に戻る</Button>
    <header className="mt-4 rounded-2xl bg-teal-600 text-white p-6 shadow-lg"><div className="flex items-center"><ChartBarIcon className="h-9 w-9 mr-3"/><div><p className="text-sm font-bold opacity-90">英検4級</p><h1 className="text-3xl font-bold">学習ダッシュボード</h1></div></div><div className="mt-5 rounded-xl bg-white/15 p-4 text-center"><p className="text-sm">試験まで</p><p className="text-5xl font-bold mt-1">{remaining >= 0 ? `${remaining}日` : '終了'}</p><label className="block text-xs mt-3">試験日 <input type="date" value={examDate} onChange={e => updateDate(e.target.value)} className="ml-2 rounded text-slate-800 px-2 py-1"/></label></div></header>
    <section className="mt-4 rounded-xl bg-white shadow p-5"><div className="flex justify-between"><h2 className="font-bold text-slate-800">直近7日間の準備度</h2><span className="text-2xl font-bold text-teal-700">{readiness}%</span></div><div className="h-4 bg-slate-200 rounded-full mt-3 overflow-hidden"><div className="h-full bg-teal-500" style={{width:`${readiness}%`}}/></div><div className="grid grid-cols-3 gap-2 mt-4 text-center"><div className="bg-indigo-50 rounded-lg p-3"><p className="text-xs">毎日学習</p><p className="font-bold">{dailyDays}/7日</p></div><div className="bg-sky-50 rounded-lg p-3"><p className="text-xs">ミニ長文</p><p className="font-bold">{readingDays}/7日</p></div><div className="bg-violet-50 rounded-lg p-3"><p className="text-xs">週模試</p><p className="font-bold">{mockDone ? '完了' : '未実施'}</p></div></div><p className="text-sm text-slate-600 mt-3">連続学習：<strong>{calculateStreak(log)}日</strong></p></section>
    <section className="mt-4 rounded-xl bg-white shadow p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-teal-600">実力から判定</p><h2 className="mt-1 text-xl font-extrabold">{abilityLabel}</h2></div><span className="text-3xl font-extrabold text-teal-700">{abilityScore}%</span></div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded-lg bg-indigo-50 p-2">単語<br/><b>{wordRate}%</b></div><div className="rounded-lg bg-rose-50 p-2">読解<br/><b>{readingAverage}/35</b></div><div className="rounded-lg bg-sky-50 p-2">聞く<br/><b>{listeningAverage}/30</b></div></div><p className="mt-3 text-sm text-slate-600">今週の優先：<b>{priority}</b></p></section>
    <section className="mt-4 rounded-xl bg-white shadow p-5"><h2 className="font-bold">今日の自動ノルマ</h2><p className="mt-2 text-sm text-slate-600">試験まで{remaining}日。未習得{eiken4Words.length-masteredWords}語から計算しています。</p><div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded-lg bg-amber-50 p-3">単語<br/><b>{wordsPerDay}語</b></div><div className="rounded-lg bg-emerald-50 p-3">毎日<br/><b>18問</b></div><div className="rounded-lg bg-sky-50 p-3">長文<br/><b>1題</b></div></div></section>
    <section className="mt-4 rounded-xl bg-white shadow p-5"><h2 className="font-bold text-slate-800">復習中の苦手分野</h2>{weak.length ? <div className="mt-3 space-y-3">{weak.map(([name,count]) => <div key={name}><div className="flex justify-between text-sm"><span>{name}</span><strong>{count}問</strong></div><div className="h-2 bg-slate-100 rounded mt-1"><div className="h-full bg-amber-500 rounded" style={{width:`${Math.min(100,count*12)}%`}}/></div></div>)}</div> : <p className="text-sm text-emerald-700 mt-3">現在、復習待ちの問題はありません。</p>}</section>
    <section className="mt-4 rounded-xl bg-white shadow p-5"><h2 className="font-bold">ミニ模試の履歴</h2>{history.length ? <div className="mt-3 space-y-2">{history.map((item, index) => <div key={`${item.completedAt}-${index}`} className="flex justify-between rounded-lg bg-violet-50 p-3 text-sm"><span>{new Date(item.completedAt).toLocaleDateString('ja-JP')}</span><strong>{item.score} / {item.total}問</strong></div>)}</div> : <p className="text-sm text-slate-500 mt-2">まだ受けていません。</p>}<Button onClick={() => navigate('/eiken4/mock')} className="w-full mt-4">10分ミニ模試へ</Button></section>
    <section className="mt-4 rounded-xl bg-white shadow p-5"><h2 className="font-bold">フル模試・過去問の推移</h2>{recentScores.length?<div className="mt-3 space-y-2">{recentScores.slice().reverse().map((item,index)=><div key={`${item.date}-${index}`} className="rounded-lg bg-slate-50 p-3"><div className="flex justify-between text-sm"><span>{item.date}・{item.source}</span><b>{item.reading+item.listening}/65</b></div><div className="mt-2 flex h-2 overflow-hidden rounded-full bg-slate-200"><div className="bg-rose-500" style={{width:`${item.reading/65*100}%`}}/><div className="bg-indigo-500" style={{width:`${item.listening/65*100}%`}}/></div></div>)}</div>:<p className="mt-2 text-sm text-slate-500">まだ記録がありません。</p>}<div className="mt-3 grid grid-cols-2 gap-2"><Button onClick={()=>navigate('/eiken4/full-mock')}>フル模試</Button><Button onClick={()=>navigate('/eiken4/past-papers')} variant="secondary">過去問記録</Button></div></section>
    <section className="mt-4 rounded-xl bg-amber-50 p-5"><h2 className="font-bold text-amber-900">保護者向け週間報告</h2><pre className="mt-3 whitespace-pre-wrap rounded-lg bg-white p-3 text-xs text-slate-700">{weeklyMessage}</pre><Button onClick={copyReport} className="mt-3 w-full">週間報告をコピー</Button></section>
    <p className="text-xs text-slate-500 text-center mt-4">学習履歴はこの端末に保存されます。集計は本機能の公開後から始まります。</p>
  </div>;
};
export default Eiken4ProgressPage;
