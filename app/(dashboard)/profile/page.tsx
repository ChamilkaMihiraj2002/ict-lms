'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Award,
  Flame,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { getStoredUser, saveStoredUser, logoutStoredUser, getStoredQuizResults } from '@/lib/db';
import { GradeLevel, MediumType, QuizResult, User } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(10);
  const [medium, setMedium] = useState<MediumType>('ENGLISH');
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = getStoredUser();
    if (current) {
      setUser(current);
      setName(current.name);
      setEmail(current.email);
      setGrade(current.grade);
      setMedium(current.medium || 'ENGLISH');
    }
    setQuizResults(getStoredQuizResults());
  }, []);

  if (!user) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updated = saveStoredUser({
      ...user,
      name,
      email,
      grade,
      medium,
    });

    setUser(updated);
    setMessage('Profile details updated successfully!');
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    logoutStoredUser();
    router.push('/login');
  };

  const isAdmin = (user as any).role === 'ADMIN';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 p-1 shadow-lg shadow-indigo-500/30 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-white text-2xl font-black overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user.name}</h1>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                </span>
              )}
            </div>

            <p className="text-slate-300 text-xs sm:text-sm font-medium">{user.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
                <Globe className="w-4 h-4 text-cyan-400" />
                {user.medium === 'SINHALA' ? '🇱🇰 සිංහල මාධ්‍යය' : '🇬🇧 English Medium'}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
                <GraduationCap className="w-4 h-4 text-indigo-400" /> Grade {user.grade} Student
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
                <Flame className="w-4 h-4 text-amber-400" /> {user.streakDays} Day Streak
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 text-rose-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Edit Profile Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-indigo-600 dark:text-cyan-400" /> Account Settings
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Medium Stream
              </label>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value as MediumType)}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm font-semibold focus:outline-none"
              >
                <option value="ENGLISH">🇬🇧 English Medium</option>
                <option value="SINHALA">🇱🇰 සිංහල මාධ්‍යය</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ICT Grade Level
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value, 10) as GradeLevel)}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm font-semibold focus:outline-none"
              >
                {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                  <option key={g} value={g}>
                    Grade {g} Student Stream
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
