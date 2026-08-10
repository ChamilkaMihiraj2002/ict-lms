'use client';

import { Question } from '@/types';
import { CheckCircle2, Circle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionIds: number[];
  onSelectOption: (optionId: number) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionIds,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
      {/* Question Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-cyan-300 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-slate-700">
            {question.type === 'multiple' ? 'Multiple Choice (Select all)' : 'Single Choice'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {question.text}
        </h2>
      </div>

      {/* Answer Options List */}
      <div className="space-y-3 pt-2">
        {question.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 group ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-indigo-300 dark:hover:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-slate-700'
                  }`}
                >
                  {String.fromCharCode(65 + option.id)}
                </div>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                  {option.text}
                </span>
              </div>

              {isSelected ? (
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-slate-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
