import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DailyLogEntry, getDailyLog, clearAllProgressData } from '../localStorageService';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import SparklesIcon from '../components/shared/SparklesIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';

interface GroupedLogs {
  [dateKey: string]: DailyLogEntry[];
}

const groupLogByDateKey = (log: DailyLogEntry[]): GroupedLogs => {
  return log.reduce((acc, entry) => {
    const d = new Date(entry.timestamp);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as GroupedLogs);
};

const formatTime = (totalSeconds: number): string => {
  if (totalSeconds < 60) {
    return `${totalSeconds}秒`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分${seconds}秒`;
};


const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [log, setLog] = useState<DailyLogEntry[]>([]);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const loadLog = () => {
    const dailyLog = getDailyLog();
    dailyLog.sort((a, b) => b.timestamp - a.timestamp);
    setLog(dailyLog);
  };

  useEffect(() => {
    loadLog();
  }, []);
  
  useEffect(() => {
    let timeoutId: number;
    if (confirmingReset) {
      timeoutId = window.setTimeout(() => {
        setConfirmingReset(false);
      }, 3000); // Reset confirmation after 3 seconds
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [confirmingReset]);

  const handleResetAllData = () => {
    if (confirmingReset) {
      clearAllProgressData();
      loadLog(); 
      setConfirmingReset(false); 
    } else {
      setConfirmingReset(true);
    }
  };

  const getLinkDestination = (entry: DailyLogEntry): string => {
    if (entry.source === 'random-challenge' || entry.source === 'ai-options') {
      return '/'; // Go home for these as the challenge is not saved
    }
    return `/grade/${entry.gradeId}/unit/${entry.unitId}/set/${entry.setIndex}`;
  };

  const groupedByDay = groupLogByDateKey(log);
  const sortedDays = Object.keys(groupedByDay).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sections: { title: string; days: string[] }[] = [];
  const sectionMap: { [key: string]: string[] } = {
    '今日': [],
    '昨日': [],
    '先週の記録': [],
    '先月の記録': [],
    'それ以前': [],
  };

  sortedDays.forEach(dayKey => {
    const entryDate = new Date(dayKey);
    const diffDays = (today.getTime() - entryDate.getTime()) / (1000 * 3600 * 24);

    if (diffDays < 1) sectionMap['今日'].push(dayKey);
    else if (diffDays < 2) sectionMap['昨日'].push(dayKey);
    else if (diffDays <= 7) sectionMap['先週の記録'].push(dayKey);
    else if (diffDays <= 30) sectionMap['先月の記録'].push(dayKey);
    else sectionMap['それ以前'].push(dayKey);
  });
  
  for (const [title, days] of Object.entries(sectionMap)) {
    if (days.length > 0) {
      sections.push({ title, days });
    }
  }


  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-800">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          ホームに戻る
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">毎日の記録</h1>
            {log.length > 0 && (
                <Button 
                  onClick={handleResetAllData} 
                  variant="danger" 
                  size="sm"
                  className={confirmingReset ? 'bg-red-700 hover:bg-red-800 focus:ring-red-500' : ''}
                >
                  {confirmingReset ? '本当にリセットしますか？' : 'すべての記録をリセット'}
                </Button>
            )}
        </div>
      </header>

      <main>
        {log.length === 0 ? (
          <div className="text-center text-slate-500 py-10 bg-white rounded-lg shadow-md">
            <p className="text-lg">学習の記録はまだありません。</p>
            <p className="mt-2">さっそく学習を始めて、記録を残しましょう！</p>
            <Button onClick={() => navigate('/')} variant="primary" className="mt-6">学習を始める</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map(section => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-slate-700 pb-2 mb-4 border-b-2 border-slate-200">{section.title}</h2>
                <div className="space-y-5">
                  {section.days.map(dayKey => {
                    const entries = groupedByDay[dayKey];
                    const totalTime = entries.reduce((sum, e) => sum + (e.elapsedTimeInSeconds || 0), 0);
                    const displayDate = new Date(dayKey).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });

                    return (
                      <div key={dayKey}>
                        <div className="flex justify-between items-baseline mb-2">
                          <h3 className="font-semibold text-slate-600">{displayDate}</h3>
                          {totalTime > 0 && (
                            <p className="text-sm font-bold text-slate-500">合計: {formatTime(totalTime)}</p>
                          )}
                        </div>
                        <ul className="space-y-3 pl-2 border-l-2 border-slate-200">
                          {entries.map(entry => (
                            <li key={entry.timestamp}>
                              <Link 
                                to={getLinkDestination(entry)} 
                                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200"
                              >
                                <div className="mr-4 text-slate-400">
                                  {entry.source.includes('challenge') || entry.source.includes('ai') ? <SparklesIcon className="w-6 h-6 text-amber-500" /> : <BookOpenIcon className="w-6 h-6 text-sky-500" />}
                                </div>
                                <div className="flex-grow">
                                  <p className="font-semibold text-slate-800">{entry.title}</p>
                                  <p className="text-xs text-slate-500">
                                    {new Date(entry.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                    {entry.elapsedTimeInSeconds !== undefined && (
                                      <span className="ml-2 font-medium">({formatTime(entry.elapsedTimeInSeconds)})</span>
                                    )}
                                  </p>
                                </div>
                                <ChevronRightIcon className="h-5 w-5 text-slate-400 ml-3" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgressPage;