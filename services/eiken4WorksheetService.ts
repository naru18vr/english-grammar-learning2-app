import { eiken4CoreExamQuestions, eiken4CoreSentences } from '../data/eiken4Curriculum';
import { eiken4ListeningQuestions } from '../data/eiken4Listening';
import { eiken4Words } from '../data/eiken4Words';
import { eiken4Readings } from '../data/eiken4Readings';
import { DailyProgress, getQuestionById } from './eiken4DailyService';
import type { ReadingProgress } from './eiken4ReadingService';
import { getGrade1DailyItems, getGrade1DailySelection, getGrade1ItemsBySelection, type Grade1Selection } from './grade1ReviewService';

export type WorksheetShareData = Pick<DailyProgress, 'date' | 'questionIds' | 'answers'> & { reading?: ReadingProgress; grade1?: Grade1Selection };
export type SharedWorksheet = { progress: DailyProgress; reading?: ReadingProgress; grade1?: Grade1Selection };

export const copyTextToClipboard = async (text: string) => {
  const fallbackCopy = () => {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.inset = '0';
    area.style.width = '1px';
    area.style.height = '1px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, area.value.length);
    const copied = document.execCommand('copy');
    area.remove();
    return copied;
  };

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* use the Android-compatible fallback below */ }
  try {
    return fallbackCopy();
  } catch {
    return false;
  }
};

export const createWorksheetShareLink = (progress: DailyProgress, reading?: ReadingProgress) => {
  const data: WorksheetShareData = { date: progress.date, questionIds: progress.questionIds, answers: progress.answers, grade1: getGrade1DailySelection(progress.date), ...(reading?.completedAt ? { reading } : {}) };
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  const encoded = btoa(binary);
  return `${window.location.href.split('#')[0]}#/eiken4/worksheet?data=${encodeURIComponent(encoded)}`;
};

export const parseWorksheetShareData = (encoded: string | null): SharedWorksheet | null => {
  if (!encoded) return null;
  try {
    const binary = atob(decodeURIComponent(encoded));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes)) as WorksheetShareData;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Array.isArray(data.questionIds) || !Array.isArray(data.answers)) return null;
    if (data.questionIds.length < 1 || data.questionIds.length > 20) return null;
    if (data.questionIds.some(id => typeof id !== 'string' || !getQuestionById(id, data.date))) return null;
    const reading = data.reading?.completedAt && eiken4Readings.some(item => item.id === data.reading?.readingId) ? data.reading : undefined;
    const grade1 = data.grade1?.wordIndexes?.length === 3 && data.grade1?.grammarIndexes?.length === 3 ? data.grade1 : undefined;
    return { progress: { date: data.date, questionIds: data.questionIds, answers: data.answers, retryIds: [], retryAnswers: [], completedAt: data.date }, reading, grade1 };
  } catch {
    return null;
  }
};

type WorksheetQuestion = {
  id: string;
  kind: string;
  prompt: string;
  detail: string;
  choices: string[];
  answer: string;
  explanation: string;
};

const hash = (value: string) => {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const candidateIds = [
  ...eiken4Words.map(item => `word-${item.id}`),
  ...eiken4CoreSentences.map(item => `sentence-${item.id}`),
  ...eiken4ListeningQuestions.map(item => `listening-${item.id}`),
  ...eiken4CoreExamQuestions.map(item => `exam-${item.id}`),
];

const makeWorksheet = (progress: DailyProgress): WorksheetQuestion[] => {
  const wrongIds = new Set(progress.answers.filter(answer => !answer.correct).map(answer => answer.id));
  const sourceIds = [...progress.questionIds].sort((a, b) => Number(wrongIds.has(b)) - Number(wrongIds.has(a)));
  const used = new Set(progress.questionIds);

  return sourceIds.slice(0, 15).map((sourceId, index) => {
    const source = getQuestionById(sourceId, progress.date);
    const sourceWord = sourceId.startsWith('word-') ? eiken4Words.find(item => `word-${item.id}` === sourceId) : undefined;
    const matches = candidateIds.filter(id => {
      if (used.has(id)) return false;
      const question = getQuestionById(id, progress.date);
      if (!question || !source) return false;
      if (sourceId.startsWith('listening-')) return id.startsWith('exam-') && question.kind === '会話文空所補充';
      if (sourceWord && id.startsWith('word-')) {
        return eiken4Words.find(item => `word-${item.id}` === id)?.category === sourceWord.category;
      }
      return question.kind === source.kind || (sourceId.startsWith('sentence-') && id.startsWith('sentence-') && question.detail === source.detail);
    });
    const fallback = sourceId.startsWith('listening-')
      ? candidateIds.filter(id => !used.has(id) && id.startsWith('sentence-'))
      : candidateIds.filter(id => !used.has(id) && id.split('-')[0] === sourceId.split('-')[0]);
    const pool = matches.length ? matches : fallback;
    const pickedId = pool[hash(`${progress.date}-${sourceId}-${index}`) % Math.max(pool.length, 1)] || sourceId;
    used.add(pickedId);
    const picked = getQuestionById(pickedId, progress.date) || source!;
    return {
      id: picked.id,
      kind: picked.kind,
      prompt: picked.prompt,
      detail: picked.detail,
      choices: picked.choices,
      answer: picked.answer,
      explanation: picked.explanation || '答えと文の意味をもう一度確認しましょう。',
    };
  });
};

const createPage = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1240;
  canvas.height = 1754;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('PDF用の画面を作成できませんでした。');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#111827';
  context.textBaseline = 'top';
  return { canvas, context };
};

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const lines: string[] = [];
  let line = '';
  for (const character of text) {
    if (character === '\n') { lines.push(line); line = ''; continue; }
    if (context.measureText(line + character).width > maxWidth && line) { lines.push(line); line = character; }
    else line += character;
  }
  if (line) lines.push(line);
  return lines;
};

