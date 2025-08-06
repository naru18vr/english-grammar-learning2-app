import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSentenceMistakeCount } from '../localStorageService';
import { Grade, Unit, Sentence } from '../types';
import Button from '../components/Button';
import HomeIcon from '../components/shared/HomeIcon';

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

  useEffect(() => {
    if (location.state?.reportData) {
      const data = location.state.reportData as ReportData;
      setReportData(data);

      const counts: Record<string, number> = {};
      data.sentences.forEach(sentence => {
        const mistakeCount = getSentenceMistakeCount(data.grade.id, data.unit.id, sentence.id);
        counts[sentence.id] = mistakeCount;
      });
      setMistakeCounts(counts);

    } else {
      // Redirect if no data
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!reportData) {
    return <div className="text-center p-8">レポートデータを読み込み中...</div>;
  }

  const { sentences, date, title, elapsedTimeInSeconds } = reportData;

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

        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-700 mb-2 text-center">問題ごとの間違い回数</h2>
          <div className="space-y-1.5">
            {sentences.map((sentence, index) => (
              <div key={sentence.id} className="bg-slate-50 p-2 rounded-md flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-400 mr-3">{index + 1}</span>
                <p className="text-slate-700 flex-grow truncate mr-2" title={sentence.japaneseQuestion}>
                  {sentence.japaneseQuestion}
                </p>
                <div className={`ml-auto text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${mistakeCounts[sentence.id] > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {mistakeCounts[sentence.id] > 0 ? `${mistakeCounts[sentence.id]} 回` : 'クリア'}
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