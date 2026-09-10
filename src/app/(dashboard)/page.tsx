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
  GraduationCap,
  LayoutGrid,
  History,
  Star,
} from 'lucide-react';
import { getStoredUser, saveStoredUser } from '@/features/auth/lib/user-storage';
import { Course, MediumType, User } from '@/types';
import { TimelineBlock } from '@/features/classroom/components/TimelineBlock';
import { CourseCard } from '@/features/courses/components/CourseCard';

export default function StudentDashboard() {
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedMedium, setSelectedMedium] = useState<MediumType>('ENGLISH');
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'starred'>('all');

  useEffect(() => {
    const currentUser = getStoredUser();
    if (currentUser) {
      setUser(currentUser);
      setSelectedMedium(currentUser.medium || 'ENGLISH');
    }

    // Fetch live session from JWT cookie via /api/auth/me
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          saveStoredUser(data.user);
          if (data.user.medium) setSelectedMedium(data.user.medium);
        }
      })
      .catch(() => {});

    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
        else setError(data.error || 'Unable to load courses.');
      })
      .catch(() => setError('Unable to load courses. Please reload to retry.'));
  }, []);

  if (!user) return null;

  // Filter courses by current user's grade and selected medium
  const filteredCourses = courses.filter((c) => {
    const matchesGrade = c.grade === user.grade;
    const matchesMedium = c.medium === selectedMedium;
    const lessons = c.modules.flatMap(m => m.lessons);
    const completed = lessons.filter(l => user.completedLessonIds.includes(l.id)).length;
    const matchesTab = activeTab === 'all' || (activeTab === 'recent' ? completed > 0 && completed < lessons.length : lessons.length > 0 && completed === lessons.length);
    return matchesGrade && matchesMedium && matchesTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
      {/* 1. Enhanced Welcome Banner (Moodle style Hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/20 border border-slate-800">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-300 text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {selectedMedium === 'SINHALA' ? 'සිංහල මාධ්‍යය' : 'English Medium'}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {selectedMedium === 'SINHALA' ? `ආයුබෝවන්, ${user.name}!` : `Welcome back, ${user.name}!`}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              {selectedMedium === 'SINHALA'
                ? `ඔබගේ ${user.grade} ශ්‍රේණියේ ඉගෙනුම් කටයුතු මෙතැනින් කරගෙන යන්න.`
                : `You're making great progress in Grade ${user.grade}. Ready to continue learning?`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="flex flex-col items-center justify-center bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 min-w-[120px]">
              <Flame className="w-6 h-6 text-amber-500 mb-1" />
              <span className="text-2xl font-bold text-white">{user.streakDays}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Day Streak</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 min-w-[120px]">
              <Award className="w-6 h-6 text-cyan-400 mb-1" />
              <span className="text-2xl font-bold text-white">{user.points}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">XP Earned</span>
            </div>
          </div>
        </div>
      </div>

      <section className="xl:hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"><h2 className="font-bold mb-4">Your study planner</h2><TimelineBlock /></section>
      <Link href="/classroom" className="flex items-center justify-between gap-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 p-5"><div><h2 className="font-bold">Classroom & assignments</h2><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your class schedule, homework, announcements and grades.</p></div><ArrowRight className="shrink-0 text-indigo-600" /></Link>
      {/* 2. Course Overview Section (Moodle 'My Courses' style) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Course Overview
            </h2>
            
            {/* Tabs */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> All
              </button>
              <button 
                onClick={() => setActiveTab('recent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'recent' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
              >
                <History className="w-3.5 h-3.5" /> In progress
              </button>
              <button 
                onClick={() => setActiveTab('starred')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'starred' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
              >
                <Star className="w-3.5 h-3.5" /> Completed
              </button>
            </div>
          </div>

          {/* Medium Toggle Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setSelectedMedium('ENGLISH')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedMedium === 'ENGLISH'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setSelectedMedium('SINHALA')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedMedium === 'SINHALA'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                🇱🇰 SI
              </button>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 border-dashed dark:border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">No courses found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                There are currently no {selectedMedium === 'SINHALA' ? 'Sinhala' : 'English'} medium courses available for Grade {user.grade} in this view.
              </p>
            </div>
            <button
              onClick={() => setSelectedMedium(selectedMedium === 'ENGLISH' ? 'SINHALA' : 'ENGLISH')}
              className="mt-4 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              Switch to {selectedMedium === 'ENGLISH' ? 'Sinhala Medium' : 'English Medium'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} selectedMedium={selectedMedium} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
