
import React from 'react';
import WordTile from './WordTile';

interface SentenceConstructionAreaProps {
  builtWords: string[];
  onWordClick: (word: string, index: number) => void;
}

const SentenceConstructionArea: React.FC<SentenceConstructionAreaProps> = ({ builtWords, onWordClick }) => {
  return (
    <div className="min-h-[80px] bg-slate-200 p-4 rounded-lg shadow-inner mb-6 flex flex-wrap items-center justify-center">
      {builtWords.length === 0 && (
        <p className="text-slate-500 italic">下の単語バンクから単語をタップして、ここに文を組み立てよう。</p>
      )}
      {builtWords.map((word, index) => (
        <WordTile
          key={`${word}-${index}`}
          word={word}
          onClick={() => onWordClick(word, index)}
          sourceArea="sentence"
        />
      ))}
    </div>
  );
};

export default SentenceConstructionArea;