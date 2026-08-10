'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, Clock, Award, CheckCircle2, ArrowRight, Sparkles, Globe } from 'lucide-react';
import { getStoredQuizResults, getStoredUser } from '@/lib/db';
import { MediumType, Quiz, QuizResult, User } from '@/types';

export default function QuizzesCatalogPage() {
  const [user, setUser] = useState<User | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [completedResults, setCompletedResults] = useState<QuizResult[]>([]);
  const [selectedMedium, setSelectedMedium] = useState<MediumType>('ENGLISH');
  const [filterTab, setFilterTab] = useState<'TODO' | 'COMPLETED' | 'ALL'>('ALL');

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    if (currentUser) {
      setSelectedMedium(currentUser.medium || 'ENGLISH');
    }
    setCompletedResults(getStoredQuizResults());

    fetch('/api/quizzes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuizzes(data);
      })
      .catch(() => {});
  }, []);

  const completedQuizIds = completedResults.map((r) => r.quizId);

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesMedium = q.medium === selectedMedium;
    if (!matchesMedium) return false;

    if (filterTab === 'TODO') return !completedQuizIds.includes(q.id);
    if (filterTab === 'COMPLETED') return completedQuizIds.includes(q.id);
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-indigo-600 dark:text-cyan-400" />
            ICT Quiz Assessments ({selectedMedium === 'SINHALA' ? 'සිංහල මාධ්‍යය' : 'English Medium'})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {selectedMedium === 'SINHALA'
              ? 'ඔබේ ICT විෂය දැනුම පරීක්ෂා කිරීමේ ප්‍රශ්න පත්‍ර'
              : 'Test your comprehension with instant automatic feedback'}
          </p>
        </div>

        {/* Medium Switcher & Tab Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setSelectedMedium('ENGLISH')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedMedium === 'ENGLISH'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setSelectedMedium('SINHALA')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedMedium === 'SINHALA'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              🇱🇰 සිංහල
            </button>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-900 rounded-2xl border border-slate-300/60 dark:border-slate-800">
            {(['ALL', 'TODO', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterTab === tab
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab === 'TODO' ? 'To Do' : 'Done'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Cards Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No quizzes found for {selectedMedium === 'SINHALA' ? 'Sinhala' : 'English'} medium yet.
          </p>
          <button
            onClick={() => setSelectedMedium(selectedMedium === 'ENGLISH' ? 'SINHALA' : 'ENGLISH')}
            className="text-xs text-indigo-600 dark:text-cyan-400 font-bold hover:underline"
          >
            Switch to {selectedMedium === 'ENGLISH' ? 'Sinhala Medium (සිංහල)' : 'English Medium'} →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const result = completedResults.find((r) => r.quizId === quiz.id);
            const isDone = Boolean(result);

            return (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5 flex flex-col justify-between hover:border-indigo-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-cyan-300 text-xs font-bold border border-indigo-100 dark:border-slate-700">
                        Grade {quiz.grade} ICT
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                        {quiz.medium === 'SINHALA' ? '🇱🇰 සිංහල' : '🇬🇧 English'}
                      </span>
                    </div>

                    {isDone ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> {result?.scorePercentage}%
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {quiz.questions?.length || 0} Questions
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {quiz.durationMinutes} Mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Pass: {quiz.passingScore}%
                    </span>
                  </div>

                  {isDone && result ? (
                    <Link
                      href={`/quizzes/result/${result.id}`}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {selectedMedium === 'SINHALA' ? 'ප්‍රතිඵල නරඹන්න' : 'View Score Breakdown'} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      {selectedMedium === 'SINHALA' ? 'පරීක්ෂණය ආරම්භ කරන්න' : 'Start Quiz'} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