const drawLines = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const lines = wrapText(context, text, maxWidth);
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
};

const drawHeader = (context: CanvasRenderingContext2D, date: string, page: string, answers = false) => {
  context.font = 'bold 42px sans-serif';
  context.fillText(answers ? '英検4級 今日の類題プリント【解答・解説】' : '英検4級 今日の類題プリント', 70, 55);
  context.font = '24px sans-serif';
  context.fillText(`学習日：${date.replaceAll('-', '/')}　　名前：____________________`, 70, 120);
  context.textAlign = 'right';
  context.fillText(page, 1170, 120);
  context.textAlign = 'left';
  context.strokeStyle = '#334155';
  context.lineWidth = 2;
  context.beginPath(); context.moveTo(70, 165); context.lineTo(1170, 165); context.stroke();
};

export const downloadDailyWorksheet = async (progress: DailyProgress, readingProgress?: ReadingProgress, grade1Selection?: Grade1Selection) => {
  const { jsPDF } = await import('jspdf');
  const questions = makeWorksheet(progress);
  const pages: HTMLCanvasElement[] = [];
  const sourceReading = readingProgress?.completedAt
    ? eiken4Readings.find(item => item.id === readingProgress.readingId)
    : eiken4Readings[hash(`${progress.date}-reading`) % eiken4Readings.length];
  const similarReadings = sourceReading ? eiken4Readings.filter(item => item.id !== sourceReading.id && item.type === sourceReading.type) : [];
  const similarReading = sourceReading ? (similarReadings[hash(`${progress.date}-${sourceReading.id}`) % Math.max(similarReadings.length, 1)] || eiken4Readings.find(item => item.id !== sourceReading.id)) : undefined;
  const pageCount = 7;

  const writingWords = progress.questionIds.filter(id => id.startsWith('word-')).map(id => eiken4Words.find(word => `word-${word.id}` === id)).filter((word): word is (typeof eiken4Words)[number] => Boolean(word));
  const { canvas: writingPage, context: writingContext } = createPage();
  drawHeader(writingContext, progress.date, `1 / ${pageCount}`);
  writingContext.font = 'bold 28px sans-serif';
  writingContext.fillText('今日の英単語　3回ずつ書こう', 70, 205);
  let writingY = 260;
  writingWords.forEach((word, index) => {
    writingContext.font = 'bold 25px sans-serif'; writingContext.fillStyle = '#111827';
    writingContext.fillText(`${index + 1}. ${word.word}（${word.meaning}）`, 75, writingY);
    writingY += 42;
    for (let line = 0; line < 3; line++) {
      writingContext.strokeStyle = '#94a3b8'; writingContext.lineWidth = 2;
      writingContext.beginPath(); writingContext.moveTo(95, writingY + 25); writingContext.lineTo(1160, writingY + 25); writingContext.stroke();
      writingY += 42;
    }
    writingY += 12;
  });
  pages.push(writingPage);

  for (let pageIndex = 0; pageIndex < 3; pageIndex++) {
    const { canvas, context } = createPage();
    drawHeader(context, progress.date, `${pageIndex + 2} / ${pageCount}`);
    let y = 205;
    questions.slice(pageIndex * 5, pageIndex * 5 + 5).forEach((question, localIndex) => {
      const number = pageIndex * 5 + localIndex + 1;
      context.font = 'bold 24px sans-serif';
      context.fillStyle = '#475569';
      context.fillText(`${number}.［${question.kind}］`, 70, y);
      y += 38;
      context.font = '26px sans-serif';
      context.fillStyle = '#111827';
      y = drawLines(context, question.prompt, 90, y, 1060, 36) + 8;
      context.font = '21px sans-serif';
      context.fillStyle = '#475569';
      y = drawLines(context, question.detail, 90, y, 1060, 30) + 8;
      context.font = '23px sans-serif';
      context.fillStyle = '#111827';
      question.choices.forEach((choice, choiceIndex) => {
        y = drawLines(context, `${choiceIndex + 1}) ${choice}`, 110, y, 1020, 31) + 3;
      });
      y += 28;
      context.strokeStyle = '#cbd5e1';
      context.beginPath(); context.moveTo(70, y); context.lineTo(1170, y); context.stroke();
      y += 24;
    });
    pages.push(canvas);
  }

  if (similarReading) {
    const { canvas, context } = createPage();
    drawHeader(context, progress.date, `5 / ${pageCount}`);
    context.font = 'bold 27px sans-serif';
    context.fillStyle = '#0f172a';
    context.fillText(`16.［長文・${similarReading.type}］${similarReading.title}`, 70, 205);
    context.font = '24px sans-serif';
    let y = drawLines(context, similarReading.passage, 80, 255, 1080, 36) + 28;
    similarReading.questions.forEach((question, index) => {
      context.font = 'bold 23px sans-serif';
      y = drawLines(context, `問${index + 1}　${question.question}`, 80, y, 1080, 33) + 8;
      context.font = '22px sans-serif';
      question.choices.forEach((choice, choiceIndex) => { y = drawLines(context, `${choiceIndex + 1}) ${choice}`, 105, y, 1030, 30) + 3; });
      y += 24;
    });
    pages.push(canvas);
  }

  const grade1 = grade1Selection ? getGrade1ItemsBySelection(grade1Selection) : getGrade1DailyItems(progress.date);
  const { canvas: grade1Page, context: grade1Context } = createPage();
  drawHeader(grade1Context, progress.date, `6 / ${pageCount}`);
  grade1Context.font = 'bold 29px sans-serif';
  grade1Context.fillText('英検4級につながる中1基礎　単語3語＋文法3問', 70, 205);
  grade1Context.font = '22px sans-serif';
  grade1Context.fillText('英検4級の勉強に加えて、基本を毎日少しずつ確認しよう。', 70, 250);
  let grade1Y = 310;
  grade1.words.forEach(({ item }, index) => {
    grade1Context.font = 'bold 25px sans-serif';
    grade1Context.fillStyle = '#111827';
    grade1Context.fillText(`${index + 1}. ${item.word}（${item.meaning}）`, 75, grade1Y);
    grade1Y += 38;
    grade1Context.font = '21px sans-serif';
    grade1Context.fillStyle = '#475569';
    grade1Context.fillText(item.example, 100, grade1Y);
    grade1Y += 42;
    for (let line = 0; line < 2; line++) {
      grade1Context.strokeStyle = '#94a3b8';
      grade1Context.beginPath(); grade1Context.moveTo(100, grade1Y + 20); grade1Context.lineTo(1150, grade1Y + 20); grade1Context.stroke();
      grade1Y += 38;
    }
    grade1Y += 12;
  });
  grade1Context.font = 'bold 25px sans-serif';
  grade1Context.fillStyle = '#111827';
  grade1Context.fillText('文法　日本語を英文にしよう', 75, grade1Y + 5);
  grade1Y += 55;
  grade1.grammar.forEach(({ item }, index) => {
    grade1Context.font = 'bold 22px sans-serif';
    grade1Context.fillText(`${index + 1}.［${item.title}］${item.question}`, 80, grade1Y);
    grade1Y += 38;
    grade1Context.strokeStyle = '#94a3b8';
    grade1Context.beginPath(); grade1Context.moveTo(100, grade1Y + 20); grade1Context.lineTo(1150, grade1Y + 20); grade1Context.stroke();
    grade1Y += 58;
  });
  pages.push(grade1Page);

  const { canvas: answerPage, context } = createPage();
  drawHeader(context, progress.date, `${pageCount} / ${pageCount}`, true);
  let y = 200;
  questions.forEach((question, index) => {
    context.font = 'bold 22px sans-serif';
    context.fillStyle = '#111827';
    y = drawLines(context, `${index + 1}. ${question.answer}`, 70, y, 1100, 30);
    context.font = '19px sans-serif';
    context.fillStyle = '#475569';
    y = drawLines(context, question.explanation, 95, y + 2, 1075, 27) + 12;
  });
  if (similarReading) {
    context.font = 'bold 22px sans-serif';
    context.fillStyle = '#111827';
    y = drawLines(context, '16. 長文', 70, y + 8, 1100, 30);
    similarReading.questions.forEach((question, index) => {
      y = drawLines(context, `問${index + 1} ${question.answer}`, 95, y + 3, 1075, 28);
      context.font = '19px sans-serif';
      context.fillStyle = '#475569';
      y = drawLines(context, `${question.explanation} 根拠：${question.evidence}`, 115, y + 2, 1055, 27) + 8;
      context.font = 'bold 22px sans-serif';
      context.fillStyle = '#111827';
    });
  }
  context.font = 'bold 21px sans-serif';
  context.fillStyle = '#111827';
  y = drawLines(context, '中1基礎', 70, y + 12, 1100, 30);
  grade1.grammar.forEach(({ item }, index) => {
    y = drawLines(context, `${index + 1}. ${item.answer}`, 95, y + 3, 1075, 28);
    context.font = '18px sans-serif';
    context.fillStyle = '#475569';
    y = drawLines(context, item.note, 115, y + 2, 1055, 25) + 6;
    context.font = 'bold 21px sans-serif';
    context.fillStyle = '#111827';
  });
  pages.push(answerPage);

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  pages.forEach((page, index) => {
    if (index > 0) pdf.addPage();
    pdf.addImage(page.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  });
  pdf.save(`eiken4-print-${progress.date}.pdf`);
};
