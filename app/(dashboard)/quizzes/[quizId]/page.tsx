'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { getQuizById, saveQuizResult, getStoredUser } from '@/lib/db';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { Timer } from '@/components/quiz/Timer';
import { Quiz, QuizResult } from '@/types';

export default function ActiveQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (quizId) {
      const found = getQuizById(quizId);
      if (found) setQuiz(found);
    }

    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [quizId]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center text-white">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Quiz Not Found</h2>
          <Link href="/quizzes" className="text-cyan-400 font-semibold hover:underline">
            Back to Quizzes Catalog
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionId: number) => {
    const qId = currentQuestion.id;
    const existing = userAnswers[qId] || [];

    if (currentQuestion.type === 'single') {
      setUserAnswers({ ...userAnswers, [qId]: [optionId] });
    } else {
      const nextSelection = existing.includes(optionId)
        ? existing.filter((id) => id !== optionId)
        : [...existing, optionId];
      setUserAnswers({ ...userAnswers, [qId]: nextSelection });
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    const user = getStoredUser();

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          studentName: user?.name || 'Student',
          answers: userAnswers,
          timeSpentSeconds,
        }),
      });

      const result: QuizResult = await res.json();
      saveQuizResult(result);
      router.push(`/quizzes/result/${result.id}`);
    } catch (e) {
      console.error('Quiz submission error', e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto">
      {/* Focus Mode Header */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/quizzes')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Focus Mode"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
              {quiz.title}
            </h1>
            <div className="text-[11px] text-slate-400 font-medium">Focus Assessment Mode</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Timer initialMinutes={quiz.durationMinutes} onTimeUp={handleSubmitQuiz} />
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit Quiz
          </button>
        </div>
      </header>

      {/* Question Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5">
        <div
          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Focus Question Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center space-y-6">
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          selectedOptionIds={userAnswers[currentQuestion.id] || []}
          onSelectOption={handleSelectOption}
        />
      </main>

      {/* Bottom Controls */}
      <footer className="p-4 sm:p-6 border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-xl sticky bottom-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            {Object.keys(userAnswers).length} of {totalQuestions} Answered
          </div>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1 shadow-lg shadow-cyan-500/20"
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1 shadow-lg shadow-emerald-500/20"
            >
              Review & Submit <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>

      {/* Review Modal before submission */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" /> Quiz Summary Review
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span>Total Questions:</span>
                <span className="font-mono font-bold text-white">{totalQuestions}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span>Answered Questions:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {Object.keys(userAnswers).length}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>Unanswered Questions:</span>
                <span className="font-mono font-bold text-amber-400">
                  {totalQuestions - Object.keys(userAnswers).length}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Continue Answering
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white text-xs font-bold shadow-lg transition-all"
              >
                {isSubmitting ? 'Grading...' : 'Final Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
