import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';

const formatDate = (iso?: string) => {
  const date = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const Eiken4ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { result } = useEiken4Session();
  const total = result.wordTotal + result.wordQuizTotal + result.sentenceTotal;
  const correct = result.wordKnown + result.wordQuizCorrect + result.sentenceCorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const weakPoints = result.weakPoints.slice(0, 3);

  return (
    <div className="flex-grow flex flex-col p-4 max-w-md mx-auto w-full">
      <header className="mb-3 print:hidden">
        <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          英検4級に戻る
        </Button>
      </header>

      <main className="flex-grow flex items-center">
        <section className="w-full bg-white rounded-xl shadow-xl border border-indigo-100 p-5">
          <div className="text-center border-b border-slate-200 pb-4 mb-4">
            <p className="text-sm font-semibold text-indigo-600">英検4級</p>
            <h1 className="text-2xl font-bold text-slate-800">今日の学習結果</h1>
            <p className="text-sm text-slate-500 mt-1">{formatDate(result.startedAt)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg bg-indigo-50 p-3 text-center">
              <p className="text-xs text-slate-500">学習時間</p>
              <p className="text-2xl font-bold text-indigo-700">{result.durationMinutes || 0}分</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-center">
              <p className="text-xs text-slate-500">正答率</p>
              <p className="text-2xl font-bold text-amber-700">{accuracy}%</p>
            </div>
          </div>

          <div className="space-y-2 text-slate-700 mb-4">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <div className="flex justify-between">
                <span>単語カード</span>
                <strong>{result.wordTotal ? `${result.wordTotal}語確認` : '未実施'}</strong>
              </div>
              {result.wordTotal > 0 && (
                <div className="flex justify-between text-sm text-slate-600 mt-1">
                  <span>自己判定</span>
                  <strong>{result.wordKnown}語できた</strong>
                </div>
              )}
            </div>
            <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>確認テスト</span>
              <strong>{result.wordQuizTotal ? `${result.wordQuizTotal}問中${result.wordQuizCorrect}問正解` : '未実施'}</strong>
            </div>
            <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>並べ替え</span>
              <strong>{result.sentenceTotal ? `${result.sentenceTotal}問中${result.sentenceCorrect}問正解` : '未実施'}</strong>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 mb-4">
            <h2 className="text-sm font-bold text-slate-700 mb-2">復習ポイント</h2>
            {weakPoints.length > 0 ? (
              <ul className="space-y-1 text-sm text-slate-700">
                {weakPoints.map(point => (
                  <li key={point}>・{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">今日はよくできました。</p>
            )}
          </div>

          <p className="text-center text-sm font-semibold text-indigo-700">
            この画面をスクショして、お母さんに送ろう
          </p>
        </section>
      </main>

      <footer className="grid grid-cols-2 gap-3 mt-3 print:hidden">
        <Link to="/eiken4/words" className="text-center rounded-lg bg-slate-200 text-slate-800 font-semibold px-3 py-2">
          単語へ
        </Link>
        <Link to="/eiken4/sentences" className="text-center rounded-lg bg-blue-600 text-white font-semibold px-3 py-2">
          並べ替えへ
        </Link>
      </footer>
    </div>
  );
};

export default Eiken4ResultPage;
