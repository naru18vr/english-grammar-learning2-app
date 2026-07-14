
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import GradeCard from '../components/GradeCard';
import { Link } from 'react-router-dom';
import SparklesIcon from '../components/shared/SparklesIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import ClockIcon from '../components/shared/ClockIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';


const HomePage: React.FC = () => {
  const { grades } = useAppContext();

  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-10 pt-8 sm:pt-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">英語の文法の練習アプリ</h1>
        <p className="text-slate-600 mt-2 text-base sm:text-lg">学年を選んで学習を開始しましょう！</p>
      </header>
      
      <main className="max-w-xl mx-auto">
        <div className="flex flex-col gap-6">
          <Link to="/guide" className="block rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4 text-indigo-800 shadow hover:shadow-md transition-all">
            <div className="flex items-center justify-between"><div className="flex items-center"><BookOpenIcon className="h-7 w-7 mr-3"/><div><h2 className="font-bold text-lg">このアプリの使い方</h2><p className="text-sm">毎日の進め方・できることを見る</p></div></div><ChevronRightIcon className="h-6 w-6"/></div>
          </Link>
          {grades.map((grade) => (
            <GradeCard key={grade.id} grade={grade} />
          ))}

          <Link
            to="/eiken4"
            className="block p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-indigo-600 text-white transform hover:scale-105 active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="p-3 rounded-full bg-indigo-600 inline-block mb-3">
                  <BookOpenIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">英検4級</h2>
                <p className="text-sm opacity-90">単語カード・並べ替え・結果カード</p>
              </div>
              <ChevronRightIcon className="h-8 w-8 opacity-70" />
            </div>
          </Link>

          <Link
            to="/random-challenge-options"
            className="block p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-amber-500 text-white transform hover:scale-105 active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`p-3 rounded-full bg-amber-500 inline-block mb-3`}>
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">ランダムチャレンジ</h2>
                <p className="text-sm opacity-90">学年とユニットを選んで実力テスト！</p>
              </div>
              <ChevronRightIcon className="h-8 w-8 opacity-70" />
            </div>
          </Link>

          <Link
            to="/progress"
            className="block p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-teal-500 text-white transform hover:scale-105 active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`p-3 rounded-full bg-teal-500 inline-block mb-3`}>
                  <ClockIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">毎日の記録</h2>
                <p className="text-sm opacity-90">毎日なにをやったのかを振り返ろう</p>
              </div>
              <ChevronRightIcon className="h-8 w-8 opacity-70" />
            </div>
          </Link>
        </div>
      </main>
      
      <footer className="text-center mt-12 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} 英語文法学習アプリ. 楽しく学習しましょう！</p>
      </footer>
    </div>
  );
};

export default HomePage;
