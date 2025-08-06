
import React, { useState, useEffect } from 'react';
import { Sentence } from '../types';
import Button from './Button';
import CheckCircleIcon from './shared/CheckCircleIcon';
import XCircleIcon from './shared/XCircleIcon';
import LightBulbIcon from './shared/LightBulbIcon';
import { speakText } from '../services/speechService';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';
import { useAppContext } from '../contexts/AppContext';
import SpeakerWaveIcon from './shared/SpeakerWaveIcon';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void; // This will now be explicitly for retrying.
  isCorrect: boolean;
  sentence: Sentence;
  userSentence: string;
  onNext: () => void;
  isLastSentence: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose, // Mapped to retry
  isCorrect,
  sentence,
  onNext,
  isLastSentence
}) => {
  const [internalShow, setInternalShow] = useState(false);
  const { isSoundEnabled } = useAppContext();

  useEffect(() => {
    if (isOpen) {
      const timerId = setTimeout(() => {
        setInternalShow(true);
        if (isSoundEnabled) {
          if (isCorrect) {
            playCorrectSound();
            const correctSentenceText = sentence.words.join(' ').replace(/ ([.,?!])/g, '$1');
            speakText(correctSentenceText, 'en-US');
          } else {
            playIncorrectSound();
          }
        }
      }, 50);
      return () => clearTimeout(timerId);
    } else {
      setInternalShow(false);
      // Stop any speech when the modal closes
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen, isCorrect, sentence, isSoundEnabled]);

  if (!isOpen) return null;

  const correctSentenceText = sentence.words.join(' ').replace(/ ([.,?!])/g, '$1');

  const handleReplaySound = () => {
    if (isSoundEnabled) {
      speakText(correctSentenceText, 'en-US');
    }
  };


  // Render different modals based on correctness
  if (isCorrect) {
    // Clean up sentence for display
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
        <div
          className={`
            bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg
            transform transition-all duration-300 ease-out
            ${internalShow ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-green-600 mb-2">正解！</h2>
            <div className="flex items-center justify-center text-lg text-slate-700 mb-4">
              <p>
                正しい文: <strong className="text-blue-600">{correctSentenceText}</strong>
              </p>
               <button 
                  onClick={handleReplaySound} 
                  className="ml-2 p-1.5 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50" 
                  aria-label="もう一度聞く"
                  disabled={!isSoundEnabled}
                >
                <SpeakerWaveIcon className={`w-6 h-6 ${isSoundEnabled ? 'text-slate-500' : 'text-slate-300'}`} />
              </button>
            </div>
          </div>

          <div className="bg-sky-50 p-4 rounded-lg my-6 border border-sky-200">
            <div className="flex items-start">
              <LightBulbIcon className="w-6 h-6 text-sky-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-md font-semibold text-sky-700 mb-1">{sentence.grammarTag}</h4>
                <p className="text-sm text-sky-600">{sentence.explanation}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={onNext} variant="primary" className="w-full sm:w-auto">
              {isLastSentence ? '結果を見る' : '次の問題へ'}
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    // Incorrect Answer View
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
        <div
          className={`
            bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg
            transform transition-all duration-300 ease-out
            ${internalShow ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-3xl font-bold text-red-600 mb-2">不正解！</h2>
            <p className="text-slate-600 mb-6">もう一度挑戦してみましょう。</p>
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">
              もう一度挑戦
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default ResultModal;
