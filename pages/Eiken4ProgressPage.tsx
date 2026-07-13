import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import ChartBarIcon from '../components/shared/ChartBarIcon';
import { getReviewCategoryCounts, loadDailyProgress } from '../services/eiken4DailyService';
import { loadReadingProgress } from '../services/eiken4ReadingService';
import { loadMockResult, weekKey } from '../services/eiken4MockService';
import { calculateStreak, daysUntilExam, getExamDate, lastSevenDays, loadActivityLog, saveExamDate } from '../services/eiken4ProgressService';

const Eiken4ProgressPage: React.FC = () => {
  const navigate = useNavigate(); const [examDate, setExamDate] = useState(getExamDate);
  const daily = loadDailyProgress(); const reading = loadReadingProgress(); const mock = loadMockResult();
  const log = useMemo(loadActivityLog, [daily.completedAt, reading.completedAt, mock?.completedAt]);
  const days = lastSevenDays(); const dailyDays = days.filter(date => log[date]?.daily).length; const readingDays = days.filter(date => log[date]?.reading).length;
  const mockDone = mock?.week === weekKey(); const readiness = Math.round((dailyDays / 7) * 50 + (readingDays / 7) * 25 + (mockDone ? 25 : 0));
  const weak = Object.entries(getReviewCategoryCounts()).sort((a, b) => b[1] - a[1]); const remaining = daysUntilExam(examDate);
  const updateDate = (value: string) => { setExamDate(value); saveExamDate(value); };
  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-2xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2"/>英検4級に戻る</Button>
    <header className="mt-4 rounded-2xl bg-teal-600 text-white p-6 shadow-lg"><div className="flex items-center"><ChartBarIcon className="h-9 w-9 mr-3"/><div><p className="text-sm font-bold opacity-90">英検4級</p><h1 className="text-3xl font-bold">学習ダッシュボード</h1></div></div><div className="mt-5 rounded-xl bg-white/15 p-4 text-center"><p className="text-sm">試験まで</p><p className="text-5xl font-bold mt-1">{remaining >= 0 ? `${remaining}日` : '終了'}</p><label className="block text-xs mt-3">試験日 <input type="date" value={examDate} onChange={e => updateDate(e.target.value)} className="ml-2 rounded text-slate-800 px-2 py-1"/></label></div></header>
    <section className="mt-4 rounded-xl bg-white shadow p-5"><div className="flex justify-between"><h2 className="font-bold text-slate-800">直近7日間の準備度</h2><span className="text-2xl font-bold text-teal-700">{readiness}%</span></div><div className="h-4 bg-slate-200 rounded-full mt-3 overflow-hidden"><div className="h-full bg-teal-500" style={{width:`${readiness}%`}}/></div><div className="grid grid-cols-3 gap-2 mt-4 text-center"><div className="bg-indigo-50 rounded-lg p-3"><p className="text-xs">毎日学習</p><p className="font-bold">{dailyDays}/7日</p></div><div className="bg-sky-50 rounded-lg p-3"><p className="text-xs">ミニ長文</p><p className="font-bold">{readingDays}/7日</p></div><div className="bg-violet-50 rounded-lg p-3"><p className="text-xs">週模試</p><p className="font-bold">{mockDone ? '完了' : '未実施'}</p></div></div><p className="text-sm text-slate-600 mt-3">連続学習：<strong>{calculateStreak(log)}日</strong></p></section>
    <section className="mt-4 rounded-xl bg-white shadow p-5"><h2 className="font-bold text-slate-800">復習中の苦手分野</h2>{weak.length ? <div className="mt-3 space-y-3">{weak.map(([name,count]) => <div key={name}><div className="flex justify-between text-sm"><span>{name}</span><strong>{count}問</strong></div><div className="h-2 bg-slate-100 rounded mt-1"><div className="h-full bg-amber-500 rounded" style={{width:`${Math.min(100,count*12)}%`}}/></div></div>)}</div> : <p className="text-sm text-emerald-700 mt-3">現在、復習待ちの問題はありません。</p>}</section>
    <section className="mt-4 rounded-xl bg-white shadow p-5"><h2 className="font-bold">今週のミニ模試</h2>{mock ? <p className="mt-2 text-2xl font-bold text-violet-700">{mock.score} / {mock.total}問</p> : <p className="text-sm text-slate-500 mt-2">まだ受けていません。</p>}<Button onClick={() => navigate('/eiken4/mock')} className="w-full mt-4">10分ミニ模試へ</Button></section>
    <p className="text-xs text-slate-500 text-center mt-4">学習履歴はこの端末に保存されます。集計は本機能の公開後から始まります。</p>
  </div>;
};
export default Eiken4ProgressPage;
