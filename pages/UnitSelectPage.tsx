
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import UnitCard from '../components/UnitCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import Button from '../components/Button';

const UnitSelectPage: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const { getGradeById } = useAppContext();
  const navigate = useNavigate();

  if (!gradeId) {
    return <div className="text-center p-8 text-red-500">無効な学年IDです。</div>;
  }

  const grade = getGradeById(gradeId);

  if (!grade) {
    return <div className="text-center p-8"><LoadingSpinner /> <p className="mt-2">学年情報を読み込み中、または無効な学年です...</p></div>;
  }
  
  const gradeColorClass = grade.iconColor || 'bg-blue-500';

  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-800">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          学年選択に戻る
        </Button>
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">{grade.name}</h1>
            <p className="mt-2 text-slate-600">練習するユニットを選んでください。</p>
        </div>
      </header>

      {grade.units.length === 0 ? (
        <p className="text-center text-slate-500 py-10">この学年で利用可能なユニットはまだありません。もうしばらくお待ちください！</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 auto-rows-fr" 
             style={{ gridTemplateRows: 'minmax(100px, auto)' }}>
          {grade.units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} gradeId={grade.id} colorClass={gradeColorClass} />
          ))}
        </div>
      )}
       <footer className="text-center mt-12 text-sm text-slate-500">
        <p>この調子で頑張ろう！</p>
      </footer>
    </div>
  );
};

export default UnitSelectPage;