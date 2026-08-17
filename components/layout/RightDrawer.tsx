'use client';

import { useState, useEffect } from 'react';
import { PanelRightClose, PanelRightOpen, Calendar, Clock, Bell } from 'lucide-react';
import { TimelineBlock } from '@/components/ui/TimelineBlock';

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
          Block Drawer
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

        {/* Mini Calendar Block Placeholder */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Calendar</h3>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80">
            <div className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">August 2026</div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
              <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              <div className="p-1 text-slate-300 dark:text-slate-600">27</div>
              <div className="p-1 text-slate-300 dark:text-slate-600">28</div>
              <div className="p-1 text-slate-300 dark:text-slate-600">29</div>
              <div className="p-1 text-slate-300 dark:text-slate-600">30</div>
              <div className="p-1 text-slate-300 dark:text-slate-600">31</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">1</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">2</div>
              {/* Fake week */}
              <div className="p-1 text-slate-700 dark:text-slate-300">3</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">4</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">5</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">6</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">7</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">8</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">9</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">10</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">11</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">12</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">13</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">14</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">15</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">16</div>
              <div className="p-1 bg-indigo-600 text-white rounded-full font-bold">17</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">18</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">19</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">20</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">21</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">22</div>
              <div className="p-1 text-slate-700 dark:text-slate-300">23</div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
