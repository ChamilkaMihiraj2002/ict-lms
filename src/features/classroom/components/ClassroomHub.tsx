'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { BookOpenCheck, CalendarDays, ClipboardList, Download, ExternalLink, Megaphone, Plus, Search, X } from 'lucide-react';
import { calendarFile, submissionStatus, type ClassroomItem, type ClassroomSubmission, type ItemKind } from '@/features/classroom/lib/classroom';
import type { QuizResult } from '@/types';

const field = 'w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950';
const button = 'inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50';
const panel = 'rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900';
const labels = { ASSIGNMENT: 'Assignments', CLASS: 'Class schedule', ANNOUNCEMENT: 'Announcements', GRADES: 'My grades' };
const dateLabel = (value: string) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

async function request(url: string, method?: string, body?: unknown) {
  const res = await fetch(url, method ? { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined } : undefined);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
}

export function ClassroomHub({ admin = false }: { admin?: boolean }) {
  const [now, setNow] = useState(0);
  useEffect(() => { setNow(Date.now()); const timer = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer); }, []);
  const [items, setItems] = useState<ClassroomItem[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [tab, setTab] = useState<ItemKind | 'GRADES'>('ASSIGNMENT');
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('all');
  const [medium, setMedium] = useState('all');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editor, setEditor] = useState<ClassroomItem | 'new' | null>(null);
  const [cohort, setCohort] = useState('');
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    const data = await request('/api/classroom');
    setItems(data.items);
    setCohort(`Grade ${data.grade} · ${data.medium === 'SINHALA' ? 'Sinhala' : 'English'} medium`);
    if (!admin) setResults(await request('/api/results'));
  }, [admin]);

  useEffect(() => { reload().catch(e => setError(e.message)).finally(() => setLoading(false)); }, [reload]);

  async function mutate(url: string, method: string, data?: unknown) {
    setBusy(true); setError(''); setNotice('');
    try { await request(url, method, data); await reload(); setNotice('Changes saved.'); return true; }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to save.'); return false; }
    finally { setBusy(false); }
  }

  const scoped = items.filter(i => (grade === 'all' || i.grade === Number(grade)) && (medium === 'all' || i.medium === medium));
  const assignments = scoped.filter(i => i.kind === 'ASSIGNMENT');
  const visible = scoped.filter(i => i.kind === tab && `${i.title} ${i.description}`.toLowerCase().includes(search.toLowerCase()) && (admin || tab !== 'ASSIGNMENT' || status === 'all' || submissionStatus(i, now) === status));
  if (tab === 'ANNOUNCEMENT') visible.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const upcoming = scoped.filter(i => i.kind === 'CLASS' && Date.parse(i.endsAt || i.dueAt!) >= now);
  const pending = assignments.filter(i => !i.submissions.length).length;
  const awaitingReview = assignments.flatMap(i => i.submissions).filter(s => !s.gradedAt).length;

  function downloadCalendar() {
    const blob = new Blob([calendarFile(scoped)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'ict-class-calendar.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className="space-y-6">
    <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
      <div className="relative space-y-3">
        <p className="text-xs uppercase tracking-widest text-cyan-300 font-bold">{admin ? 'Teaching workspace' : cohort || 'Your learning workspace'}</p>
        <h1 className="text-3xl sm:text-4xl font-bold">{admin ? 'Bring your class together.' : 'Your classroom, all in one place.'}</h1>
        <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">{admin ? 'Plan lessons, set meaningful work, and give every student feedback.' : 'Keep up with class updates, hand in your work, and see how you’re progressing.'}</p>
        <div className="flex flex-wrap gap-3 pt-3">
          {admin && <button className={button} onClick={() => setEditor('new')}><Plus size={16} /> Create activity</button>}
          <button onClick={downloadCalendar} disabled={loading || !scoped.some(i => i.dueAt)} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-4 py-2.5 text-sm hover:bg-slate-800 disabled:opacity-40"><Download size={16} /> Download calendar</button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[{ title: admin ? 'Published assignments' : 'Assignments to do', value: admin ? assignments.length : pending, icon: ClipboardList },
        { title: 'Upcoming classes', value: upcoming.length, icon: CalendarDays },
        { title: admin ? 'Awaiting your feedback' : 'Returned assignments', value: admin ? awaitingReview : assignments.filter(i => i.submissions[0]?.gradedAt).length, icon: BookOpenCheck }].map(stat =>
        <div key={stat.title} className={`${panel} flex items-center gap-4`}><div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"><stat.icon size={22} /></div><div><p className="text-2xl font-bold">{loading ? '—' : stat.value}</p><p className="text-xs text-slate-500 dark:text-slate-400">{stat.title}</p></div></div>)}
    </div>

    <div className="flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800" aria-label="Classroom views">
      {(admin ? ['ASSIGNMENT', 'CLASS', 'ANNOUNCEMENT'] as const : ['ASSIGNMENT', 'CLASS', 'ANNOUNCEMENT', 'GRADES'] as const).map(key => <button key={key} aria-pressed={tab === key} onClick={() => setTab(key)} className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 ${tab === key ? 'border-indigo-600 text-indigo-600 dark:text-indigo-300' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>{labels[key]}</button>)}
    </div>

    {error && <div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error} <button className="underline ml-2" onClick={() => { setError(''); setLoading(true); reload().catch(e => setError(e.message)).finally(() => setLoading(false)); }}>Reload</button></div>}
    {notice && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}

    {tab !== 'GRADES' && <div className="flex flex-wrap gap-3">
      <label className="relative flex-1 min-w-48"><span className="sr-only">Search activities</span><Search size={17} className="absolute left-3 top-3.5 text-slate-400" /><input className={`${field} pl-10`} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your classroom…" /></label>
      {admin && <><select aria-label="Filter grade" className={`${field} sm:!w-36`} value={grade} onChange={e => setGrade(e.target.value)}><option value="all">All grades</option>{[6,7,8,9,10,11,12,13].map(g => <option key={g} value={g}>Grade {g}</option>)}</select><select aria-label="Filter medium" className={`${field} sm:!w-40`} value={medium} onChange={e => setMedium(e.target.value)}><option value="all">Both mediums</option><option value="ENGLISH">English</option><option value="SINHALA">Sinhala</option></select></>}
      {!admin && tab === 'ASSIGNMENT' && <select aria-label="Filter assignment status" className={`${field} sm:!w-44`} value={status} onChange={e => setStatus(e.target.value)}>{['all', 'To do', 'Overdue', 'Submitted', 'Graded'].map(s => <option key={s} value={s}>{s === 'all' ? 'All assignments' : s}</option>)}</select>}
    </div>}

    {loading ? <p role="status" className={`${panel} text-center text-slate-500`}>Loading your classroom…</p> : tab === 'GRADES' ? <div className="space-y-4">
      <h2 className="text-lg font-bold">Assignment feedback</h2>
      {assignments.filter(i => i.submissions[0]?.gradedAt).map(i => <div key={i.id} className={panel}><div className="flex justify-between gap-3"><h3 className="font-semibold">{i.title}</h3><span className="text-indigo-600 dark:text-indigo-300 font-bold">{i.submissions[0].score} / {i.maxPoints}</span></div><p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{i.submissions[0].feedback || 'No written feedback yet.'}</p></div>)}
      {!assignments.some(i => i.submissions[0]?.gradedAt) && <p className={`${panel} text-sm text-slate-500`}>Your teacher’s marks and feedback will appear here after grading.</p>}
      <h2 className="text-lg font-bold pt-3">Quiz history <span className="text-sm font-normal text-slate-500">· latest 100 attempts</span></h2>
      {results.map(r => <Link key={r.id} href={`/quizzes/result/${r.id}`} className={`${panel} flex flex-wrap items-center justify-between gap-3 hover:border-indigo-400`}><div><h3 className="font-semibold">{r.quizTitle}</h3><p className="text-xs text-slate-500 mt-1">{dateLabel(r.submittedAt)}</p></div><span className={`font-bold ${r.passed ? 'text-emerald-600' : 'text-amber-600'}`}>{r.scorePercentage}% · {r.passed ? 'Passed' : 'Review'} →</span></Link>)}
      {!results.length && <p className={`${panel} text-sm text-slate-500`}>Complete a quiz to see your results here. <Link href="/quizzes" className="text-indigo-600 underline">Explore quizzes</Link></p>}
    </div> : <div className="space-y-4">
      {!visible.length && <div className={`${panel} text-center py-12`}><Megaphone className="mx-auto mb-4 text-slate-400" size={28} /><h2 className="font-semibold">{search || status !== 'all' ? 'No matching activities' : `No ${labels[tab].toLowerCase()} yet`}</h2><p className="mt-2 text-sm text-slate-500">{admin ? 'Create an activity to get your class started.' : 'Activities from your teacher will appear here. Check back soon.'}</p></div>}
      {visible.map(item => <article key={item.id} className={panel}>
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div><div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2"><span>Grade {item.grade} · {item.medium === 'SINHALA' ? 'Sinhala' : 'English'}</span>{item.kind === 'ASSIGNMENT' && <span>· {item.maxPoints} marks</span>}</div><h2 className="font-bold text-lg">{item.title}</h2></div>
          {item.kind === 'ASSIGNMENT' && !admin && <span className={`rounded-full px-3 py-1 text-xs font-semibold ${submissionStatus(item, now) === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'}`}>{submissionStatus(item, now)}</span>}
          {admin && <div className="flex gap-3 text-xs"><button onClick={() => setEditor(item)} className="text-indigo-600 dark:text-indigo-300 font-semibold">Edit</button><button disabled={busy} onClick={() => { if (window.confirm(`Delete “${item.title}” and all its submissions? This cannot be undone.`)) void mutate(`/api/classroom?id=${encodeURIComponent(item.id)}`, 'DELETE'); }} className="text-rose-600 font-semibold">Delete</button></div>}
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words leading-relaxed">{item.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {item.dueAt ? <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} />{item.kind === 'CLASS' ? 'Starts' : 'Due'} {dateLabel(item.dueAt)}{item.endsAt && ` · Ends ${dateLabel(item.endsAt)}`}</span> : <span>Posted {dateLabel(item.createdAt)}</span>}
          {item.kind === 'CLASS' && <span>{Date.parse(item.endsAt || item.dueAt!) < now ? 'Finished' : Date.parse(item.dueAt!) <= now ? 'In progress' : 'Upcoming'}</span>}
          {item.meetingUrl && <a href={item.meetingUrl} target="_blank" rel="noopener noreferrer" className={`${button} ml-auto`}><ExternalLink size={15} />Open class link</a>}
        </div>
        {item.kind === 'ASSIGNMENT' && (admin ? <details className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-4"><summary className="cursor-pointer text-sm font-semibold">{item.submissions.length} submissions · {item.submissions.filter(s => !s.gradedAt).length} awaiting feedback</summary><div className="mt-4 space-y-4">{!item.submissions.length && <p className="text-sm text-slate-500">No students have submitted work yet.</p>}{item.submissions.map(s => <GradeSubmission key={s.id} item={item} submission={s} busy={busy} mutate={mutate} />)}</div></details> : <StudentSubmission item={item} busy={busy} mutate={mutate} />)}
      </article>)}
      <p className="text-xs text-slate-500">Dates are shown in your device’s timezone. Calendar downloads are a snapshot; download again after schedule changes.</p>
    </div>}

    {editor && <ActivityEditor serverError={error} item={editor === 'new' ? null : editor} kind={tab === 'GRADES' ? 'ASSIGNMENT' : tab} busy={busy} onClose={() => setEditor(null)} onSave={async data => { if (await mutate('/api/classroom', editor === 'new' ? 'POST' : 'PUT', data)) setEditor(null); }} />}
  </div>;
}

type Mutate = (url: string, method: string, data?: unknown) => Promise<boolean>;
function StudentSubmission({ item, busy, mutate }: { item: ClassroomItem; busy: boolean; mutate: Mutate }) {
  const submission = item.submissions[0];
  if (submission) return <div className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3"><p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Submitted {dateLabel(submission.submittedAt)}{item.dueAt && Date.parse(submission.submittedAt) > Date.parse(item.dueAt) ? ' · Late' : ''}</p><details className="text-sm"><summary className="cursor-pointer">View your answer</summary><p className="whitespace-pre-wrap break-words mt-3">{submission.content}</p>{submission.attachmentUrl && <a className="inline-block mt-2 text-indigo-600 underline" href={submission.attachmentUrl} target="_blank" rel="noopener noreferrer">Open submitted file</a>}</details>{submission.gradedAt && <div className="rounded-xl p-4 bg-indigo-50 dark:bg-indigo-950/50"><p className="font-semibold text-sm">Teacher feedback · {submission.score} / {item.maxPoints}</p><p className="mt-2 text-sm whitespace-pre-wrap">{submission.feedback || 'No written feedback.'}</p></div>}</div>;
  return <details className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-4"><summary className="cursor-pointer text-sm font-semibold text-indigo-600 dark:text-indigo-300">Submit your work</summary><form className="mt-4 space-y-3" onSubmit={async e => { e.preventDefault(); const data = new FormData(e.currentTarget); await mutate('/api/classroom/submissions', 'POST', { itemId: item.id, content: data.get('content'), attachmentUrl: data.get('attachmentUrl') }); }}><label className="block text-sm font-medium">Your answer<textarea name="content" required maxLength={20000} rows={5} className={`${field} mt-2`} placeholder="Write your answer, or describe the work in your linked file." /></label><label className="block text-sm font-medium">File link (optional)<input type="url" name="attachmentUrl" maxLength={2000} className={`${field} mt-2`} placeholder="https://drive.google.com/…" /></label><p className="text-xs text-slate-500">Check that your teacher can access your file. Review carefully: you can submit once. Late work is accepted and marked late.</p><button disabled={busy} className={button}>{busy ? 'Saving…' : 'Hand in assignment'}</button></form></details>;
}

function GradeSubmission({ item, submission: s, busy, mutate }: { item: ClassroomItem; submission: ClassroomSubmission; busy: boolean; mutate: Mutate }) {
  return <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3"><div><p className="font-semibold text-sm">{s.user?.name} <span className="font-normal text-slate-500">· {s.user?.email}</span></p><p className="text-xs text-slate-500 mt-1">{dateLabel(s.submittedAt)}{item.dueAt && Date.parse(s.submittedAt) > Date.parse(item.dueAt) ? ' · Late submission' : ''}</p></div><p className="whitespace-pre-wrap break-words text-sm">{s.content}</p>{s.attachmentUrl && <a className="inline-flex items-center gap-1 text-sm text-indigo-600 underline" href={s.attachmentUrl} target="_blank" rel="noopener noreferrer">Open submitted file <ExternalLink size={13} /></a>}<form className="space-y-3" onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); void mutate('/api/classroom/submissions', 'PATCH', { id: s.id, score: Number(data.get('score')), feedback: data.get('feedback') }); }}><label className="block text-sm">Marks out of {item.maxPoints}<input key={`${s.id}-${s.score}`} name="score" type="number" min={0} max={item.maxPoints} step={1} required defaultValue={s.score ?? ''} className={`${field} mt-1 max-w-36 block`} /></label><label className="block text-sm">Feedback<textarea key={`${s.id}-${s.gradedAt}`} name="feedback" maxLength={10000} rows={3} defaultValue={s.feedback || ''} className={`${field} mt-1`} /></label><button disabled={busy} className={button}>{busy ? 'Saving…' : s.gradedAt ? 'Update feedback' : 'Return marks & feedback'}</button></form></div>;
}

function localDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value); date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}
function ActivityEditor({ item, kind, busy, onClose, onSave, serverError }: { serverError: string; item: ClassroomItem | null; kind: ItemKind; busy: boolean; onClose: () => void; onSave: (data: unknown) => Promise<void> }) {
  const dialog = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose();
      if (event.key !== 'Tab') return;
      const focusable = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled)');
      if (!focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handler);
    return () => { document.removeEventListener('keydown', handler); previous?.focus(); };
  }, [busy, onClose]);
  const [type, setType] = useState<ItemKind>(item?.kind || kind);
  const [error, setError] = useState('');
  return <div className="fixed inset-0 z-50 bg-slate-950/60 overflow-y-auto p-4 sm:p-8"><section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="activity-title" className={`${panel} max-w-2xl mx-auto shadow-xl`}><div className="flex items-center justify-between mb-5"><h2 id="activity-title" className="font-bold text-xl">{item ? 'Edit activity' : 'Create a class activity'}</h2><button type="button" aria-label="Close editor" disabled={busy} onClick={onClose}><X size={20} /></button></div><form className="space-y-4" onSubmit={async e => { e.preventDefault(); const data = new FormData(e.currentTarget); setError(''); try { await onSave({ id: item?.id, kind: type, title: data.get('title'), description: data.get('description'), grade: item?.grade ?? Number(data.get('grade')), medium: item?.medium ?? data.get('medium'), maxPoints: item?.maxPoints ?? Number(data.get('maxPoints') || 100), dueAt: data.get('dueAt') ? new Date(String(data.get('dueAt'))).toISOString() : null, endsAt: data.get('endsAt') ? new Date(String(data.get('endsAt'))).toISOString() : null, meetingUrl: data.get('meetingUrl') }); } catch { setError('Check the dates and try again.'); } }}>
    <label className="block text-sm font-medium">Activity type<select disabled={!!item} value={type} onChange={e => setType(e.target.value as ItemKind)} className={`${field} mt-1`}><option value="ASSIGNMENT">Assignment</option><option value="CLASS">Scheduled class</option><option value="ANNOUNCEMENT">Announcement</option></select></label>
    <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium">Grade<select name="grade" disabled={!!item} defaultValue={item?.grade || 10} className={`${field} mt-1`}>{[6,7,8,9,10,11,12,13].map(g => <option key={g} value={g}>Grade {g}</option>)}</select></label><label className="block text-sm font-medium">Medium<select name="medium" disabled={!!item} defaultValue={item?.medium || 'ENGLISH'} className={`${field} mt-1`}><option value="ENGLISH">English</option><option value="SINHALA">Sinhala</option></select></label></div>
    <label className="block text-sm font-medium">Title<input name="title" autoFocus required maxLength={160} defaultValue={item?.title} className={`${field} mt-1`} placeholder="e.g. Build your first HTML page" /></label>
    <label className="block text-sm font-medium">{type === 'ASSIGNMENT' ? 'Instructions' : 'Details'}<textarea name="description" required maxLength={10000} rows={5} defaultValue={item?.description} className={`${field} mt-1`} /></label>
    {type !== 'ANNOUNCEMENT' && <label className="block text-sm font-medium">{type === 'CLASS' ? 'Class starts' : 'Submission deadline'}<input name="dueAt" type="datetime-local" required defaultValue={localDate(item?.dueAt || null)} className={`${field} mt-1`} /></label>}
    {type === 'CLASS' && <><label className="block text-sm font-medium">Class ends<input name="endsAt" type="datetime-local" required defaultValue={localDate(item?.endsAt || null)} className={`${field} mt-1`} /></label><label className="block text-sm font-medium">Online class link (optional)<input name="meetingUrl" type="url" maxLength={2000} defaultValue={item?.meetingUrl || ''} placeholder="https://meet.google.com/…" className={`${field} mt-1`} /></label></>}
    {type === 'ASSIGNMENT' && <label className="block text-sm font-medium">Maximum marks<input name="maxPoints" disabled={!!item} type="number" min={1} max={1000} step={1} required defaultValue={item?.maxPoints || 100} className={`${field} mt-1`} /></label>}
    {(error || serverError) && <p role="alert" className="text-rose-600 text-sm">{error || serverError}</p>}
    <p className="text-xs text-slate-500">Visible immediately to this grade and medium. Dates use your device’s timezone. Type, cohort and maximum marks are fixed after publishing.</p>
    <div className="flex justify-end gap-3"><button type="button" disabled={busy} onClick={onClose} className="px-4 text-sm">Cancel</button><button disabled={busy} className={button}>{busy ? 'Saving…' : item ? 'Save changes' : 'Publish activity'}</button></div>
  </form></section></div>;
}
