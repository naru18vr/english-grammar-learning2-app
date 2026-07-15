import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';

const VocabularyHomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-grow bg-gradient-to-b from-emerald-50 via-slate-50 to-white px-4 py-5 sm:p-7">
      <header className="max-w-xl mx-auto">
        <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />ホームに戻る
        </Button>
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-500 p-6 text-white shadow-xl shadow-emerald-200">
          <p className="text-xs font-bold tracking-widest text-emerald-100">VOCABULARY</p>
          <h1 className="mt-2 text-3xl font-bold">英単語</h1>
          <p className="mt-2 text-sm text-emerald-50">学年ごとに確認テストと定着マップで覚えよう。</p>
        </div>
      </header>

      <main className="max-w-xl mx-auto mt-6 space-y-4">
        <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 p-3"><BookOpenIcon className="h-7 w-7 text-emerald-700" /></span>
            <div><p className="text-xs font-bold text-emerald-600">利用できます</p><h2 className="text-xl font-bold text-slate-800">中学1年生</h2><p className="text-sm text-slate-500">基本72語</p></div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link to="/vocabulary/grade1/quiz" className="rounded-xl bg-emerald-600 p-4 text-white shadow transition active:scale-95">
              <p className="text-xs font-bold text-emerald-100">毎回10問</p><h3 className="mt-1 font-bold">確認テスト</h3><p className="mt-1 text-xs text-emerald-50">意味を4択で確認</p>
            </Link>
            <Link to="/vocabulary/grade1/map" className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-teal-900 transition active:scale-95">
              <p className="text-xs font-bold text-teal-600">進み具合</p><h3 className="mt-1 font-bold">英単語マップ</h3><p className="mt-1 text-xs text-teal-700">覚えた語がひと目で分かる</p>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-sky-100 p-3"><BookOpenIcon className="h-7 w-7 text-sky-700" /></span>
            <div><p className="text-xs font-bold text-sky-600">利用できます</p><h2 className="text-xl font-bold text-slate-800">中学2年生</h2><p className="text-sm text-slate-500">NEW HORIZON・基本96語</p></div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link to="/vocabulary/grade2/quiz" className="rounded-xl bg-sky-600 p-4 text-white shadow transition active:scale-95">
              <p className="text-xs font-bold text-sky-100">毎回10問</p><h3 className="mt-1 font-bold">確認テスト</h3><p className="mt-1 text-xs text-sky-50">意味を4択で確認</p>
            </Link>
            <Link to="/vocabulary/grade2/map" className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-900 transition active:scale-95">
              <p className="text-xs font-bold text-sky-600">進み具合</p><h3 className="mt-1 font-bold">英単語マップ</h3><p className="mt-1 text-xs text-sky-700">覚えた語がひと目で分かる</p>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-indigo-100 p-3"><BookOpenIcon className="h-7 w-7 text-indigo-700" /></span>
            <div><p className="text-xs font-bold text-indigo-600">利用できます</p><h2 className="text-xl font-bold text-slate-800">中学3年生</h2><p className="text-sm text-slate-500">NEW HORIZON・基本108語</p></div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link to="/vocabulary/grade3/quiz" className="rounded-xl bg-indigo-600 p-4 text-white shadow transition active:scale-95">
              <p className="text-xs font-bold text-indigo-100">毎回10問</p><h3 className="mt-1 font-bold">確認テスト</h3><p className="mt-1 text-xs text-indigo-50">意味を4択で確認</p>
            </Link>
            <Link to="/vocabulary/grade3/map" className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-900 transition active:scale-95">
              <p className="text-xs font-bold text-indigo-600">進み具合</p><h3 className="mt-1 font-bold">英単語マップ</h3><p className="mt-1 text-xs text-indigo-700">覚えた語がひと目で分かる</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VocabularyHomePage;
