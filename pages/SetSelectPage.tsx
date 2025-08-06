import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { SENTENCES_PER_SET } from '../constants';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import Button from '../components/Button';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import { getSetAttemptCount, getSetStats, SetStats } from '../localStorageService'; 
import { Sentence, Unit, Grade } from '../types'; // Added Grade for typing

// Utility to shuffle array (needed for word bank display if used directly here, though not in current version of this file)
// const shuffleArray = <T,>(array: T[]): T[] => {
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// };


const SetSelectPage: React.FC = () => {
  const { gradeId, unitId } = useParams<{ gradeId: string; unitId: string }>();
  const { getUnitById, getGradeById } = useAppContext(); // Ensure getGradeById is destructured
  const navigate = useNavigate();

  // State for stats and sentences
  const [setStatsDisplay, setSetStatsDisplay] = useState<Array<{ setIndex: number; stats: SetStats; attemptCount: number }>>([]);
  const [unitSentences, setUnitSentences] = useState<Sentence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [unit, setUnit] = useState<Unit | undefined>(undefined);
  const [grade, setGrade] = useState<Grade | undefined>(undefined);


  useEffect(() => {
    setIsLoading(true);
    setError(null);
    if (!gradeId || !unitId) {
      setError("Grade or Unit ID is missing.");
      setIsLoading(false);
      return;
    }

    const currentGrade = getGradeById(gradeId);
    setGrade(currentGrade);

    const currentUnit = getUnitById(gradeId, unitId);
    setUnit(currentUnit);

    if (!currentUnit) {
      setError("Unit not found.");
      setIsLoading(false);
      return;
    }

    setUnitSentences(currentUnit.sentences);
    const numberOfSets = Math.ceil(currentUnit.sentences.length / SENTENCES_PER_SET);
    const statsArray = [];
    for (let i = 0; i < numberOfSets; i++) {
      statsArray.push({
        setIndex: i,
        stats: getSetStats(gradeId, unitId, i),
        attemptCount: getSetAttemptCount(gradeId, unitId, i),
      });
    }
    setSetStatsDisplay(statsArray);
    setIsLoading(false);
  }, [gradeId, unitId, getUnitById, getGradeById]);

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center p-4">
        <LoadingSpinner />
        <p className="mt-4 text-slate-600">セット情報を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center p-4 text-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <Button onClick={() => navigate(gradeId ? `/grade/${gradeId}` : '/')} variant="primary">
          戻る
        </Button>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="text-center p-8 text-red-500">
        ユニットが見つかりません。
        <Button onClick={() => navigate(gradeId ? `/grade/${gradeId}` : '/')} variant="secondary" className="mt-4">戻る</Button>
      </div>
    );
  }
  
  const gradeColorClass = grade?.iconColor || 'bg-blue-500';
  const hoverBgClass = `${gradeColorClass.replace('bg-', 'hover:bg-').replace(/-\d+$/, (match) => `-${Math.min(900, parseInt(match.substring(1)) + 100)}`)}`;


  const numberOfSets = Math.ceil(unitSentences.length / SENTENCES_PER_SET);

   if (unitSentences.length === 0) { // Check this before numberOfSets calculation if it relies on populated unitSentences
    return (
      <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <Button onClick={() => navigate(`/grade/${gradeId}`)} variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-800">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            ユニット選択に戻る
          </Button>
          <div className={`p-6 rounded-lg shadow-md ${gradeColorClass} text-white`}>
            <h1 className="text-3xl sm:text-4xl font-bold">{unit.title}</h1>
            <p className="mt-1 opacity-90">このユニットには現在、利用可能な問題がありません。</p>
          </div>
        </header>
        <div className="text-center text-slate-500 py-10">
          <p>新しい問題セットが追加されるのをお待ちください。</p>
          <p className="mt-2 text-xs">または、AIチャレンジで問題を生成することもできます。</p>
        </div>
      </div>
    );
  }
  
  if (numberOfSets === 0 && unitSentences.length > 0) { 
    // This case should ideally not be hit if unitSentences.length > 0 implies sets can be made
    // but as a fallback:
    return (
      <div className="text-center p-8 text-slate-500">
        このユニットに表示できるセットがありません。
         <Button onClick={() => navigate(`/grade/${gradeId}`)} variant="secondary" className="mt-4">
          ユニット選択に戻る
        </Button>
      </div>
    );
  }


  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <Button onClick={() => navigate(`/grade/${gradeId}`)} variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-800">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          ユニット選択に戻る ({grade?.name || '学年'})
        </Button>
        <div className={`p-6 rounded-lg shadow-md ${gradeColorClass} text-white`}>
          <h1 className="text-3xl sm:text-4xl font-bold">{unit.title}</h1>
          <p className="mt-1 opacity-90">練習する問題セットを選んでください。</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: numberOfSets }).map((_, setIndex) => {
          const attemptCount = setStatsDisplay.find(s => s.setIndex === setIndex)?.attemptCount || 0;
          const { correct, attempted } = setStatsDisplay.find(s => s.setIndex === setIndex)?.stats || { correct: 0, attempted: 0 };
          const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
          
          const setStartIndexInUnit = setIndex * SENTENCES_PER_SET;
          const setEndIndexInUnit = Math.min((setIndex + 1) * SENTENCES_PER_SET, unitSentences.length);
          const sentenceCountInSet = setEndIndexInUnit - setStartIndexInUnit;

          // Display question numbers relative to the entire unit
          const displayStartNum = setStartIndexInUnit + 1;
          const displayEndNum = setEndIndexInUnit;


          return (
            <Link
              key={setIndex}
              to={`/grade/${gradeId}/unit/${unitId}/set/${setIndex}`}
              className={`block p-6 rounded-xl shadow-lg transition-all duration-300 text-white transform hover:scale-105 active:scale-95 ${gradeColorClass} ${hoverBgClass}`}
              aria-label={`問題セット ${setIndex + 1} を開始、${sentenceCountInSet}問`}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    セット {setIndex + 1}
                  </h3>
                  <p className="text-sm opacity-90">
                    問題 {displayStartNum} - {displayEndNum} ({sentenceCountInSet}問)
                  </p>
                  {attemptCount > 0 && (
                    <p className="text-xs opacity-80 mt-1">挑戦回数: {attemptCount}回</p>
                  )}
                  {attempted > 0 && (
                    <p className="text-xs opacity-80 mt-1">
                      正解率: {accuracy}% ({correct}/{attempted})
                    </p>
                  )}
                   {attemptCount === 0 && attempted === 0 && (
                     <p className="text-xs opacity-70 italic mt-2">まだ挑戦していません</p>
                   )}
                </div>
                <div className="mt-4 text-right">
                  <ChevronRightIcon className="h-6 w-6 inline-block opacity-80" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
       <footer className="text-center mt-12 text-sm text-slate-500">
        <p>各セットをマスターして、英語力を高めよう！</p>
      </footer>
    </div>
  );
};

export default SetSelectPage; // Added default export