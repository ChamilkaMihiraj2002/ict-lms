'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogOut, ShieldCheck, Settings, Award, Flame } from 'lucide-react';
import { logoutStoredUser } from '@/lib/db';
import { User } from '@/types';

interface ProfileDropdownProps {
  user: User;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutStoredUser();
    setIsOpen(false);
    router.push('/login');
  };

  const isAdmin = (user as any).role === 'ADMIN';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-indigo-500/30 overflow-hidden shrink-0">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0)
          )}
        </div>
        <div className="hidden lg:block text-left">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            {user.name}
            {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {isAdmin ? 'Administrator' : `Grade ${user.grade} Student`}
          </div>
        </div>
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-950/20 z-50 overflow-hidden space-y-1 p-2">
          {/* User Info Header */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {user.name}
              {isAdmin && (
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
                  ADMIN
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold border-t border-slate-200/50 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> {user.streakDays}d Streak
              </span>
              <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
                <Award className="w-3.5 h-3.5" /> {user.points} XP
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-0.5 pt-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-indigo-500" /> My Profile
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-500" /> Admin Control Panel
              </Link>
            )}
          </div>

          {/* Logout Button */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-rose-500" /> Sign Out / Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
