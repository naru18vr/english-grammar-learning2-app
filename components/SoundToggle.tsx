
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import SpeakerWaveIcon from './shared/SpeakerWaveIcon';
import SpeakerXMarkIcon from './shared/SpeakerXMarkIcon';

const SoundToggle: React.FC = () => {
  const { isSoundEnabled, toggleSound } = useAppContext();

  return (
    <button
      onClick={toggleSound}
      className="p-2 rounded-full hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
      aria-label={isSoundEnabled ? "音声をオフにする" : "音声をオンにする"}
    >
      {isSoundEnabled ? (
        <SpeakerWaveIcon className="w-6 h-6 text-slate-700" />
      ) : (
        <SpeakerXMarkIcon className="w-6 h-6 text-slate-500" />
      )}
    </button>
  );
};

export default SoundToggle;
