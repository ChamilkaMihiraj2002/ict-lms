'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Award, Home, HelpCircle, FileText, GraduationCap, Flame, Sparkles } from 'lucide-react';
import { getStoredUser } from '@/lib/db';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Quizzes', href: '/quizzes', icon: HelpCircle },
    { name: 'Past Papers', href: '/papers', icon: FileText },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shrink-0 h-screen sticky top-0 z-30 transition-all">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight flex items-center gap-1.5">
              ICT LMS
              <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                Grades 6-13
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ICT Learning Platform</p>
          </div>
        </Link>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 py-6 px-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Gamification Stats Footer */}
      {user && (
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 border border-indigo-200/50 dark:border-indigo-800/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {user.streakDays} Day Streak!
              </span>
            </div>
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 text-[11px] font-bold text-amber-700 dark:text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {user.points} XP
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Grade {user.grade} Student Account
          </div>
        </div>
      )}
    </aside>
  );
}
