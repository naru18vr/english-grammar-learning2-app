import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import { getQuestionById } from '../services/eiken4DailyService';
import { downloadDailyWorksheet, parseWorksheetShareData } from '../services/eiken4WorksheetService';

const Eiken4WorksheetPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const shared = useMemo(() => parseWorksheetShareData(params.get('data')), [params]);
  const [status, setStatus] = useState<'idle' | 'making' | 'error'>('idle');

  if (!shared) return <div className="flex-grow container mx-auto p-4 max-w-xl"><div className="mt-12 rounded-2xl bg-white shadow-xl p-7 text-center"><h1 className="text-2xl font-bold text-slate-800">リンクを読み込めませんでした</h1><p className="text-slate-600 mt-3">Google Chatのリンクを最後まで選んで、もう一度開いてください。</p><Button onClick={() => navigate('/eiken4')} className="w-full mt-6">英検4級ホームへ</Button></div></div>;

  const { progress, reading, grade1 } = shared;
  const correct = progress.answers.filter(answer => answer.correct).length;
  const weakKinds = Array.from(new Set(progress.answers.filter(answer => !answer.correct).map(answer => getQuestionById(answer.id, progress.date)?.kind).filter(Boolean)));
  const download = async () => {
    setStatus('making');
    try { await downloadDailyWorksheet(progress, reading, grade1); setStatus('idle'); }
    catch { setStatus('error'); }
  };

  return <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-xl">
    <div className="mt-8 rounded-2xl bg-white shadow-xl border border-emerald-100 p-7 text-center">
      <CheckCircleIcon className="h-16 w-16 text-emerald-500 mx-auto" />
      <p className="text-emerald-700 font-bold mt-3">今日の15分 完了報告</p>
      <h1 className="text-4xl font-bold text-slate-800 mt-2">{correct} / {progress.questionIds.length}問</h1>
      <p className="text-slate-500 mt-2">{progress.date.replaceAll('-', '/')}</p>
      {reading && <p className="text-sky-700 font-bold mt-2">ミニ長文も完了済み・類似長文つき</p>}
      {!reading && <p className="text-sky-700 font-bold mt-2">復習用の類似長文つき</p>}
      <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
        <p className="font-bold text-amber-900">復習する分野</p>
        <p className="text-sm text-amber-900 mt-1">{weakKinds.length ? weakKinds.join('・') : '全問正解です。今日の範囲をもう一度定着させます。'}</p>
      </div>
      <Button onClick={download} disabled={status === 'making'} className="w-full mt-6">{status === 'making' ? 'PDFを作成中…' : '今日の類題プリントPDF'}</Button>
      {status === 'error' && <p className="text-sm text-rose-700 font-bold mt-3">PDFを作れませんでした。Chromeで開き直してお試しください。</p>}
      <Button onClick={() => navigate('/')} variant="ghost" className="w-full mt-2">アプリのホームを見る</Button>
    </div>
  </div>;
};

export default Eiken4WorksheetPage;
