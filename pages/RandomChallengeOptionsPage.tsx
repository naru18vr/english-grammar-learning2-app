
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Grade, Unit } from '../types';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SparklesIcon from '../components/shared/SparklesIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import { shuffleArray } from '../hooks/useSentenceLogic';
import { SENTENCES_PER_SET } from '../constants';

const RandomChallengeOptionsPage: React.FC = () => {
  const { grades } = useAppContext();
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const handleGradeSelect = (grade: Grade) => {
    setSelectedGrade(grade);
  };

  const handleUnitSelect = (unit: Unit) => {
    if (!selectedGrade) return;

    const allSentences = unit.sentences;
    if (allSentences.length === 0) {
      alert("このユニットには問題がありません。");
      return;
    }

    const shuffled = shuffleArray(allSentences);
    const randomSet = shuffled.slice(0, SENTENCES_PER_SET);

    const reportGrade = { id: selectedGrade.id, name: selectedGrade.name, units: [] };
    const reportUnit = { id: unit.id, title: unit.title, sentences: [] };

    navigate(`/grade/${selectedGrade.id}/unit/${unit.id}/set/0`, {
      state: {
        customSentences: randomSet,
        customTitle: `${selectedGrade.name} - ${unit.title} (ランダムチャレンジ)`,
        grade: reportGrade,
        unit: reportUnit,
        source: 'random-challenge'
      }
    });
  };
  
  const handleAllUnitsSelect = () => {
    if (!selectedGrade) return;

    const allSentences = selectedGrade.units.flatMap(u => u.sentences);
     if (allSentences.length === 0) {
      alert("この学年には問題がありません。");
      return;
    }

    const shuffled = shuffleArray(allSentences);
    const randomSet = shuffled.slice(0, SENTENCES_PER_SET);

    const reportGrade = { id: selectedGrade.id, name: selectedGrade.name, units: [] };
    const reportUnit = { id: 'all', title: '全ユニットから', sentences: [] };

    navigate(`/grade/${selectedGrade.id}/unit/all/set/0`, {
        state: {
            customSentences: randomSet,
            customTitle: `${selectedGrade.name} - 全ユニット (ランダムチャレンジ)`,
            grade: reportGrade,
            unit: reportUnit,
            source: 'random-challenge'
        }
    });
  };


  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-800">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          ホームに戻る
        </Button>
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">ランダムチャレンジ設定</h1>
            <p className="mt-2 text-slate-600">挑戦する学年とユニットを選んで、新しい問題に取り組もう！</p>
        </div>
      </header>

      {!selectedGrade && (
        <>
          <h2 className="text-2xl font-semibold text-slate-700 mb-6 text-center">1. まず、挑戦する学年を選んでください:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {grades.map((grade) => (
              <button
                key={grade.id}
                onClick={() => handleGradeSelect(grade)}
                className={`p-6 rounded-xl shadow-lg hover:shadow-xl text-white text-left transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 ${grade.iconColor || 'bg-blue-500'} focus:ring-offset-2 focus:ring-white`}
              >
                <h3 className="text-2xl font-bold">{grade.name}</h3>
                <p className="text-sm opacity-80 mt-1">{grade.units.length} ユニットから選択可能</p>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedGrade && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6 text-center">
            2. 次に、<span className={`${selectedGrade.iconColor ? selectedGrade.iconColor.replace('bg-','text-') : 'text-blue-600'} font-bold`}>{selectedGrade.name}</span> のユニットを選んでください:
          </h2>
          {selectedGrade.units.length === 0 ? (
            <p className="text-center text-slate-500">この学年には利用可能なユニットがありません。</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                <button
                    onClick={handleAllUnitsSelect}
                    className={`p-6 rounded-xl shadow-lg text-white text-left transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 ${selectedGrade.iconColor || 'bg-blue-500'} hover:opacity-90 focus:ring-offset-2 focus:ring-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <SparklesIcon className="h-6 w-6 mb-2 opacity-80" />
                        <h3 className="text-xl font-semibold">全ユニットから挑戦</h3>
                        <p className="text-xs opacity-70">この学年の総まとめ！</p>
                      </div>
                      <ChevronRightIcon className="h-6 w-6 opacity-70" />
                    </div>
                </button>
              {selectedGrade.units.map((unit) => (
                 <button
                    key={unit.id}
                    onClick={() => handleUnitSelect(unit)}
                    disabled={unit.sentences.length === 0}
                    className={`p-6 rounded-xl shadow-lg text-white text-left transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 ${selectedGrade.iconColor || 'bg-blue-500'} hover:opacity-90 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <BookOpenIcon className="h-6 w-6 mb-2 opacity-80" />
                        <h3 className="text-xl font-semibold">{unit.title}</h3>
                        <p className="text-xs opacity-70">{unit.sentences.length} 問から出題</p>
                      </div>
                      <ChevronRightIcon className="h-6 w-6 opacity-70" />
                    </div>
                  </button>
              ))}
            </div>
          )}
           <div className="text-center mt-8">
              <Button onClick={() => setSelectedGrade(null)} variant="secondary">
                学年を選び直す
              </Button>
            </div>
        </div>
      )}
      
      <footer className="text-center mt-12 text-sm text-slate-500">
        <p>ランダムチャレンジで新しい問題に挑戦して実力アップ！</p>
      </footer>
    </div>
  );
};

export default RandomChallengeOptionsPage;