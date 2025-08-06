
import React from 'react';
import WordTile from './WordTile';

interface WordBankProps {
  words: string[];
  onWordClick: (word: string, index: number) => void;
}

const WordBank: React.FC<WordBankProps> = ({ words, onWordClick }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">単語バンク</h3>
      <div className="flex flex-wrap items-center justify-center min-h-[60px]">
        {words.length === 0 && <p className="text-slate-500">すべての単語を使いました！</p>}
        {words.map((word, index) => (
          <WordTile
            key={`${word}-${index}`} // Note: Key might not be unique if words repeat. For MVP, assume unique or handle.
            word={word}
            onClick={() => onWordClick(word, index)}
            sourceArea="bank"
          />
        ))}
      </div>
    </div>
  );
};

export default WordBank;