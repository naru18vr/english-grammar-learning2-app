
import React from 'react';
import { Link } from 'react-router-dom';
import { Unit } from '../types';
import ChevronRightIcon from './shared/ChevronRightIcon';

interface UnitCardProps {
  unit: Unit;
  gradeId: string;
  colorClass?: string;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, gradeId, colorClass = 'bg-sky-500' }) => {
  const isDisabled = unit.sentences.length === 0;
  
  // Ensure hover color is derived with a slightly darker shade
  const colorName = colorClass.split('-')[0]; // e.g., 'bg'
  const colorBase = colorClass.split('-')[1]; // e.g., 'sky'
  const baseShadeValue = parseInt(colorClass.split('-')[2] || '500');
  const hoverShadeValue = Math.min(900, baseShadeValue + 100);
  const hoverBgClass = `${colorName}-${colorBase}-${hoverShadeValue}`;


  const destinationUrl = `/grade/${gradeId}/unit/${unit.id}/sets`;

  if (isDisabled) {
    return (
      <div className="p-6 bg-slate-300 rounded-xl shadow-md text-slate-600 cursor-not-allowed">
        <h3 className="text-xl font-semibold">{unit.title}</h3>
        <p className="text-sm opacity-80 mt-1">
          {unit.sentences.length} 問
        </p>
        <p className="text-xs opacity-60 mt-2">準備中！</p>
      </div>
    );
  }

  return (
    <Link
      to={destinationUrl}
      className={`block p-6 ${colorClass} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white transform hover:scale-105 active:scale-95 ${hoverBgClass.replace('bg-','hover:bg-')}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{unit.title}</h3>
          <p className="text-sm opacity-90 mt-1">
            {`${unit.sentences.length} 問 利用可能`}
          </p>
        </div>
        <ChevronRightIcon className="h-6 w-6 opacity-70" />
      </div>
    </Link>
  );
};

export default UnitCard;