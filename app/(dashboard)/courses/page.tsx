'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Code, Terminal, Database, Cpu, Search, GraduationCap, Filter } from 'lucide-react';
import { getStoredUser, getAllCourses } from '@/lib/db';
import { Course, User } from '@/types';

export default function CoursesCatalogPage() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    if (currentUser) {
      setSelectedGrade(currentUser.grade);
    }

    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
        else setCourses(getAllCourses());
      })
      .catch(() => setCourses(getAllCourses()));
  }, []);

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

  const filtered = courses.filter((c) => {
    const matchesGrade = selectedGrade === 'ALL' || c.grade === selectedGrade;
    const matchesQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-600 dark:text-cyan-400" />
            ICT Course Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {user ? `Filtered for Grade ${user.grade} Curriculum` : 'National ICT Curriculum'}
          </p>
        </div>

        {/* Filter Toggle */}
        {user && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedGrade(user.grade)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedGrade === user.grade
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              My Grade ({user.grade})
            </button>
            <button
              onClick={() => setSelectedGrade('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedGrade === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              All Grades
            </button>
          </div>
        )}
      </div>

      {/* Course Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No courses found for the selected filter.
          </p>
          <button
            onClick={() => setSelectedGrade('ALL')}
            className="text-xs text-indigo-600 dark:text-cyan-400 font-bold hover:underline"
          >
            Show All Curriculum Courses →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
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
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 text-[11px] font-bold">
                    Grade {course.grade}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-snug group-hover:translate-x-1 transition-transform">
                  {course.title}
                </h3>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {course.description ? course.description.replace(/<[^>]*>/g, '').replace(/[#*`_~>]/g, '').replace(/\n+/g, ' ').trim() : ''}
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {course.modules?.length || 0} Module{course.modules?.length > 1 ? 's' : ''}
                  </span>

                  <Link
                    href={`/courses/${course.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1"
                  >
                    View Course <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
