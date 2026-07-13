import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { getQuestionById, loadDailyProgress, recordReviewAnswer, saveDailyProgress } from '../services/eiken4DailyService';
import { speakText } from '../services/speechService';

const Eiken4DailyPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(loadDailyProgress);
  const [selected, setSelected] = useState<string | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const [slow, setSlow] = useState(false);
  const baseDone = progress.answers.length >= progress.questionIds.length;
  const retryDone = progress.retryAnswers.length >= progress.retryIds.length;
  const complete = baseDone && retryDone;
  const isRetry = baseDone;
  const currentId = isRetry ? progress.retryIds[progress.retryAnswers.length] : progress.questionIds[progress.answers.length];
  const current = useMemo(() => currentId ? getQuestionById(currentId, progress.date) : undefined, [currentId, progress.date]);
  const total = progress.questionIds.length + progress.retryIds.length;
  const finished = progress.answers.length + progress.retryAnswers.length;
  const correctCount = progress.answers.filter(answer => answer.correct).length;
  const isListening = Boolean(current?.audioText);

  useEffect(() => {
    setPlayCount(0);
    setSlow(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [currentId]);

  const playListening = () => {
    if (!current?.audioText || playCount >= 2) return;
    speakText(current.audioText.replace(/(?:Girl|Boy|Mother|Ken): /g, ''), 'en-US', slow ? 0.72 : 0.9);
    setPlayCount(count => count + 1);
  };

  const next = () => {
    if (!selected || !current) return;
    const correct = selected === current.answer;
    recordReviewAnswer(current.id, correct, isRetry);
    const nextProgress = { ...progress };
    if (isRetry) {
      nextProgress.retryAnswers = [...progress.retryAnswers, { id: current.id, correct }];
    } else {
      nextProgress.answers = [...progress.answers, { id: current.id, correct }];
      if (!correct && !progress.retryIds.includes(current.id)) nextProgress.retryIds = [...progress.retryIds, current.id];
    }
    const willFinish = nextProgress.answers.length >= nextProgress.questionIds.length && nextProgress.retryAnswers.length >= nextProgress.retryIds.length;
    if (willFinish) nextProgress.completedAt = new Date().toISOString();
    saveDailyProgress(nextProgress);
    setProgress(nextProgress);
    setSelected(null);
  };

  if (complete || !current) {
    return (
      <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-xl">
        <div className="mt-12 rounded-2xl bg-white shadow-xl border border-emerald-100 p-7 text-center">
          <CheckCircleIcon className="h-20 w-20 text-emerald-500 mx-auto" />
          <p className="text-emerald-700 font-bold mt-4">今日の学習完了！</p>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">{correctCount} / {progress.questionIds.length} 問正解</h1>
          <p className="text-slate-600 mt-3">間違えた問題も今日のうちに復習しました。</p>
          <p className="text-sm text-indigo-700 font-semibold mt-2">次は翌日・3日後・7日後・14日後に自動で出題します。</p>
          <Button onClick={() => navigate('/eiken4')} className="mt-7 w-full">英検4級ホームへ</Button>
        </div>
      </div>
    );
  }

  const answeredCorrectly = selected === current.answer;
  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-xl">
      <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm" className="mb-4 text-slate-600">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />途中で戻る
      </Button>
      <div className="flex items-center justify-between text-sm font-semibold text-slate-600 mb-2">
        <span>{isRetry ? '今日の間違い直し' : current.kind}</span><span>{finished + 1} / {total}</span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-5">
        <div className="h-full bg-indigo-600 transition-all" style={{ width: `${total ? (finished / total) * 100 : 0}%` }} />
      </div>
      {isRetry && <div className="mb-4 rounded-xl bg-amber-100 text-amber-900 p-3 text-sm font-bold">あと少し！ 間違えた問題をもう一度やろう。</div>}
      <section className="rounded-2xl bg-white shadow-lg border border-indigo-100 p-6">
        <p className="text-sm text-indigo-600 font-bold">{isListening ? '会話を聞いて答えよう' : 'いちばん合う答えを選ぼう'}</p>
        {isListening && <div className="mt-4 rounded-xl bg-indigo-50 p-4">
          <button onClick={playListening} disabled={playCount >= 2} className="w-full flex items-center justify-center rounded-xl bg-indigo-600 disabled:bg-slate-400 text-white font-bold py-4">
            <SpeakerWaveIcon className="h-7 w-7 mr-2" />音声を聞く（あと{2 - playCount}回）
          </button>
          <label className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={slow} onChange={event => setSlow(event.target.checked)} disabled={playCount >= 2} />ゆっくり速度
          </label>
        </div>}
        <h1 className="text-2xl font-bold text-slate-800 mt-4">{current.prompt}</h1>
        <p className="text-sm text-slate-500 mt-2">{current.detail}</p>
        <div className="grid gap-3 mt-6">
          {current.choices.map(choice => {
            const showCorrect = selected && choice === current.answer;
            const showWrong = selected === choice && choice !== current.answer;
            return <button key={choice} onClick={() => !selected && setSelected(choice)} className={`p-4 rounded-xl border-2 text-left font-semibold transition-colors ${showCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : showWrong ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}`}>{choice}</button>;
          })}
        </div>
        {selected && <div className={`mt-5 p-4 rounded-xl ${answeredCorrectly ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          <p className="font-bold">{answeredCorrectly ? '正解！' : `正解：${current.answer}`}</p>
          {current.transcript && <div className="mt-3 border-t border-slate-200 pt-3"><p className="text-xs font-bold text-slate-500">聞こえた英文</p><p className="text-sm whitespace-pre-line mt-1">{current.transcript}</p><p className="text-xs font-bold text-slate-500 mt-3">日本語</p><p className="text-sm whitespace-pre-line mt-1">{current.translation}</p></div>}
          {current.explanation && <p className="text-sm text-slate-700 mt-2">{current.explanation}</p>}
          <Button onClick={next} className="mt-4 w-full">次の問題へ</Button>
        </div>}
      </section>
      <p className="text-center text-xs text-slate-500 mt-4">学習結果はこの端末に保存され、自動復習に使われます。</p>
    </div>
  );
};

export default Eiken4DailyPage;
