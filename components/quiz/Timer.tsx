'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
}

export function Timer({ initialMinutes, onTimeUp }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [secondsLeft, onTimeUp]);

  const isLowTime = secondsLeft < 120; // less than 2 minutes

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
        isLowTime
          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse'
          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span>{formatTime(secondsLeft)}</span>
    </div>
  );
}
