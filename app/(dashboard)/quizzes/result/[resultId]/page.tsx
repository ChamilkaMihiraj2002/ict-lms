'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { getQuizResultById } from '@/lib/db';
import { QuizResult } from '@/types';
import { formatTime } from '@/lib/utils';

export default function QuizResultPage() {
  const params = useParams();
  const resultId = params?.resultId as string;

  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (resultId) {
      const found = getQuizResultById(resultId);
      if (found) {
        setResult(found);
        if (found.passed) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    }
  }, [resultId]);

  if (!result) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Result Not Found</h2>
        <Link href="/quizzes" className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline">
          Return to Quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Gamified Score Banner */}
      <div
        className={`p-8 sm:p-10 rounded-3xl text-white shadow-2xl space-y-6 text-center relative overflow-hidden ${
          result.passed
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-900 border border-emerald-500/30'
            : 'bg-gradient-to-r from-amber-600 via-rose-600 to-slate-900 border border-rose-500/30'
        }`}
      >
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {result.passed ? 'Assessment Passed!' : 'Requires Review'}
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            {result.scorePercentage}%
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-100">
            {result.passed
              ? `Outstanding work, ${result.studentName}! You have demonstrated mastery in this topic.`
              : `Good effort! Review the explanations below and try again to improve your score.`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20 relative z-10 max-w-lg mx-auto text-center text-xs font-medium">
          <div>
            <div className="text-slate-200 text-[10px] uppercase font-bold">Correct</div>
            <div className="text-lg font-extrabold text-white">
              {result.correctAnswersCount} / {result.totalQuestions}
            </div>
          </div>
          <div>
            <div className="text-slate-200 text-[10px] uppercase font-bold">Time Spent</div>
            <div className="text-lg font-extrabold text-white">
              {formatTime(result.timeSpentSeconds)}
            </div>
          </div>
          <div>
            <div className="text-slate-200 text-[10px] uppercase font-bold">Status</div>
            <div className="text-lg font-extrabold text-white">
              {result.passed ? 'PASSED' : 'RETRY'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
          <Link
            href={`/quizzes/${result.quizId}`}
            className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Itemized Question Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Detailed Answer Breakdown & Explanations
        </h2>

        <div className="space-y-6">
          {result.details.map((detail, idx) => (
            <div
              key={detail.questionId}
              className={`p-6 rounded-3xl border transition-all space-y-4 bg-white dark:bg-slate-900 shadow-md ${
                detail.isCorrect
                  ? 'border-emerald-200 dark:border-emerald-950/80 shadow-emerald-500/5'
                  : 'border-rose-200 dark:border-rose-950/80 shadow-rose-500/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Question {idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {detail.questionText}
                  </h3>
                </div>

                {detail.isCorrect ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4" /> Correct
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-1 shrink-0">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </span>
                )}
              </div>

              {/* Options status */}
              <div className="space-y-2 pt-2">
                {detail.options.map((opt) => {
                  const wasSelected = detail.userSelection.includes(opt.id);
                  const isCorrectOpt = detail.correctAnswers.includes(opt.id);

                  let optClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300';
                  if (isCorrectOpt) {
                    optClass = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-semibold';
                  } else if (wasSelected && !isCorrectOpt) {
                    optClass = 'border-rose-500/60 bg-rose-500/10 text-rose-900 dark:text-rose-300 font-semibold';
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${optClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{String.fromCharCode(65 + opt.id)}.</span>
                        <span>{opt.text}</span>
                      </div>
                      <div className="text-[11px] font-bold">
                        {isCorrectOpt && <span className="text-emerald-600 dark:text-emerald-400">Correct Answer</span>}
                        {wasSelected && !isCorrectOpt && <span className="text-rose-600 dark:text-rose-400">Your Selection</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation box */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-indigo-600 dark:text-cyan-400 block uppercase tracking-wider text-[10px]">
                  Explanation
                </span>
                <p>{detail.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
