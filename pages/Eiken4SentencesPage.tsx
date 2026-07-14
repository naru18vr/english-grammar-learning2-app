import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SentenceConstructionArea from '../components/SentenceConstructionArea';
import WordBank from '../components/WordBank';
import { eiken4CoreSentences } from '../data/eiken4Curriculum';
import { Sentence } from '../types';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';
import { useAppContext } from '../contexts/AppContext';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';
import { classifyWeakness, formatReviewDate, getCurriculumLabels, getMasteryLevel, getSentenceDifficulty, getSentenceLearningRecord, recordSentenceLearning } from '../services/sentenceLearningService';
import Eiken4GrammarReference from '../components/Eiken4GrammarReference';

const QUESTION_COUNT = 5;

const shuffleArray = <T,>(array: T[]): T[] => {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const formatSentence = (sentence: Sentence) => sentence.words.join(' ').replace(/ ([.,?!])/g, '$1');

const Eiken4SentencesPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeSentences } = useEiken4Session();
  const { isSoundEnabled } = useAppContext();
  const questions = useMemo(() => {
    const shuffled = shuffleArray(eiken4CoreSentences);
    return shuffled.sort((a, b) => {
      const left = getSentenceLearningRecord('eiken4', 'sentences', a.id);
      const right = getSentenceLearningRecord('eiken4', 'sentences', b.id);
      return ((right?.wrong || 0) - (right?.correct || 0)) - ((left?.wrong || 0) - (left?.correct || 0));
    }).slice(0, QUESTION_COUNT);
  }, []);
  const [index, setIndex] = useState(0);
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const [wordBank, setWordBank] = useState<string[]>(() => shuffleArray(questions[0].words));
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [weakPoints, setWeakPoints] = useState<string[]>([]);

  const current = questions[index];
  const isLast = index >= questions.length - 1;

  const addWord = (word: string, bankIndex: number) => {
    if (checked) return;
    setBuiltWords(prev => [...prev, word]);
    setWordBank(prev => prev.filter((_, i) => i !== bankIndex));
  };

  const removeWord = (word: string, builtIndex: number) => {
    if (checked) return;
    setBuiltWords(prev => prev.filter((_, i) => i !== builtIndex));
    setWordBank(prev => shuffleArray([...prev, word]));
  };

  const checkAnswer = () => {
    const correct = builtWords.join(' ') === current.words.join(' ');
    if (isSoundEnabled) (correct ? playCorrectSound : playIncorrectSound)();
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setIsCorrect(correct);
    if (!correct && nextAttempts < 3) { setRetrying(true); return; }
    recordSentenceLearning('eiken4', 'sentences', current, correct);
    setChecked(true);
    setRetrying(false);
    if (correct) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWeakPoints(prev => [...prev, current.grammarTag]);
    }
  };

  const nextQuestion = () => {
    const finalCorrect = correctCount + (checked && isCorrect ? 0 : 0);
    if (isLast) {
      completeSentences(questions.length, finalCorrect, weakPoints);
      navigate('/eiken4/result');
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    setBuiltWords([]);
    setWordBank(shuffleArray(questions[nextIndex].words));
    setChecked(false);
    setIsCorrect(false);
    setAttempts(0);
    setRetrying(false);
  };

  return (
    <div className="flex-grow flex flex-col p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <header className="mb-4">
        <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm" className="mb-3">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          英検4級に戻る
        </Button>
        <div className="rounded-xl bg-amber-500 text-white p-4 shadow">
          <h1 className="text-2xl font-bold">英検4級 並べ替え問題</h1>
          <p className="text-sm opacity-90 mt-1">{index + 1} / {questions.length}</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        <section className="bg-white p-5 rounded-xl shadow-xl mb-5">
          <p className="text-center text-sm font-semibold text-slate-500 mb-2">これを英語にしよう</p>
          <p className="text-center text-2xl md:text-3xl font-bold text-amber-600 mb-5">{current.japaneseQuestion}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-5 text-xs font-bold">
            <span className="rounded-full bg-violet-100 text-violet-800 px-3 py-1">{getSentenceDifficulty(current)}</span>
            {getCurriculumLabels('eiken4', 'sentences', current).map(label => <span key={label} className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1">{label}</span>)}
          </div>
          <SentenceConstructionArea builtWords={builtWords} onWordClick={removeWord} />
          <WordBank words={wordBank} onWordClick={addWord} />
        </section>

        {checked && (
          <section className={`rounded-xl p-4 mb-4 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-rose-50 border-rose-200'}`}>
            <p className={`text-xl font-bold ${isCorrect ? 'text-green-700' : 'text-rose-700'}`}>
              {isCorrect ? '正解！' : 'もう一度確認しよう'}
            </p>
            <p className="text-slate-700 mt-2">正解: <span className="font-semibold text-blue-700">{formatSentence(current)}</span></p>
            <p className="text-sm text-slate-600 mt-2">{current.grammarTag}: {current.explanation}</p>
            {!isCorrect && <p className="text-sm font-bold text-rose-700 mt-2">見直すポイント：{classifyWeakness(current)}</p>}
            {!isCorrect && <Eiken4GrammarReference source={`${current.grammarTag} ${current.explanation} ${current.japaneseQuestion}`} />}
            <p className="text-xs text-slate-500 mt-2">定着度：{getMasteryLevel(getSentenceLearningRecord('eiken4', 'sentences', current.id))}・{formatReviewDate(getSentenceLearningRecord('eiken4', 'sentences', current.id)?.nextReview)}</p>
          </section>
        )}

        <div className="text-center">
          {checked ? (
            <Button onClick={nextQuestion} variant="primary" size="lg" className="w-full sm:w-auto">
              {isLast ? '結果を見る' : '次の問題へ'}
            </Button>
          ) : retrying ? (
            <div className="rounded-xl bg-amber-50 p-4"><p className="font-bold text-amber-800">不正解。正解はまだ見せません（{attempts}/3回）</p><Button onClick={() => { setBuiltWords([]); setWordBank(shuffleArray(current.words)); setRetrying(false); }} variant="secondary" className="mt-3 w-full">もう一度並べる</Button></div>
          ) : (
            <Button onClick={checkAnswer} disabled={builtWords.length === 0} variant="primary" size="lg" className="w-full sm:w-auto">
              答え合わせ
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Eiken4SentencesPage;
