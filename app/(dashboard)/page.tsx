'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  HelpCircle,
  Code,
  Terminal,
  Database,
  Cpu,
  GraduationCap,
  Globe,
} from 'lucide-react';
import { getStoredUser, getAllCourses, getAllQuizzes } from '@/lib/db';
import { Course, MediumType, Quiz, User } from '@/types';

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedMedium, setSelectedMedium] = useState<MediumType>('ENGLISH');
  const [showAllGrades, setShowAllGrades] = useState(false);

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    if (currentUser) {
      setSelectedMedium(currentUser.medium || 'ENGLISH');
    }
    setQuizzes(getAllQuizzes());

    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
        else setCourses(getAllCourses());
      })
      .catch(() => setCourses(getAllCourses()));
  }, []);

  if (!user) return null;

  // Filter courses by current user's grade and selected medium
  const filteredCourses = courses.filter((c) => {
    const matchesGrade = showAllGrades || c.grade === user.grade;
    const matchesMedium = c.medium === selectedMedium;
    return matchesGrade && matchesMedium;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-6 h-6 text-cyan-400" />;
      case 'Terminal':
        return <Terminal className="w-6 h-6 text-emerald-400" />;
      case 'Database':
        return <Database className="w-6 h-6 text-purple-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-rose-400" />;
      default:
        return <BookOpen className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-2xl shadow-indigo-950/40 border border-indigo-700/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Active Session • Grade {user.grade} ({selectedMedium === 'SINHALA' ? 'සිංහල මාධ්‍යය' : 'English Medium'})
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {selectedMedium === 'SINHALA' ? `ආයුබෝවන්, ${user.name}! 👋` : `Welcome back, ${user.name}! 👋`}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {selectedMedium === 'SINHALA'
              ? `${user.grade} ශ්‍රේණිය ICT විෂය නිර්දේශයේ පාඩම් සහ අභ්‍යාස මෙතැනින් ලබා ගන්න.`
              : `Here are your Grade ${user.grade} ICT syllabus courses and learning materials.`}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-medium">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{user.streakDays} Day Learning Streak</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-medium">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>{user.points} XP Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Medium Switcher & Course Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
              Grade {user.grade} ICT Courses ({selectedMedium === 'SINHALA' ? 'සිංහල මාධ්‍යය' : 'English Medium'})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curriculum content filtered for Grade {user.grade} in {selectedMedium === 'SINHALA' ? 'Sinhala' : 'English'} medium
            </p>
          </div>

          {/* Medium Toggle Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setSelectedMedium('ENGLISH')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  selectedMedium === 'ENGLISH'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setSelectedMedium('SINHALA')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  selectedMedium === 'SINHALA'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                🇱🇰 සිංහල
              </button>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No courses found for Grade {user.grade} in {selectedMedium === 'SINHALA' ? 'Sinhala' : 'English'} medium yet.
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
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/40 dark:shadow-none hover:border-indigo-500/50 transition-all flex flex-col justify-between"
              >
                {/* Header Banner */}
                <div className={`p-6 bg-gradient-to-r ${course.bannerGradient} text-white space-y-3 relative`}>
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
                      {getIcon(course.iconName)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 text-[10px] font-bold">
                        {course.medium === 'SINHALA' ? '🇱🇰 සිංහල' : '🇬🇧 English'}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 text-[11px] font-bold">
                        Grade {course.grade}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold leading-snug group-hover:translate-x-1 transition-transform">
                    {course.title}
                  </h3>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {course.modules?.length || 0} Module{course.modules?.length > 1 ? 's' : ''}
                    </span>

                    <Link
                      href={`/courses/${course.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1"
                    >
                      {selectedMedium === 'SINHALA' ? 'පාඩම් නරඹන්න' : 'View Syllabus'} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
