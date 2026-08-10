'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  HelpCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { getCourseById, getStoredUser } from '@/lib/db';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Course, User } from '@/types';

export default function CourseOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (courseId) {
      // First try fetching from API (PostgreSQL database)
      fetch(`/api/courses`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const found = data.find((c: any) => c.id === courseId);
            if (found) setCourse(found);
            else setCourse(getCourseById(courseId) || null);
          } else {
            setCourse(getCourseById(courseId) || null);
          }
        })
        .catch(() => setCourse(getCourseById(courseId) || null));
    }
    setUser(getStoredUser());
  }, [courseId]);

  if (!course) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Course Not Found</h2>
        <Link href="/" className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const completedLessonIds = user?.completedLessonIds || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Course Header Banner */}
      <div className={`p-8 rounded-3xl bg-gradient-to-r ${course.bannerGradient} text-white space-y-4 shadow-xl`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
            Grade {course.grade} ICT
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium">
            {course.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-950/40 border border-white/20 text-[11px] font-bold">
            {course.medium === 'SINHALA' ? '🇱🇰 සිංහල මාධ්‍යය' : '🇬🇧 English Medium'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {course.title}
        </h1>

        <div className="pt-2 flex items-center gap-6 text-xs text-slate-100 font-medium">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Total Lessons
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" /> Curriculum Grade {course.grade}
          </div>
        </div>
      </div>

      {/* Course Overview & Rendered Markdown Description */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-cyan-400" /> About This Course
        </h2>
        <MarkdownRenderer content={course.description} />
      </div>

      {/* Modules & Lessons Syllabus */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Course Syllabus & Lessons
        </h2>

        <div className="space-y-6">
          {course.modules?.map((module, mIdx) => (
            <div
              key={module.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md shadow-slate-200/50 dark:shadow-none"
            >
              {/* Module Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                  Module {mIdx + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {module.title}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <MarkdownRenderer content={module.description} />
                </div>
              </div>

              {/* Lessons List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {module.lessons?.map((lesson) => {
                  const isDone = completedLessonIds.includes(lesson.id) || lesson.isCompleted;
                  return (
                    <div
                      key={lesson.id}
                      className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                        ) : (
                          <PlayCircle className="w-6 h-6 text-indigo-500 shrink-0" />
                        )}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} Mins
                            </span>
                            {isDone && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/courses/lesson/${lesson.id}`}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                          isDone
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        {isDone ? 'Review' : 'Start Reading'}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
