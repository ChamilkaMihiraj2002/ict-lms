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
        isCollapsed ? 'w-20 items-center' : 'w-72'
      }`}
    >
      {/* Brand Header & Toggle Button */}
      <div
        className={`p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between w-full h-16 ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3 group overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h1 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight flex items-center gap-1.5 truncate">
                ICT LMS
              </h1>
            </div>
          </Link>
        )}

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all shrink-0 focus:outline-none"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-indigo-500" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Primary Navigation */}
      <div className={`flex-1 py-6 space-y-1 w-full ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
              className={`flex items-center rounded-xl font-medium transition-all duration-200 ${
                isCollapsed
                  ? 'justify-center p-3 my-2 w-full'
                  : 'gap-3 px-4 py-2.5 my-1 text-sm'
              } ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold relative overflow-hidden'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
              )}
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Gamification Stats Footer */}
      {user && (
        <div className="p-4 w-full border-t border-slate-200 dark:border-slate-800">
          <div
            className={`rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 ${
              isCollapsed ? 'p-2 flex flex-col items-center gap-3' : 'p-4'
            }`}
            title={
              isCollapsed
                ? `${user.name} • ${user.streakDays} Day Streak • ${user.points} XP`
                : undefined
            }
          >
            {isCollapsed ? (
              <>
                <div className="flex flex-col items-center gap-1 group">
                  <Flame className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {user.streakDays}
                  </span>
                </div>
                <div className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
                <div className="flex flex-col items-center gap-1 group">
                  <Sparkles className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {user.points}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-100 dark:bg-amber-500/10 rounded-lg">
                        <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.streakDays} Days</div>
                        <div className="text-[10px] text-slate-500">Active Streak</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-cyan-100 dark:bg-cyan-500/10 rounded-lg">
                        <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.points} XP</div>
                        <div className="text-[10px] text-slate-500">Total Points</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
