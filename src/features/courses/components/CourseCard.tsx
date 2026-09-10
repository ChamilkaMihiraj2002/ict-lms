import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Terminal, Database, Cpu } from 'lucide-react';
import { Course, User } from '@/types';

interface CourseCardProps {
  course: Course;
  selectedMedium: string;
  user?: User | null;
}

export function CourseCard({ course, selectedMedium, user }: CourseCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-5 h-5 text-cyan-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-purple-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-rose-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-400" />;
    }
  };

  // Calculate total number of lessons across all modules
  const lessonCount = course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;

  // Calculate real progress based on user's completed lessons
  let progress = 0;
  if (user && lessonCount > 0) {
    let completedInCourse = 0;
    course.modules?.forEach((module) => {
      module.lessons?.forEach((lesson) => {
        if (user.completedLessonIds.includes(lesson.id)) {
          completedInCourse++;
        }
      });
    });
    progress = Math.round((completedInCourse / lessonCount) * 100);
  }

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/40 dark:shadow-none hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Header Banner */}
      <div className={`p-5 bg-gradient-to-r ${course.bannerGradient} text-white space-y-3 relative`}>
        <div className="flex items-center justify-between">
          <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-sm">
            {getIcon(course.iconName)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-wide">
              {course.medium === 'SINHALA' ? '🇱🇰 සිංහල' : '🇬🇧 EN'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-wide">
              Grade {course.grade}
            </span>
          </div>
        </div>
        <h3 className="text-lg font-bold leading-snug group-hover:translate-x-1 transition-transform duration-300">
          {course.title}
        </h3>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {course.description ? course.description.replace(/<[^>]*>/g, '').replace(/[#*`_~>]/g, '').replace(/\n+/g, ' ').trim() : ''}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {lessonCount} Lesson{lessonCount !== 1 ? 's' : ''}
          </span>

          <Link
            href={`/courses/${course.id}`}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:text-slate-200 text-xs font-semibold text-slate-800 transition-colors flex items-center gap-1 shadow-sm"
          >
            {selectedMedium === 'SINHALA' ? 'නරඹන්න' : 'Resume'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
