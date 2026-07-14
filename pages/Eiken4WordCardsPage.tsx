import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { eiken4Words } from '../data/eiken4Words';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { speakText } from '../services/speechService';
import { useAppContext } from '../contexts/AppContext';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';
import { recordWordCardsDone, recordWordMastery } from '../services/eiken4WordMasteryService';
import { loadWordMastery, masteryLevel } from '../services/eiken4WordMasteryService';

const CARD_COUNT = 8;

const shuffleArray = <T,>(array: T[]): T[] => {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const Eiken4WordCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeWords } = useEiken4Session();
  const { isSoundEnabled } = useAppContext();
  const words = useMemo(() => {
    const mastery = loadWordMastery();
    const rank = { new: 0, learning: 1, consolidating: 2, mastered: 3 };
    return shuffleArray(eiken4Words).sort((a, b) => rank[masteryLevel(mastery[a.id])] - rank[masteryLevel(mastery[b.id])]).slice(0, CARD_COUNT);
  }, []);
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [reviewWords, setReviewWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const current = words[index];
  const isLast = index >= words.length - 1;

  const answer = (known: boolean) => {
    recordWordMastery(current.id, known);
    if (isSoundEnabled) (known ? playCorrectSound : playIncorrectSound)();
    const nextKnown = known ? knownCount + 1 : knownCount;
    const nextReview = known ? reviewWords : [...reviewWords, `${current.word} / ${current.meaning}`];

    if (isLast) {
      completeWords(words.length, nextKnown, nextReview, words.map(word => word.id));
      recordWordCardsDone();
      setKnownCount(nextKnown);
      setReviewWords(nextReview);
      setIsComplete(true);
      return;
    }

    setKnownCount(nextKnown);
    setReviewWords(nextReview);
    setIndex(prev => prev + 1);
    setShowMeaning(false);
  };

  const restartCards = () => {
    setIndex(0);
    setShowMeaning(false);
    setKnownCount(0);
    setReviewWords([]);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="flex-grow flex flex-col p-4 sm:p-6 max-w-xl mx-auto w-full">
        <header className="mb-4">
          <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm" className="mb-3">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            英検4級に戻る
          </Button>
          <div className="rounded-xl bg-indigo-600 text-white p-4 shadow">
            <h1 className="text-2xl font-bold">単語カード確認完了！</h1>
          </div>
        </header>

        <main className="flex-grow flex items-center">
          <section className="w-full bg-white rounded-xl shadow-xl border border-indigo-100 p-6 text-center">
            <p className="text-xl font-bold text-slate-800 mb-5">{words.length}語チェックしました</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-slate-500">できた</p>
                <p className="text-3xl font-bold text-green-700">{knownCount}語</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-sm text-slate-500">まだ</p>
                <p className="text-3xl font-bold text-amber-700">{reviewWords.length}語</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => navigate('/eiken4/daily')} variant="primary" size="lg" className="w-full">
                次は紙のプリントへ
              </Button>
              <Button onClick={() => navigate('/eiken4/words/quiz')} variant="secondary" size="lg" className="w-full">余裕があれば単語テスト</Button>
              <Button onClick={restartCards} variant="secondary" size="lg" className="w-full">
                もう一度カードを見る
              </Button>
              <Button onClick={() => navigate('/eiken4/result')} variant="ghost" size="lg" className="w-full">
                結果を見る
              </Button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col p-4 sm:p-6 max-w-xl mx-auto w-full">
      <header className="mb-4">
        <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm" className="mb-3">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          英検4級に戻る
        </Button>
        <div className="rounded-xl bg-indigo-600 text-white p-4 shadow">
          <h1 className="text-2xl font-bold">英検4級 単語カード</h1>
          <p className="text-sm opacity-90 mt-1">{index + 1} / {words.length}</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        <section className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 text-center min-h-[320px] flex flex-col justify-center">
          <p className="text-sm text-indigo-600 font-semibold mb-3">{current.category}</p>
          <h2 className="text-5xl font-bold text-slate-800 mb-5">{current.word}</h2>
          <button onClick={() => speakText(current.word, 'en-US', 0.82)} className="mx-auto mb-5 inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 font-bold px-4 py-2">
            <SpeakerWaveIcon className="h-5 w-5 mr-2" />発音を聞く
          </button>
          {showMeaning ? (
            <div>
              <p className="text-3xl font-bold text-indigo-700 mb-5">{current.meaning}</p>
              <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-semibold text-slate-500 mb-1">例文</p>
                <p className="text-lg text-slate-700">{current.example}</p>
                <button onClick={() => speakText(current.example, 'en-US', 0.82)} className="mt-3 inline-flex items-center text-sm font-bold text-indigo-700">
                  <SpeakerWaveIcon className="h-5 w-5 mr-1" />例文を聞く
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => answer(true)} variant="primary" size="lg" className="w-full">できた</Button>
                <Button onClick={() => answer(false)} variant="secondary" size="lg" className="w-full">まだ</Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowMeaning(true)} variant="primary" size="lg" className="mx-auto">
              意味を見る
            </Button>
          )}
        </section>
      </main>
    </div>
  );
};

export default Eiken4WordCardsPage;
