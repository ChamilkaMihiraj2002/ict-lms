'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, AlertCircle, GraduationCap, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { saveStoredUser } from '@/lib/db';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      saveStoredUser(data.user);

      router.refresh();
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error signing in');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-slate-950/80 border border-slate-800 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-950/50 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Column 1: Visual Brand Hero */}
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900/60 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 space-y-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Grades 6 - 13 ICT Platform
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
            Master ICT Syllabus with Interactive Learning
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Access curriculum courses, past exam papers with built-in PDF reader, and instant self-evaluating quizzes.
          </p>
        </div>

        {/* Feature List Badges */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300 shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Dual Medium Curriculum</span>
              <span>Complete Sinhala & English medium ICT lessons</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <div className="p-2 rounded-xl bg-cyan-600/30 text-cyan-300 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Past Papers & Quizzes</span>
              <span>Model paper downloads & interactive self-testing</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-2 border-t border-indigo-900/40">
          Official G.C.E. O/L & A/L ICT Syllabus Companion
        </div>
      </div>

      {/* Column 2: Login Form */}
      <div className="p-8 flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back!</h2>
          <p className="text-sm text-slate-400">Sign in to your ICT Student or Admin Account</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="name@school.lk"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <a href="#" className="text-indigo-400 hover:underline">Forgot?</a>
            </div>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          New ICT Student?{' '}
          <Link href="/register" className="text-cyan-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
