/**
 * Uses the Web Speech API to speak the given text.
 * @param text The text to be spoken.
 * @param lang The language code (e.g., 'en-US'). Defaults to 'en-US'.
 */
export const speakText = (text: string, lang: string = 'en-US'): void => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech to prevent overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // A little slower can be clearer for learners
    utterance.pitch = 1.0;

    // The voices are loaded asynchronously. We can try to find a good one.
    const voices = window.speechSynthesis.getVoices();
    // Prefer a higher quality voice if available
    const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zoe') || v.name.includes('Alex')));
    if (voice) {
      utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Web Speech API is not supported in this browser.');
  }
};

// The voices are loaded asynchronously. We can listen for the event to ensure they are available.
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // This event fires when the voice list has been loaded.
    // It's a good practice to have this, though our immediate call might still work
    // as browsers often have default voices available right away.
    // We don't need to do anything here, but attaching the listener helps trigger the loading process.
  };
}
