import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Grade, Unit, Sentence } from '../types';
import { generatePracticeSentences } from '../services/geminiService';
import Button from '../components/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import LightBulbIcon from '../components/shared/LightBulbIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon'; // For unit selection
import ChevronRightIcon from '../components/shared/ChevronRightIcon'; // For unit selection

const AiChallengeOptionsPage: React.FC = () => {
  const { grades, getGradeById } = useAppContext();
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGradeSelect = (grade: Grade) => {
    setSelectedGrade(grade);
    setSelectedUnit(null); // Reset unit when grade changes
    setError(null);
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setError(null);
  };

  const handleGenerateChallenge = async () => {
    if (!selectedGrade || !selectedUnit) return;

    setIsLoading(true);
    setError(null);

    // Construct a more specific unitFocus for the AI prompt
    const unitFocus = `${selectedUnit.title} (${selectedUnit.sentences.length > 0 ? selectedUnit.sentences.map(s => s.grammarTag).filter((v, i, a) => a.indexOf(v) === i).slice(0,3).join(', ') : '一般的な文法'}) の内容に基づいて`;

    try {
      const generatedSentences = await generatePracticeSentences(
        selectedGrade.name, // Use grade name as gradeLevel for prompt
        unitFocus,
        10, // Generate 10 questions
        selectedGrade.id,
        `ai-${selectedUnit.id}` // Create a unique unitId for AI challenge context
      );

      if (generatedSentences && generatedSentences.length > 0) {
        navigate(`/grade/${selectedGrade.id}/unit/ai-${selectedUnit.id}/set/0`, { 
          state: { 
            customSentences: generatedSentences, 
            customTitle: `${selectedGrade.name} - ${selectedUnit.title} (AIチャレンジ)`,
            source: 'ai-options',
            gradeId: selectedGrade.id,
            unitId: `ai-${selectedUnit.id}`
          } 
        });
      } else {
        setError("AIが問題の生成に失敗しました。もう一度お試しください。");
      }
    } catch (err: any) {
      console.error("AI Challenge generation error:", err);
      setError(err.message || "問題生成中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentGradeDetails = selectedGrade ? getGradeById(selectedGrade.id) : null;

  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-800">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          ホームに戻る
        </Button>
        <div className="p-6 rounded-lg shadow-md bg-amber-500 text-white text-center">
          <LightBulbIcon className="h-12 w-12 mx-auto mb-3 text-amber-100" />
          <h1 className="text-3xl sm:text-4xl font-bold">AIチャレンジ設定</h1>
          <p className="mt-2 opacity-90">挑戦する学年とユニットを選んで、AIが生成する新しい問題に取り組もう！</p>
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
                {grade.aiDefaultConfig && <p className="text-sm opacity-80 mt-1">主な学習範囲: {grade.aiDefaultConfig.unitFocus.substring(0,30)}...</p>}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedGrade && !selectedUnit && currentGradeDetails && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6 text-center">
            2. 次に、<span className={`font-bold ${selectedGrade.iconColor ? selectedGrade.iconColor.replace('bg-','text-') : 'text-blue-600'}`}>{selectedGrade.name}</span> のユニットを選んでください:
          </h2>
          {currentGradeDetails.units.length === 0 ? (
            <p className="text-center text-slate-500">この学年には利用可能なユニットがありません。</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {currentGradeDetails.units.map((unit) => (
                 <button
                    key={unit.id}
                    onClick={() => handleUnitSelect(unit)}
                    disabled={unit.sentences.length === 0 && !selectedGrade.aiDefaultConfig} // Disable if no sentences and no general AI config for fallback (though we'll use unit title)
                    className={`p-6 rounded-xl shadow-lg text-white text-left transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 ${selectedGrade.iconColor || 'bg-blue-500'} hover:opacity-90 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <BookOpenIcon className="h-6 w-6 mb-2 opacity-80" />
                        <h3 className="text-xl font-semibold">{unit.title}</h3>
                        <p className="text-xs opacity-70">{unit.sentences.length > 0 ? `${unit.sentences.length} 問の静的データあり` : `AI生成用に選択可能`}</p>
                      </div>
                      <ChevronRightIcon className="h-6 w-6 opacity-70" />
                    </div>
                  </button>
              ))}
            </div>
          )}
           <div className="text-center mt-8">
              <Button onClick={() => {setSelectedGrade(null); setSelectedUnit(null);}} variant="secondary">
                学年を選び直す
              </Button>
            </div>
        </div>
      )}
      
      {selectedGrade && selectedUnit && (
         <div className="mt-8 p-6 bg-white rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {selectedGrade.name} - {selectedUnit.title} (AIチャレンジ)
          </h2>
          <p className="text-slate-600 mb-6">
            選択したユニット「<span className="font-medium">{selectedUnit.title}</span>」の内容に基づいてAIが10問を自動生成します。
          </p>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button onClick={handleGenerateChallenge} variant="primary" size="lg" className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500">
                <LightBulbIcon className="h-5 w-5 mr-2" />
                このユニットで問題を10問生成
              </Button>
              <Button onClick={() => setSelectedUnit(null)} variant="secondary" size="lg">
                ユニットを選び直す
              </Button>
            </div>
          )}
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </div>
      )}
      
      <footer className="text-center mt-12 text-sm text-slate-500">
        <p>AIチャレンジで新しい問題に挑戦して実力アップ！</p>
      </footer>
    </div>
  );
};

export default AiChallengeOptionsPage;