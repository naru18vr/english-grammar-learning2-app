// services/soundService.ts

const playSound = (frequency: number, type: OscillatorType) => {
  if (typeof window.AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined') {
    console.warn('Web Audio API is not supported in this browser.');
    return;
  }
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01); // Quick fade in

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  oscillator.start(audioCtx.currentTime);
  
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.2); // Fade out
  oscillator.stop(audioCtx.currentTime + 0.2);
};

export const playCorrectSound = () => {
  playSound(880.0, 'sine'); // Higher, pleasant tone
};

export const playIncorrectSound = () => {
  playSound(220.0, 'square'); // Lower, buzzer-like tone
};