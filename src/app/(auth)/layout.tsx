import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden transition-colors">
      {/* Dynamic Ambient Glow background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">ICT LMS</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Auth Content Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 z-10">
        © {new Date().getFullYear()} ICT Class Learning Management System • Grade 6 - Grade 13 Curriculum
      </footer>
    </div>
  );
}
