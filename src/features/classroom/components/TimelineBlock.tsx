'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ArrowRight } from 'lucide-react';
import type { ClassroomItem } from '@/features/classroom/lib/classroom';

export function TimelineBlock() {
  const [now, setNow] = useState(0);
  const [items, setItems] = useState<ClassroomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    setNow(Date.now());
    fetch('/api/classroom').then(async res => { const data = await res.json(); if (!res.ok) throw new Error(data.error); return data; })
      .then(data => setItems(data.items.filter((i: ClassroomItem) => i.dueAt && (i.kind === 'ASSIGNMENT' ? !i.submissions.length : Date.parse(i.endsAt || i.dueAt) >= Date.now())).slice(0, 5)))
      .catch(() => setError('Unable to load your timeline.'))
      .finally(() => setLoading(false));
  }, []);
  return <div className="space-y-3">
    {loading ? <p className="text-xs text-slate-500">Loading activities…</p> : error ? <p role="alert" className="text-xs text-rose-600">{error}</p> : !items.length ? <p className="text-sm text-slate-500">You’re all caught up. New deadlines and classes will appear here.</p> : items.map(item => <Link key={item.id} href="/classroom" className="flex gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-indigo-400"><CalendarDays size={17} className="text-indigo-500 shrink-0 mt-1" /><div><p className="text-sm font-semibold">{item.title}</p><p className="text-xs text-slate-500 mt-1">{item.kind === 'ASSIGNMENT' && Date.parse(item.dueAt!) < now ? 'Overdue · ' : ''}{new Date(item.dueAt!).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p></div></Link>)}
    <Link href="/classroom" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">Open classroom <ArrowRight size={15} /></Link>
  </div>;
}
