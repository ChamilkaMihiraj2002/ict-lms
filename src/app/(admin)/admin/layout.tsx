import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, HelpCircle, FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-base leading-tight flex items-center gap-2">
                ICT LMS Admin Control

              </h1>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 min-w-0">
        {/* Admin Navigation Sidebar */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 p-4 space-y-2 hidden md:block">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-2">
            Management Tools
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Overview Stats
          </Link>
          <Link href="/admin/classroom" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800"><BookOpen className="w-4 h-4" /> Classroom & Assignments</Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Manage Users & Grades
          </Link>
          <Link
            href="/admin/courses"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Manage ICT Lessons
          </Link>
          <Link
            href="/admin/quizzes"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            Manage Quizzes
          </Link>
          <Link
            href="/admin/papers"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <FileText className="w-4 h-4 text-cyan-500" />
            Manage Past Papers
          </Link>
        </aside>

        {/* Admin Main Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <nav aria-label="Quick management links" className="flex flex-wrap gap-3 text-sm text-indigo-600 dark:text-indigo-300">
            <Link href="/admin/classroom" className="font-semibold">Classroom & assignments</Link>
            <Link href="/admin/users">Students</Link><Link href="/admin/courses">Courses</Link><Link href="/admin/quizzes">Quizzes</Link><Link href="/admin/papers">Papers</Link>
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}
