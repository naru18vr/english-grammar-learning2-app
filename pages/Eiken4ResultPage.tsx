import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';
import { getQuestionById, loadDailyProgress } from '../services/eiken4DailyService';
import { getTodayReading, loadReadingProgress } from '../services/eiken4ReadingService';
import { loadGrade1Review } from '../services/grade1ReviewService';

const Eiken4ResultPage: React.FC = () => {
  const navigate = useNavigate(); const { result } = useEiken4Session();
  const daily = loadDailyProgress(); const readingProgress = loadReadingProgress(); const reading = getTodayReading();
  const grade1 = loadGrade1Review();
  const dailyCorrect = daily.answers.filter(answer => answer.correct).length;
  const readingCorrect = reading.questions.filter((item, index) => readingProgress.answers[index] === item.answer).length;
  const wrongKinds = Array.from(new Set(daily.answers.filter(answer => !answer.correct).map(answer => getQuestionById(answer.id, daily.date)?.kind).filter(Boolean)));
  const extraTotal = result.wordTotal + result.wordQuizTotal + result.sentenceTotal;

  return <div className="flex-grow flex flex-col p-4 max-w-xl mx-auto w-full">
    <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2" />英検4級に戻る</Button>
    <header className="mt-4 rounded-2xl bg-teal-600 text-white p-5 shadow-lg text-center"><p className="text-sm font-bold opacity-90">英検4級</p><h1 className="text-3xl font-bold mt-1">今日の結果</h1><p className="text-sm mt-2 opacity-90">{daily.date.replaceAll('-', '/')}</p></header>
    <section className="mt-4 rounded-xl bg-white shadow border border-emerald-100 p-5">
      <div className="flex justify-between items-center"><div><p className="text-sm font-bold text-emerald-700">今日の15分</p><h2 className="text-xl font-bold">単語・文法・リスニング・本番形式</h2></div><strong className="text-2xl text-emerald-700">{daily.answers.length ? `${dailyCorrect}/${daily.questionIds.length}` : '未実施'}</strong></div>
      <p className="text-sm text-slate-600 mt-2">{daily.completedAt ? '完了しました' : daily.answers.length ? `途中：${daily.answers.length}/${daily.questionIds.length}問` : 'まだ始めていません'}</p>
    </section>
    <section className="mt-3 rounded-xl bg-white shadow border border-sky-100 p-5">
      <div className="flex justify-between items-center"><div><p className="text-sm font-bold text-sky-700">今日のミニ長文・{reading.type}</p><h2 className="text-xl font-bold">{reading.title}</h2></div><strong className="text-2xl text-sky-700">{readingProgress.answers.length ? `${readingCorrect}/${reading.questions.length}` : '未実施'}</strong></div>
      <p className="text-sm text-slate-600 mt-2">{readingProgress.completedAt ? '完了しました' : readingProgress.answers.length ? `途中：${readingProgress.answers.length}/${reading.questions.length}問` : 'まだ始めていません'}</p>
    </section>
    <section className="mt-3 rounded-xl bg-white shadow border border-amber-200 p-5">
      <div className="flex justify-between items-center"><div><p className="text-sm font-bold text-amber-700">英検4級につながる中1基礎</p><h2 className="text-xl font-bold">単語3語＋文法3問</h2></div><strong className="text-2xl text-amber-700">{grade1.answers.length ? `${grade1.answers.filter(Boolean).length}/6` : '未実施'}</strong></div>
      <p className="text-sm text-slate-600 mt-2">{grade1.completedAt ? '完了しました' : grade1.answers.length ? `途中：${grade1.answers.length}/6問` : 'まだ始めていません'}</p>
    </section>
    <section className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-4"><h2 className="font-bold text-amber-900">今日の復習ポイント</h2><p className="text-sm text-amber-900 mt-2">{wrongKinds.length ? wrongKinds.join('・') : daily.completedAt ? '今日の15分はよくできました。' : '15分コースをするとここに表示されます。'}</p></section>
    {extraTotal > 0 && <section className="mt-3 rounded-xl bg-white shadow p-4"><h2 className="font-bold">追加練習</h2><div className="grid grid-cols-3 gap-2 text-center text-sm mt-3"><div className="bg-indigo-50 rounded p-2">単語カード<br/><strong>{result.wordKnown}/{result.wordTotal}</strong></div><div className="bg-indigo-50 rounded p-2">単語テスト<br/><strong>{result.wordQuizCorrect}/{result.wordQuizTotal}</strong></div><div className="bg-indigo-50 rounded p-2">並べ替え<br/><strong>{result.sentenceCorrect}/{result.sentenceTotal}</strong></div></div></section>}
    <p className="text-center text-sm font-semibold text-indigo-700 mt-4">この画面をスクショして、お母さんに送ろう</p>
    <div className="grid grid-cols-2 gap-2 mt-4"><Link to="/eiken4/word-map" className="text-center rounded-lg bg-indigo-100 text-indigo-800 font-semibold px-3 py-3">英単語マップ</Link><Link to="/eiken4/daily" className="text-center rounded-lg bg-emerald-600 text-white font-semibold px-3 py-3">今日の15分</Link></div>
  </div>;
};
export default Eiken4ResultPage;
