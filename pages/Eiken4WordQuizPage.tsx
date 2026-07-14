import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { eiken4Words, Eiken4Word } from '../data/eiken4Words';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { speakText } from '../services/speechService';
import { useAppContext } from '../contexts/AppContext';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';
import { recordWordMastery, recordWordQuizDone } from '../services/eiken4WordMasteryService';

const QUIZ_COUNT = 8;

const shuffleArray = <T,>(array: T[]): T[] => {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const makeChoices = (target: Eiken4Word) => {
  const distractors = shuffleArray(eiken4Words.filter(item => item.id !== target.id))
    .slice(0, 3)
    .map(item => item.meaning);
  return shuffleArray([target.meaning, ...distractors]);
};

const Eiken4WordQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeWordQuiz, result } = useEiken4Session();
  const { isSoundEnabled } = useAppContext();
  const quizWords = useMemo(() => {
    const cardWords = result.wordIds.map(id => eiken4Words.find(word => word.id === id)).filter((word): word is Eiken4Word => Boolean(word));
    return cardWords.length ? cardWords : shuffleArray(eiken4Words).slice(0, QUIZ_COUNT);
  }, [result.wordIds]);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>(() => makeChoices(quizWords[0]));
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongWords, setWrongWords] = useState<string[]>([]);

  const current = quizWords[index];
  const isLast = index >= quizWords.length - 1;

  const checkAnswer = () => {
    const correct = selected === current.meaning;
    if (isSoundEnabled) (correct ? playCorrectSound : playIncorrectSound)();
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setIsCorrect(correct);
    if (correct || nextAttempts >= 3) {
      recordWordMastery(current.id, correct);
      setChecked(true);
      setRetrying(false);
    } else {
      setRetrying(true);
    }
  };

  const nextQuestion = () => {
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextWrong = isCorrect ? wrongWords : [...wrongWords, `${current.word} / ${current.meaning}`];

    if (isLast) {
      completeWordQuiz(quizWords.length, nextCorrect, nextWrong);
      recordWordQuizDone();
      navigate('/eiken4/daily');
      return;
    }

    const nextIndex = index + 1;
    setCorrectCount(nextCorrect);
    setWrongWords(nextWrong);
    setIndex(nextIndex);
    setChoices(makeChoices(quizWords[nextIndex]));
    setSelected('');
    setChecked(false);
    setAttempts(0);
    setRetrying(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    nextQuestion();
  };

  return (
    <div className="flex-grow flex flex-col p-4 sm:p-6 max-w-xl mx-auto w-full">
      <header className="mb-4">
        <Button onClick={() => navigate('/eiken4/words')} variant="ghost" size="sm" className="mb-3">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          単語カードに戻る
        </Button>
        <div className="rounded-xl bg-indigo-600 text-white p-4 shadow">
          <h1 className="text-2xl font-bold">英検4級 単語確認テスト</h1>
          <p className="text-sm opacity-90 mt-1">{index + 1} / {quizWords.length}</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        <section className="bg-white rounded-xl shadow-xl border border-indigo-100 p-5">
          <p className="text-sm font-semibold text-slate-500 mb-2">Q{index + 1}. 次の意味は？</p>
          <h2 className="text-4xl font-bold text-slate-800 mb-5">{current.word}</h2>
          <button onClick={() => speakText(current.word, 'en-US', 0.82)} className="mb-5 inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 font-bold px-4 py-2">
            <SpeakerWaveIcon className="h-5 w-5 mr-2" />発音を聞く
          </button>

          <div className="space-y-3 mb-5">
            {choices.map((choice, choiceIndex) => {
              const isSelected = selected === choice;
              const isAnswer = checked && choice === current.meaning;
              const isWrongSelected = (checked || retrying) && isSelected && choice !== current.meaning;
              return (
                <button
                  key={`${choice}-${choiceIndex}`}
                  onClick={() => !checked && !retrying && setSelected(choice)}
                  disabled={checked || retrying}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-lg font-semibold transition-all ${
                    isAnswer
                      ? 'bg-green-50 border-green-400 text-green-800'
                      : isWrongSelected
                        ? 'bg-rose-50 border-rose-400 text-rose-800'
                        : isSelected
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {choiceIndex + 1}. {choice}
                </button>
              );
            })}
          </div>

          {checked && (
            <div className={`rounded-lg p-4 mb-5 ${isCorrect ? 'bg-green-50' : 'bg-rose-50'}`}>
              <p className={`text-xl font-bold ${isCorrect ? 'text-green-700' : 'text-rose-700'}`}>
                {isCorrect ? '正解！' : '不正解'}
              </p>
              <p className="text-sm text-slate-700 mt-1">{current.word} = {current.meaning}</p>
              <p className="text-sm text-slate-500 mt-1">{current.example}</p>
              <button onClick={() => speakText(`${current.word}. ${current.example}`, 'en-US', 0.82)} className="mt-3 inline-flex items-center text-sm font-bold text-indigo-700">
                <SpeakerWaveIcon className="h-5 w-5 mr-1" />単語と例文を聞く
              </button>
            </div>
          )}

          {retrying && <div className="rounded-lg bg-amber-50 p-4 mb-5"><p className="font-bold text-amber-800">不正解。答えはまだ見せません（{attempts}/3回）</p><Button onClick={() => { setSelected(''); setRetrying(false); }} variant="secondary" className="w-full mt-3">もう一度</Button></div>}

          {checked ? (
            <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
              {isLast ? '結果を見る' : '次へ'}
            </Button>
          ) : !retrying && (
            <Button onClick={checkAnswer} disabled={!selected} variant="primary" size="lg" className="w-full">
              答える
            </Button>
          )}
        </section>
      </main>
    </div>
  );
};

export default Eiken4WordQuizPage;
