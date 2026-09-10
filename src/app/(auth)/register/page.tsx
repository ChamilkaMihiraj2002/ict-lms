'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Mail, Lock, GraduationCap, Globe, AlertCircle, Sparkles, BookOpen, Award } from 'lucide-react';
import { saveStoredUser } from '@/features/auth/lib/user-storage';
import { GradeLevel, MediumType } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(10);
  const [medium, setMedium] = useState<MediumType>('ENGLISH');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, grade, medium }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      saveStoredUser(data.user);
      router.refresh();
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error registering student');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-slate-950/80 border border-slate-800 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-950/50 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Column 1: Visual Brand Hero */}
      <div className="bg-gradient-to-br from-cyan-950 via-indigo-950 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 space-y-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Join ICT LMS Today
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
            Start Your ICT Learning Journey (Grades 6 - 13)
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Create your student profile, choose your medium and grade, and gain access to comprehensive ICT materials.
          </p>
        </div>

        {/* Feature List Badges */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <div className="p-2 rounded-xl bg-cyan-600/30 text-cyan-300 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Sinhala & English Medium</span>
              <span>Select your preferred learning medium anytime</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Gamified Progress</span>
              <span>Earn XP, build learning streaks, and track quizzes</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-2 border-t border-cyan-900/40">
          Curriculum Tailored for Grade 6 to Grade 13 Students
        </div>
      </div>

      {/* Column 2: Register Form */}
      <div className="p-8 flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Student Account</h2>
          <p className="text-sm text-slate-400">Join ICT LMS for Grade 6-13 learning materials</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kavindi Perera"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
          </div>

          {/* Medium & Grade Selection Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Medium
              </label>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value as MediumType)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs font-medium"
              >
                <option value="ENGLISH">🇬🇧 English</option>
                <option value="SINHALA">🇱🇰 සිංහල</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value, 10) as GradeLevel)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs font-medium"
              >
                {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kavindi@school.lk"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? 'Registering Account...' : 'Register Student Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Already registered?{' '}
          <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
