let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext ??= new AudioContextClass();
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
};

const playTone = (context: AudioContext, frequency: number, start: number, duration: number, type: OscillatorType, volume: number) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
};

export const playCorrectSound = () => {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime + 0.01;
  playTone(context, 660, now, 0.16, 'sine', 0.28);
  playTone(context, 990, now + 0.17, 0.28, 'sine', 0.3);
};

export const playIncorrectSound = () => {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime + 0.01;
  playTone(context, 190, now, 0.2, 'square', 0.16);
  playTone(context, 150, now + 0.24, 0.3, 'square', 0.16);
};
