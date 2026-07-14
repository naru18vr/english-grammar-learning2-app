import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { getQuestionById, loadDailyProgress, recordQuestionCoverage, recordReviewAnswer, saveDailyProgress } from '../services/eiken4DailyService';
import { isSpeechSupported, speakText } from '../services/speechService';
import { useAppContext } from '../contexts/AppContext';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';
import { copyTextToClipboard, createWorksheetShareLink, downloadDailyWorksheet } from '../services/eiken4WorksheetService';
import { loadReadingProgress } from '../services/eiken4ReadingService';
import { recordWordMastery } from '../services/eiken4WordMasteryService';

const Eiken4DailyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSoundEnabled } = useAppContext();
  const [progress, setProgress] = useState(loadDailyProgress);
  const [selected, setSelected] = useState<string | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const [slow, setSlow] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const [audioMessage, setAudioMessage] = useState('');
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'making' | 'error'>('idle');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const [parentMessage, setParentMessage] = useState('');
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
  const dailyWordCount = progress.questionIds.filter(id => id.startsWith('word-')).length;

  useEffect(() => {
    setPlayCount(0);
    setSlow(false);
    setAudioStatus('idle');
    setAudioMessage('');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [currentId]);

  const playListening = () => {
    if (!current?.audioText || playCount >= 2 || audioStatus === 'loading' || audioStatus === 'playing') return;
    setAudioStatus('loading');
    setAudioMessage('音声を準備しています…');
    speakText(current.audioText.replace(/(?:Girl|Boy|Mother|Ken): /g, ''), 'en-US', slow ? 0.72 : 0.9, {
      onStart: () => {
        setPlayCount(count => count + 1);
        setAudioStatus('playing');
        setAudioMessage('再生中です');
      },
      onEnd: () => {
        setAudioStatus('idle');
        setAudioMessage('再生が終わりました');
      },
      onError: message => {
        setAudioStatus('error');
        setAudioMessage(message);
      },
    });
  };

  const next = () => {
    if (!selected || !current) return;
    const correct = selected === current.answer;
    if (current.id.startsWith('word-')) recordWordMastery(current.id, correct);
    recordReviewAnswer(current.id, correct, isRetry);
    if (!isRetry) recordQuestionCoverage(current.id);
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
    const downloadWorksheet = async () => {
      setPdfStatus('making');
      try {
        await downloadDailyWorksheet(progress, loadReadingProgress());
        setPdfStatus('idle');
      } catch {
        setPdfStatus('error');
      }
    };
    const copyParentMessage = async () => {
      setCopyStatus('copying');
      try {
        const score = progress.answers.filter(answer => answer.correct).length;
        const reading = loadReadingProgress();
        const message = `今日の15分を完了しました！\n正解：${score} / ${progress.questionIds.length}問${reading.completedAt ? '\nミニ長文も完了しました！' : ''}\n今日の類題プリントはこちら\n${createWorksheetShareLink(progress, reading)}`;
        setParentMessage(message);
        setCopyStatus(await copyTextToClipboard(message) ? 'copied' : 'error');
      } catch {
        setCopyStatus('error');
      }
    };
    return (
      <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-xl">
        <div className="mt-12 rounded-2xl bg-white shadow-xl border border-emerald-100 p-7 text-center">
          <CheckCircleIcon className="h-20 w-20 text-emerald-500 mx-auto" />
          <p className="text-emerald-700 font-bold mt-4">今日の学習完了！</p>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">{correctCount} / {progress.questionIds.length} 問正解</h1>
          <p className="text-slate-600 mt-3">間違えた問題も今日のうちに復習しました。</p>
          <p className="text-sm text-indigo-700 font-semibold mt-2">次は翌日・3日後・7日後・14日後に自動で出題します。</p>
          <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
            <p className="font-bold text-amber-900">保護者の方へ</p>
            <p className="text-sm text-amber-900 mt-1">今日の{dailyWordCount}単語を書くページ、別問題15問、長文、中1基礎、解答・解説をA4 PDFで作ります。</p>
            <Button onClick={copyParentMessage} className="mt-3 w-full">
              {copyStatus === 'copying' ? 'コピー中…' : copyStatus === 'copied' ? 'コピーしました！' : '結果と印刷リンクをコピー'}
            </Button>
            <p className="text-xs text-amber-800 mt-2">Google Chatに貼り付けて、結果画面のスクショと一緒に送れます。</p>
            {copyStatus === 'copied' && <p className="text-sm text-emerald-700 font-bold mt-2">コピーしました！ Google Chatに貼り付けてください。</p>}
            {copyStatus === 'error' && <p className="text-sm text-rose-700 font-bold mt-2">自動コピーできませんでした。下の文章を長押ししてコピーしてください。</p>}
            {copyStatus === 'error' && <textarea readOnly value={parentMessage} onFocus={event => event.currentTarget.select()} className="mt-2 w-full h-36 rounded-lg border border-amber-300 bg-white p-2 text-xs text-slate-700" aria-label="Google Chatへ送る文章" />}
            <Button onClick={downloadWorksheet} disabled={pdfStatus === 'making'} variant="secondary" className="mt-3 w-full">
              {pdfStatus === 'making' ? 'PDFを作成中…' : '今日の類題プリントPDF'}
            </Button>
            {pdfStatus === 'error' && <p className="text-sm text-rose-700 font-bold mt-2">PDFを作れませんでした。Chromeで開き直してお試しください。</p>}
          </div>
          <Button onClick={() => navigate('/eiken4/reading')} className="mt-7 w-full">続けて今日のミニ長文へ</Button>
          <Button onClick={() => navigate('/eiken4')} variant="ghost" className="mt-2 w-full">英検4級ホームへ</Button>
        </div>
      </div>
    );
  }

  const answeredCorrectly = selected === current.answer;
  const selectAnswer = (choice: string) => {
    if (selected) return;
    if (isSoundEnabled) (choice === current.answer ? playCorrectSound : playIncorrectSound)();
    setSelected(choice);
  };
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
          <button onClick={playListening} disabled={playCount >= 2 || audioStatus === 'loading' || audioStatus === 'playing'} className="w-full flex items-center justify-center rounded-xl bg-indigo-600 disabled:bg-slate-400 text-white font-bold py-4">
            <SpeakerWaveIcon className="h-7 w-7 mr-2" />音声を聞く（あと{2 - playCount}回）
          </button>
          <p className={`text-center text-sm font-semibold mt-2 ${audioStatus === 'error' ? 'text-rose-700' : 'text-indigo-700'}`}>{isSpeechSupported() ? audioMessage : 'この端末では音声読み上げを利用できません。'}</p>
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
            return <button key={choice} onClick={() => selectAnswer(choice)} className={`p-4 rounded-xl border-2 text-left font-semibold transition-colors ${showCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : showWrong ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}`}>{choice}</button>;
          })}
        </div>
        {selected && <div className={`mt-5 p-4 rounded-xl ${answeredCorrectly ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          <p className="font-bold">{answeredCorrectly ? '正解！' : `正解：${current.answer}`}</p>
          {current.transcript && <div className="mt-3 border-t border-slate-200 pt-3"><p className="text-xs font-bold text-slate-500">聞こえた英文</p><p className="text-sm whitespace-pre-line mt-1">{current.transcript}</p><p className="text-xs font-bold text-slate-500 mt-3">日本語</p><p className="text-sm whitespace-pre-line mt-1">{current.translation}</p></div>}
          {current.explanation && <p className="text-sm text-slate-700 mt-2">{current.explanation}</p>}
          {!isListening && <button onClick={() => speakText(current.id.startsWith('word-') ? current.prompt : current.answer, 'en-US', 0.82)} className="mt-3 inline-flex items-center rounded-full bg-white text-indigo-700 font-bold px-4 py-2 border border-indigo-200">
            <SpeakerWaveIcon className="h-5 w-5 mr-2" />{current.id.startsWith('word-') ? '単語の発音を聞く' : '正しい英文を聞く'}
          </button>}
          <Button onClick={next} className="mt-4 w-full">次の問題へ</Button>
        </div>}
      </section>
      <p className="text-center text-xs text-slate-500 mt-4">学習結果はこの端末に保存され、自動復習に使われます。</p>
    </div>
  );
};

export default Eiken4DailyPage;
