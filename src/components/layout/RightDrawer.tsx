'use client';

import { useState, useEffect } from 'react';
import { PanelRightClose, PanelRightOpen, Calendar, Clock, Bell } from 'lucide-react';
import { TimelineBlock } from '@/features/classroom/components/TimelineBlock';

export function RightDrawer() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const savedState = localStorage.getItem('ict_right_drawer_collapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const toggleDrawer = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('ict_right_drawer_collapsed', String(next));
      return next;
    });
  };

  if (isCollapsed) {
    return (
      <div className="hidden xl:flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shrink-0 h-screen sticky top-0 z-30 w-16 items-center py-4 transition-all duration-300">
        <button
          onClick={toggleDrawer}
          title="Expand Block Drawer"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 transition-all focus:outline-none"
        >
          <PanelRightOpen className="w-5 h-5 text-indigo-500" />
        </button>

        <div className="mt-8 space-y-6 flex flex-col items-center">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400" title="Timeline">
            <Clock className="w-5 h-5" />
          </div>
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400" title="Calendar">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400" title="Notifications">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden xl:flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shrink-0 h-screen sticky top-0 z-30 w-80 transition-all duration-300 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-10">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          Your study planner
        </h2>
        <button
          onClick={toggleDrawer}
          title="Collapse Block Drawer"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 transition-all focus:outline-none"
        >
          <PanelRightClose className="w-5 h-5" />
        </button>
      </div>

      {/* Blocks Content */}
      <div className="p-4 space-y-6">
        {/* Timeline Block */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Timeline</h3>
          </div>
          <TimelineBlock />
        </section>


      </div>
    </aside>
  );
}
