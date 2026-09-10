'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Terminal,
  FileCode,
  ChevronRight,
  HelpCircle,
  FileText,
} from 'lucide-react';

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
import { saveStoredUser } from '@/features/auth/lib/user-storage';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Lesson, User } from '@/types';

export default function LessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setLesson(null); setIsCompleted(false); setError('');
    Promise.all([
      fetch('/api/auth/me').then(async res => { if (!res.ok) throw new Error('Unable to load progress.'); return res.json(); }),
      fetch('/api/courses').then(async res => { if (!res.ok) throw new Error('Unable to load lessons.'); return res.json(); }),
    ]).then(([data, courses]) => {
      setUser(data.user); saveStoredUser(data.user);
      const found = courses.flatMap((c: { modules: { lessons: Lesson[] }[] }) => c.modules.flatMap(m => m.lessons)).find((l: Lesson) => l.id === lessonId);
      setLesson(found || null);
      setIsCompleted(data.user.completedLessonIds.includes(lessonId));
    }).catch(e => setError(e.message));
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{error || 'Loading lesson… If it does not appear, return to the course.'}</h2>
        <Link href="/" className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonId: lesson.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      saveStoredUser(data.user); setUser(data.user); setIsCompleted(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save progress.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex gap-8 relative max-w-6xl mx-auto">
      {/* Main Content Column (max-w-3xl for optimal reading comfort) */}
      <div className="flex-1 max-w-3xl space-y-8">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handleMarkComplete}
            disabled={isCompleted || saving}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
              isCompleted
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Lesson Completed (+25 XP)' : saving ? 'Saving…' : 'Mark as Complete'}
          </button>
        </div>

        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
        {/* Lesson Header */}
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
            <span>Lesson {lesson.order}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} Mins Read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {lesson.title}
          </h1>
        </div>

        {/* Lesson Body Sections */}
        <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-base">
          {lesson.sections.map((sec, idx) => (
            <div key={idx} id={`section-${idx}`} className="space-y-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-indigo-600 dark:bg-cyan-400 inline-block" />
                {sec.heading}
              </h2>

              <MarkdownRenderer content={sec.text} />

              {sec.tip && (
                <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 text-sm font-medium flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>{sec.tip}</div>
                </div>
              )}

              {/* Code Snippet & Live Runner if separate snippet object exists */}
              {sec.codeSnippet && (
                <MarkdownRenderer
                  content={`\`\`\`${sec.codeSnippet.language}\n${sec.codeSnippet.code}\n\`\`\``}
                />
              )}
            </div>
          ))}

          {/* New Sub-Lessons Rendering */}
          {lesson.subLessons?.map((sl: any, idx: number) => (
            <div key={sl.id || `sl-${idx}`} id={`sublesson-${idx}`} className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200 dark:border-slate-800">
               <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                 <span className="w-2 h-6 rounded-full bg-cyan-500 dark:bg-cyan-400 inline-block" />
                 {sl.title}
               </h2>
               
               {sl.content && <MarkdownRenderer content={sl.content} />}
               
               {sl.videos?.length > 0 && (
                 <div className="space-y-4 pt-4">
                   <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-600 dark:text-cyan-400">
                     <Play className="w-5 h-5" /> Video Resources
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {sl.videos.map((v: any, vIdx: number) => {
                       const yId = getYoutubeId(v.youtubeUrl);
                       return (
                         <div key={v.id || vIdx} className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg">
                           {yId ? (
                             <iframe 
                               className="w-full aspect-video" 
                               src={`https://www.youtube.com/embed/${yId}`} 
                               title={v.title}
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                               allowFullScreen 
                             />
                           ) : (
                             <div className="w-full aspect-video flex items-center justify-center text-xs text-slate-500 bg-slate-950">Invalid YouTube URL</div>
                           )}
                           <div className="p-3 text-sm font-semibold text-slate-200 truncate">{v.title}</div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
               )}

               {sl.pdfs?.length > 0 && (
                 <div className="space-y-4 pt-4">
                   <h3 className="text-lg font-bold flex items-center gap-2 text-rose-500 dark:text-rose-400">
                     <FileText className="w-5 h-5" /> Document Resources
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {sl.pdfs.map((p: any, pIdx: number) => (
                       <a 
                         key={p.id || pIdx} 
                         href={p.pdfUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 transition-colors shadow-sm group"
                       >
                         <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{p.title}</div>
                           <div className="text-xs text-slate-500 dark:text-slate-400">PDF Document</div>
                         </div>
                       </a>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          ))}
        </div>

        {/* Lesson Footer Controls */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <Link
            href="/courses/g10-web-dev"
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            Course Overview
          </Link>

          <Link
            href="/quizzes/g10-web-quiz-1"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            Take Quiz Assessment <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Sticky Table of Contents Sidebar (Desktop) */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md shadow-slate-200/50 dark:shadow-none">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Table of Contents
          </div>
          <nav className="space-y-2">
            {lesson.sections?.map((sec, idx) => (
              <a
                key={idx}
                href={`#section-${idx}`}
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors leading-snug"
              >
                {idx + 1}. {sec.heading}
              </a>
            ))}
            {lesson.subLessons?.map((sl: any, idx: number) => (
              <a
                key={`sl-${idx}`}
                href={`#sublesson-${idx}`}
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors leading-snug"
              >
                • {sl.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
