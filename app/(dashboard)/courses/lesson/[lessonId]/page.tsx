'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Terminal,
  FileCode,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { getAllCourses, markLessonAsCompleted, getStoredUser } from '@/lib/db';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Lesson, User } from '@/types';

export default function LessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());

    // Search for lesson in courses list
    const allCourses = getAllCourses();
    for (const course of allCourses) {
      for (const module of course.modules) {
        const found = module.lessons.find((l) => l.id === lessonId);
        if (found) {
          setLesson(found);
          const currentUser = getStoredUser();
          if (currentUser?.completedLessonIds?.includes(found.id)) {
            setIsCompleted(true);
          }
          break;
        }
      }
    }
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Lesson Not Found</h2>
        <Link href="/" className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleMarkComplete = () => {
    markLessonAsCompleted(lesson.id);
    setIsCompleted(true);
    setUser(getStoredUser());
  };

  return (
    <div className="flex gap-8 relative max-w-6xl mx-auto">
      {/* Main Content Column (max-w-3xl for optimal reading comfort) */}
      <div className="flex-1 max-w-3xl space-y-8">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handleMarkComplete}
            disabled={isCompleted}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
              isCompleted
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Lesson Completed (+25 XP)' : 'Mark as Complete'}
          </button>
        </div>

        {/* Lesson Header */}
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
            <span>Lesson {lesson.order}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} Mins Read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {lesson.title}
          </h1>
        </div>

        {/* Lesson Body Sections */}
        <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-base">
          {lesson.sections.map((sec, idx) => (
            <div key={idx} id={`section-${idx}`} className="space-y-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-indigo-600 dark:bg-cyan-400 inline-block" />
                {sec.heading}
              </h2>

              <MarkdownRenderer content={sec.text} />

              {sec.tip && (
                <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 text-sm font-medium flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>{sec.tip}</div>
                </div>
              )}

              {/* Code Snippet & Live Runner if separate snippet object exists */}
              {sec.codeSnippet && (
                <MarkdownRenderer
                  content={`\`\`\`${sec.codeSnippet.language}\n${sec.codeSnippet.code}\n\`\`\``}
                />
              )}
            </div>
          ))}
        </div>

        {/* Lesson Footer Controls */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <Link
            href="/courses/g10-web-dev"
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            Course Overview
          </Link>

          <Link
            href="/quizzes/g10-web-quiz-1"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            Take Quiz Assessment <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Sticky Table of Contents Sidebar (Desktop) */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md shadow-slate-200/50 dark:shadow-none">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Table of Contents
          </div>
          <nav className="space-y-2">
            {lesson.sections.map((sec, idx) => (
              <a
                key={idx}
                href={`#section-${idx}`}
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors leading-snug"
              >
                {idx + 1}. {sec.heading}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
