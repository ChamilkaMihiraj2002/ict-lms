'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, BookOpen, HelpCircle, GraduationCap, Plus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminOverviewPage() {
  const [usersCount, setUsersCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsersCount(data.length);
          setRecentUsers(data.slice(0, 5));
        }
      })
      .catch(() => {});

    fetch('/api/admin/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCoursesCount(data.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Admin Operations & System Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage Grade 6-13 students, course content, and database records in NeonDB PostgreSQL.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Total Users</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{usersCount}</div>
          <div className="text-xs text-slate-400 font-medium">Registered student & admin accounts</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">ICT Courses</span>
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{coursesCount}</div>
          <div className="text-xs text-slate-400 font-medium">Published syllabus courses</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Active Grades</span>
            <GraduationCap className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">8 Grades</div>
          <div className="text-xs text-slate-400 font-medium">Grade 6 through Grade 13 streams</div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/users"
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-lg font-bold text-white">User Management</h3>
          <p className="text-xs text-slate-400">
            View registered students, update student Grade levels, promote accounts to Admin, or delete users.
          </p>
        </Link>

        <Link
          href="/admin/courses"
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-lg font-bold text-white">Course Management</h3>
          <p className="text-xs text-slate-400">
            Create new ICT courses directly in NeonDB PostgreSQL and configure grade levels.
          </p>
        </Link>
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-white">Recent Registered Users</h3>

        <div className="divide-y divide-slate-800">
          {recentUsers.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">{u.name}</div>
                <div className="text-slate-400">{u.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 font-semibold border border-slate-700">
                  Grade {u.grade}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  u.role === 'ADMIN'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {u.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
