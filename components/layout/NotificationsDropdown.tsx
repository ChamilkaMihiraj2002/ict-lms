'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, Sparkles, BookOpen, HelpCircle, Award, X } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'quiz' | 'lesson' | 'achievement' | 'system';
  linkUrl?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New Quiz Released! 📝',
    message: 'Grade 10 HTML & Web Fundamentals knowledge test is now active.',
    timestamp: '10 mins ago',
    read: false,
    type: 'quiz',
    linkUrl: '/quizzes/g10-web-quiz-1',
  },
  {
    id: 'n2',
    title: 'Streak Achievement Unlocked! 🔥',
    message: 'You achieved a 5-day continuous learning streak! +50 XP bonus awarded.',
    timestamp: '2 hours ago',
    read: false,
    type: 'achievement',
  },
  {
    id: 'n3',
    title: 'New Syllabus Material 📚',
    message: 'Python Variables & Control Flow lesson uploaded for Grade 11 ICT.',
    timestamp: '1 day ago',
    read: false,
    type: 'lesson',
    linkUrl: '/courses/g11-python-prog',
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-cyan-500" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-cyan-400 transition-all focus:outline-none flex items-center justify-center"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 px-1.5 py-0.2 text-[10px] font-black leading-none text-white bg-indigo-600 dark:bg-cyan-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-950/20 z-50 overflow-hidden space-y-2">
          {/* Popover Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-cyan-300 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No notifications</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-4 transition-colors flex items-start gap-3 cursor-pointer ${
                    !item.read
                      ? 'bg-indigo-50/40 dark:bg-slate-800/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.message}
                    </p>

                    {item.linkUrl && (
                      <Link
                        href={item.linkUrl}
                        onClick={() => setIsOpen(false)}
                        className="inline-block pt-1 text-[11px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-cyan-400 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
