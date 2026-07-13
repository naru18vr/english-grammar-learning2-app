let activeUtterance: SpeechSynthesisUtterance | null = null;

export type SpeechCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
};

export const isSpeechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/** Starts browser text-to-speech and reports whether playback actually begins. */
export const speakText = (
  text: string,
  lang: string = 'en-US',
  rate: number = 0.9,
  callbacks: SpeechCallbacks = {}
): boolean => {
  if (!isSpeechSupported()) {
    callbacks.onError?.('このブラウザは音声読み上げに対応していません。');
    return false;
  }

  const synthesis = window.speechSynthesis;
  synthesis.cancel();
  synthesis.resume();

  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = 1;

  const voices = synthesis.getVoices();
  const englishVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith('en'));
  const preferred = englishVoices.find(voice => /Google|Samantha|Zoe|Alex/i.test(voice.name)) || englishVoices[0];
  if (preferred) utterance.voice = preferred;

  utterance.onstart = () => callbacks.onStart?.();
  utterance.onend = () => {
    activeUtterance = null;
    callbacks.onEnd?.();
  };
  utterance.onerror = event => {
    activeUtterance = null;
    if (event.error !== 'canceled' && event.error !== 'interrupted') {
      callbacks.onError?.(`音声を再生できませんでした（${event.error}）。`);
    }
  };

  synthesis.speak(utterance);
  return true;
};

if (isSpeechSupported()) window.speechSynthesis.getVoices();
