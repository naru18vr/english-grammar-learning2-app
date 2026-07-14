import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSentenceMistakeCount } from '../localStorageService';
import { Grade, Unit, Sentence } from '../types';
import Button from '../components/Button';
import HomeIcon from '../components/shared/HomeIcon';
import { formatReviewDate, getMasteryLevel, getSentenceLearningRecord, getWeaknessSummary, SentenceLearningRecord } from '../services/sentenceLearningService';

interface ReportData {
  grade: Grade;
  unit: Unit;
  setIndex: number;
  sentences: Sentence[];
  date: string;
  title: string;
  elapsedTimeInSeconds?: number;
}

const formatTime = (totalSeconds: number): string => {
  if (totalSeconds < 60) {
    return `${totalSeconds}秒`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分${seconds}秒`;
};

const ResultReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [mistakeCounts, setMistakeCounts] = useState<Record<string, number>>({});
  const [learningRecords, setLearningRecords] = useState<Record<string, SentenceLearningRecord | undefined>>({});

  useEffect(() => {
    if (location.state?.reportData) {
      const data = location.state.reportData as ReportData;
      setReportData(data);

      const counts: Record<string, number> = {};
      const records: Record<string, SentenceLearningRecord | undefined> = {};
      data.sentences.forEach(sentence => {
        const mistakeCount = getSentenceMistakeCount(data.grade.id, data.unit.id, sentence.id);
        counts[sentence.id] = mistakeCount;
        records[sentence.id] = getSentenceLearningRecord(data.grade.id, data.unit.id, sentence.id);
      });
      setMistakeCounts(counts);
      setLearningRecords(records);

    } else {
      // Redirect if no data
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!reportData) {
    return <div className="text-center p-8">レポートデータを読み込み中...</div>;
  }

  const { sentences, date, title, elapsedTimeInSeconds } = reportData;
  const records = sentences.map(sentence => learningRecords[sentence.id]);
  const weaknessSummary = getWeaknessSummary(records);
  const learned = records.filter(Boolean).length;
  const mastered = records.filter(record => getMasteryLevel(record) === '定着').length;
  const nextReview = records.map(record => record?.nextReview).filter((value): value is string => Boolean(value)).sort()[0];

  return (
    <div className="bg-slate-100 min-h-screen p-2 sm:p-4 flex flex-col items-center font-sans">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 my-auto">
        <header className="text-center mb-4 border-b pb-3">
          <h1 className="text-xl font-bold text-slate-800">学習結果</h1>
          <p className="text-gray-600 text-base mt-1">{title}</p>
          <div className="flex justify-center items-center gap-4 text-xs text-slate-500 mt-2">
            <span>
              {new Date(date).toLocaleString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            {elapsedTimeInSeconds !== undefined && (
              <span className="font-semibold bg-slate-200 px-2 py-1 rounded">
                かかった時間: {formatTime(elapsedTimeInSeconds)}
              </span>
            )}
          </div>
        </header>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="rounded-lg bg-blue-50 p-2"><p className="text-xs text-blue-700">学習</p><strong className="text-blue-900">{learned}/{sentences.length}</strong></div>
          <div className="rounded-lg bg-emerald-50 p-2"><p className="text-xs text-emerald-700">定着</p><strong className="text-emerald-900">{mastered}問</strong></div>
          <div className="rounded-lg bg-amber-50 p-2"><p className="text-xs text-amber-700">次の復習</p><strong className="text-amber-900 text-xs">{formatReviewDate(nextReview)}</strong></div>
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-4">
          <h2 className="font-bold text-amber-900">苦手ポイント</h2>
          <p className="text-sm text-amber-800 mt-1">{weaknessSummary.length ? weaknessSummary.slice(0, 3).map(([name, count]) => `${name}（${count}回）`).join('・') : '今回の間違いはありません。'}</p>
          <p className="text-xs text-amber-700 mt-2">復習は翌日→3日後→7日後→14日後の順で判定します。</p>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-700 mb-2 text-center">問題ごとの間違い回数</h2>
          <div className="space-y-1.5">
            {sentences.map((sentence, index) => (
              <div key={sentence.id} className="bg-slate-50 p-2 rounded-md flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-400 mr-3">{index + 1}</span>
                <p className="text-slate-700 flex-grow truncate mr-2" title={sentence.japaneseQuestion}>
                  {sentence.japaneseQuestion}
                </p>
                <div className="ml-auto text-right whitespace-nowrap">
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${mistakeCounts[sentence.id] > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {getMasteryLevel(learningRecords[sentence.id])}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{formatReviewDate(learningRecords[sentence.id]?.nextReview)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-6 pt-3 border-t text-center">
          <Button onClick={() => navigate('/')} variant="primary">
            <HomeIcon className="w-5 h-5 mr-2" />
            ホームに戻る
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default ResultReportPage;
