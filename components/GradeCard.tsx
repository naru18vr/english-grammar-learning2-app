
import React from 'react';
import { Link } from 'react-router-dom';
import { Grade } from '../types';
import BookOpenIcon from './shared/BookOpenIcon';
import ChevronRightIcon from './shared/ChevronRightIcon';

interface GradeCardProps {
  grade: Grade;
}

const GradeCard: React.FC<GradeCardProps> = ({ grade }) => {
  const defaultColor = 'bg-blue-500';
  const baseBgColor = grade.iconColor || defaultColor;


  return (
    <Link 
      to={`/grade/${grade.id}`} 
      className={`block p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${baseBgColor} text-white transform hover:scale-105 active:scale-95`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`p-3 rounded-full ${baseBgColor} inline-block mb-3`}>
             <BookOpenIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">{grade.name}</h2>
          <p className="text-sm opacity-90">{grade.units.length > 0 ? `${grade.units.length} ユニット利用可能` : 'ユニットがありません'}</p>
        </div>
        <ChevronRightIcon className="h-8 w-8 opacity-70" />
      </div>
    </Link>
  );
};

export default GradeCard;