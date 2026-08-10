'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Home,
  HelpCircle,
  FileText,
  GraduationCap,
  Flame,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { getStoredUser } from '@/lib/db';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    setUser(getStoredUser());
    const savedState = localStorage.getItem('ict_sidebar_collapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('ict_sidebar_collapsed', String(next));
      return next;
    });
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Lessons', href: '/courses', icon: BookOpen },
    { name: 'Quizzes', href: '/quizzes', icon: HelpCircle },
    { name: 'Past Papers', href: '/papers', icon: FileText },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shrink-0 h-screen sticky top-0 z-30 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header & Toggle Button */}
      <div
        className={`p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between ${
          isCollapsed ? 'flex-col gap-3 py-4' : ''
        }`}
      >
        <Link href="/" className="flex items-center gap-3 group overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>

          {!isCollapsed && (
            <div className="truncate">
              <h1 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight flex items-center gap-1.5 truncate">
                ICT LMS
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800 shrink-0">
                  Grades 6-13
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                ICT Learning Platform
              </p>
            </div>
          )}
        </Link>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 transition-all shrink-0 focus:outline-none"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-indigo-500" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Primary Navigation */}
      <div className={`flex-1 py-6 space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Main Menu
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center rounded-xl font-medium transition-all ${
                isCollapsed
                  ? 'justify-center p-3 my-1.5'
                  : 'gap-3 px-3.5 py-2.5 my-0.5 text-sm'
              } ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Gamification Stats Footer */}
      {user && (
        <div
          className={`m-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 border border-indigo-200/50 dark:border-indigo-800/40 ${
            isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-4'
          }`}
          title={
            isCollapsed
              ? `${user.name} • ${user.streakDays} Day Streak • ${user.points} XP`
              : undefined
          }
        >
          {isCollapsed ? (
            <>
              <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {user.streakDays}d
                </span>
              </div>
              <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                  {user.points}
                </span>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </aside>
  );
}
