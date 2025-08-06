import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useSentenceLogic } from '../hooks/useSentenceLogic';
import SentenceConstructionArea from '../components/SentenceConstructionArea';
import WordBank from '../components/WordBank';
import ResultModal from '../components/ResultModal';
import Button from '../components/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import { Sentence, Grade, Unit } from '../types';
import { SENTENCES_PER_SET } from '../constants';
import { incrementSetAttemptCount, recordSetAnswer, addDailyLogEntry } from '../localStorageService';
import SoundToggle from '../components/SoundToggle';

const BuilderPage: React.FC = () => {
  const { gradeId, unitId, setIndex: setIndexParam } = useParams<{ gradeId: string; unitId: string; setIndex: string }>();
  const { getUnitById, getSentencesForUnit, getGradeById } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentSentences, setCurrentSentences] = useState<Sentence[] | undefined>(undefined);
  const [isLoadingSentences, setIsLoadingSentences] = useState(true);
  const [sentenceError, setSentenceError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('ユニット練習');
  const [currentGrade, setCurrentGrade] = useState<Grade | undefined>(undefined);
  const [currentUnit, setCurrentUnit] = useState<Unit | undefined>(undefined);
  const [startTime, setStartTime] = useState<number | null>(null);


  useEffect(() => {
    setIsLoadingSentences(true);
    setSentenceError(null);

    // For custom challenges like AI or Random Challenge passed via state
    if (location.state?.customSentences) {
      const { customSentences, customTitle, grade, unit } = location.state;
      setCurrentSentences(customSentences);
      setPageTitle(customTitle || 'チャレンジ');
      setCurrentGrade(grade);
      setCurrentUnit(unit);
      setIsLoadingSentences(false);
      if (!startTime) {
        setStartTime(Date.now());
      }
      
      // Increment attempt count for custom challenges as well, using their unique IDs
      if (gradeId && unitId && setIndexParam) {
        const setIndex = parseInt(setIndexParam, 10);
        if(!isNaN(setIndex)) {
          incrementSetAttemptCount(gradeId, unitId, setIndex);
        }
      }
      return;
    }

    if (!gradeId || !unitId || !setIndexParam) {
        setSentenceError("無効な学習パスです。トップページからやり直してください。");
        setIsLoadingSentences(false);
        navigate('/', { replace: true });
        return;
    }
    
    const gradeData = getGradeById(gradeId);
    setCurrentGrade(gradeData);
      
    const unit = getUnitById(gradeId, unitId);
    setCurrentUnit(unit);

    if (!unit) {
      setSentenceError("ユニット情報が見つかりません。");
      setIsLoadingSentences(false);
      return;
    }
      
    const setIndex = parseInt(setIndexParam, 10);
    if (isNaN(setIndex)) {
      navigate(`/grade/${gradeId}/unit/${unitId}/sets`, { replace: true });
      return;
    }

    const allStaticSentences = getSentencesForUnit(gradeId, unitId);
    if (!allStaticSentences || allStaticSentences.length === 0) {
      setSentenceError("このユニットには問題がありません。");
      setCurrentSentences([]);
      setIsLoadingSentences(false);
      return;
    }

    const startIndex = setIndex * SENTENCES_PER_SET;
    const endIndex = startIndex + SENTENCES_PER_SET;
    const slicedSentences = allStaticSentences.slice(startIndex, endIndex);

    if (slicedSentences.length === 0 && allStaticSentences.length > 0) {
      setSentenceError(`問題セット ${setIndex + 1} には問題がありません。`);
      setCurrentSentences([]);
    } else {
      setCurrentSentences(slicedSentences);
      setPageTitle(`${unit.title} - セット ${setIndex + 1}`);
      if (slicedSentences.length > 0) {
        incrementSetAttemptCount(gradeId, unitId, setIndex);
         if (!startTime) {
          setStartTime(Date.now());
        }
      }
    }
    setIsLoadingSentences(false);
    
  }, [gradeId, unitId, setIndexParam, getUnitById, getSentencesForUnit, navigate, getGradeById, location.state, startTime]);

  const { state: sentenceBuilderState, addWordToBuilt, removeWordFromBuilt, checkAnswer, nextSentence, retrySentence } = useSentenceLogic(currentSentences, gradeId, unitId);
  
  useEffect(() => {
    if (
      sentenceBuilderState.showResultModal &&
      sentenceBuilderState.isCorrect !== null &&
      gradeId &&
      unitId &&
      setIndexParam 
    ) {
      const setIndex = parseInt(setIndexParam, 10);
      if (!isNaN(setIndex)) {
        recordSetAnswer(gradeId, unitId, setIndex, sentenceBuilderState.isCorrect);
      }
    }
  }, [
    sentenceBuilderState.showResultModal,
    sentenceBuilderState.isCorrect,
    gradeId,
    unitId,
    setIndexParam,
  ]);

  const gradeColorClass = currentGrade?.iconColor || 'bg-blue-500';

  const handleBackNavigation = () => {
    if (location.state?.source === 'random-challenge' || location.state?.source === 'ai-options') {
      navigate('/');
      return;
    }
    if (gradeId && unitId) {
      navigate(`/grade/${gradeId}/unit/${unitId}/sets`);
    } else if (gradeId) {
      navigate(`/grade/${gradeId}`);
    } else {
      navigate('/'); 
    }
  };
  
  if (isLoadingSentences && !sentenceBuilderState.currentSentence) {
    return <div className="flex-grow flex flex-col justify-center items-center p-4"><LoadingSpinner /><p className="mt-4 text-slate-600">問題を読み込み中...</p></div>;
  }

  if (sentenceError && (!currentSentences || currentSentences.length === 0)) {
     return (
      <div className="flex-grow flex flex-col justify-center items-center p-4 text-center">
        <p className="text-red-500 text-xl mb-4">{sentenceError || "問題を読み込めませんでした。"}</p>
        <Button onClick={handleBackNavigation} variant="primary">
          戻る
        </Button>
      </div>
    );
  }

   if (!sentenceBuilderState.currentSentence && !isLoadingSentences) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center p-4 text-center">
        <p className="text-slate-500 text-xl mb-4">すべての問題が完了したか、問題がありません。</p>
        <Button onClick={handleBackNavigation} variant="primary">
           戻る
        </Button>
      </div>
    );
  }

  const handleNext = () => {
    const isLastSentenceInCurrentSet = sentenceBuilderState.currentSentenceIndex >= sentenceBuilderState.allSentences.length - 1;
    const elapsedTimeInSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    if (isLastSentenceInCurrentSet) {
       if (currentGrade && currentUnit && gradeId && unitId && setIndexParam) {
            addDailyLogEntry({
                gradeId: gradeId,
                gradeName: currentGrade.name,
                unitId: unitId,
                unitTitle: currentUnit.title,
                setIndex: parseInt(setIndexParam, 10),
                title: pageTitle,
                source: location.state?.source || 'set',
                elapsedTimeInSeconds: elapsedTimeInSeconds,
            });
       }

       const reportData = {
          grade: currentGrade!,
          unit: currentUnit!,
          setIndex: setIndexParam ? parseInt(setIndexParam, 10) : 0,
          sentences: sentenceBuilderState.allSentences,
          date: new Date().toISOString(),
          title: pageTitle,
          elapsedTimeInSeconds: elapsedTimeInSeconds,
        };
        navigate('/report', { state: { reportData } });
    } else {
      nextSentence();
    }
  };

  const isLastSentenceInSet = sentenceBuilderState.currentSentenceIndex >= sentenceBuilderState.allSentences.length - 1;
  
  const backButtonText = location.state?.source ? 'ホームに戻る' : 'セット選択に戻る';

  return (
    <div className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <header className="mb-6">
        <div className="flex justify-between items-center mb-3">
           <Button 
              onClick={handleBackNavigation}
              variant="ghost" 
              size="sm" 
              className="text-slate-600 hover:text-slate-800">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {backButtonText}
          </Button>
          <SoundToggle />
        </div>
        <div className={`p-4 rounded-lg shadow ${gradeColorClass} text-white`}>
           <div className="flex items-center mb-1">
            <BookOpenIcon className="h-5 w-5 mr-2"/>
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
           </div>
          {currentSentences && currentSentences.length > 0 && sentenceBuilderState.currentSentence && (
            <p className="text-sm opacity-90">
                問題 {sentenceBuilderState.currentSentenceIndex + 1} / {sentenceBuilderState.allSentences.length}
            </p>
          )}
        </div>
      </header>

      {sentenceBuilderState.currentSentence ? (
        <main className="flex-grow flex flex-col justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl mb-8">
              <p className="text-center text-2xl md:text-3xl font-medium text-slate-700 mb-2">
               これを翻訳してね：
              </p>
              <p className="text-center text-3xl md:text-4xl font-bold text-blue-600 mb-6">
                  {sentenceBuilderState.currentSentence.japaneseQuestion}
              </p>
              <SentenceConstructionArea builtWords={sentenceBuilderState.builtWords} onWordClick={removeWordFromBuilt} />
              <WordBank words={sentenceBuilderState.wordBank.map(wb => wb.word)} onWordClick={addWordToBuilt} />
          </div>

          <div className="mt-auto pt-6 text-center">
            <Button 
              onClick={checkAnswer} 
              disabled={sentenceBuilderState.builtWords.length === 0 || sentenceBuilderState.showResultModal || isLoadingSentences}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-10 py-3 text-xl"
            >
              答え合わせ
            </Button>
          </div>
        </main>
      ) : (
         <div className="flex-grow flex flex-col justify-center items-center p-4 text-center">
            <p className="text-slate-500 text-xl mb-4">問題の読み込みに失敗しました、または問題がありません。</p>
            <Button onClick={handleBackNavigation} variant="primary">戻る</Button>
        </div>
      )}

      {sentenceBuilderState.currentSentence && sentenceBuilderState.showResultModal && (
        <ResultModal
          isOpen={sentenceBuilderState.showResultModal}
          onClose={retrySentence}
          isCorrect={sentenceBuilderState.isCorrect!}
          sentence={sentenceBuilderState.currentSentence}
          userSentence={sentenceBuilderState.builtWords.join(' ')}
          onNext={handleNext}
          isLastSentence={isLastSentenceInSet}
        />
      )}
       <footer className="text-center mt-8 text-sm text-slate-400">
        <p>単語をドラッグ＆ドロップするかタップして文を作ろう！</p>
      </footer>
    </div>
  );
};

export default BuilderPage;