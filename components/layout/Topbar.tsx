'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NotificationsDropdown } from '@/components/layout/NotificationsDropdown';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { getStoredUser } from '@/lib/db';
import { User } from '@/types';

export function Topbar({ pageTitle }: { pageTitle?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Page Title & Search */}
      <div className="flex items-center gap-4 flex-1">
        {pageTitle ? (
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 hidden sm:block">
            {pageTitle}
          </h1>
        ) : null}

        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search ICT lessons, topics, or quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Profile Dropdown / Login Link */}
        {user ? (
          <ProfileDropdown user={user} />
        ) : (
          <Link
            href="/login"
            className="text-xs font-semibold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            <UserIcon className="w-3.5 h-3.5" /> Login
          </Link>
        )}
      </div>
    </header>
  );
}
