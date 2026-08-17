'use client';

import { CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export function TimelineBlock() {
  const events = [
    {
      id: 1,
      title: 'Python Basics Quiz',
      course: 'Programming Grade 10',
      due: 'Today, 11:59 PM',
      isOverdue: false,
      type: 'quiz',
    },
    {
      id: 2,
      title: 'Submit Scratch Project',
      course: 'Creative Computing',
      due: 'Tomorrow, 5:00 PM',
      isOverdue: false,
      type: 'assignment',
    },
    {
      id: 3,
      title: 'Database Schema Diagram',
      course: 'Databases Grade 11',
      due: 'Aug 20, 11:59 PM',
      isOverdue: false,
      type: 'assignment',
    },
  ];

  if (events.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
        <p className="text-xs text-slate-500 dark:text-slate-400">No upcoming activities due</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-500/50 transition-colors shadow-sm shadow-slate-200/20 dark:shadow-none group">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg mt-0.5 ${event.type === 'quiz' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'}`}>
               <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <Link href="#" className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {event.title}
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {event.course}
              </p>
              <p className={`text-xs mt-1.5 font-medium ${event.isOverdue ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                Due: {event.due}
              </p>
            </div>
          </div>
        </div>
      ))}
      <Link href="#" className="block text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-2">
        View all upcoming events
      </Link>
    </div>
  );
}
