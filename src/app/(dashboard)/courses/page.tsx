'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, GraduationCap, Filter } from 'lucide-react';
import { getStoredUser } from '@/features/auth/lib/user-storage';
import { Course, User, MediumType } from '@/types';
import { CourseCard } from '@/features/courses/components/CourseCard';

export default function CoursesCatalogPage() {
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedium, setSelectedMedium] = useState<MediumType>('ENGLISH');

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    if (currentUser) {
      setSelectedGrade(currentUser.grade);
      setSelectedMedium(currentUser.medium || 'ENGLISH');
    }

    fetch('/api/auth/me').then(res => res.json()).then(data => { if (data.user) { setUser(data.user); setSelectedGrade(data.user.grade); setSelectedMedium(data.user.medium); } }).catch(() => {});

    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
        else setError(data.error || 'Unable to load courses.');
      })
      .catch(() => setError('Unable to load courses. Please reload to retry.'));
  }, []);

  const filtered = courses.filter((c) => {
    const matchesGrade = selectedGrade === 'ALL' || c.grade === selectedGrade;
    const matchesQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesQuery && c.medium === selectedMedium;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-cyan-400" />
            ICT Lessons Catalog
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {user ? `Filtered for Grade ${user.grade} Curriculum` : 'National ICT Curriculum'}
          </p>
        </div>

        {/* Filter Toggle */}
        {user && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedGrade(user.grade)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                selectedGrade === user.grade
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              My Grade ({user.grade})
            </button>
            <button
              onClick={() => setSelectedGrade('ALL')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                selectedGrade === 'ALL'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              All Grades
            </button>
          </div>
        )}
      </div>

      {/* Course Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 border-dashed dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">No lessons found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any lessons matching your criteria.
            </p>
          </div>
          <button
            onClick={() => setSelectedGrade('ALL')}
            className="mt-4 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Show All Curriculum Lessons →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} selectedMedium={selectedMedium} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
