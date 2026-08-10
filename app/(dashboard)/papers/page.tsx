'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Eye, GraduationCap, Globe, Search, Calendar, Sparkles } from 'lucide-react';
import { getStoredUser } from '@/lib/db';
import { getGoogleDriveEmbedUrl, getGoogleDriveDownloadUrl } from '@/lib/drive';
import { GradeLevel, MediumType, Paper, User } from '@/types';

export default function StudentPapersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [selectedMedium, setSelectedMedium] = useState<MediumType>('ENGLISH');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePaper, setActivePaper] = useState<Paper | null>(null);

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    if (currentUser) {
      setSelectedGrade(currentUser.grade);
      setSelectedMedium(currentUser.medium || 'ENGLISH');
    }

    fetch('/api/papers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPapers(data);
      })
      .catch(() => {});
  }, []);

  const filteredPapers = papers.filter((p) => {
    const matchesGrade = selectedGrade === 'ALL' || p.grade === selectedGrade;
    const matchesMedium = p.medium === selectedMedium;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesMedium && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-600 dark:text-cyan-400" />
            ICT Exam Past Papers & PDF Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {user
              ? `Filtered for Grade ${user.grade} (${selectedMedium === 'SINHALA' ? 'සිංහල මාධ්‍යය' : 'English Medium'})`
              : 'Download and view national ICT examination papers'}
          </p>
        </div>

        {/* Medium & Grade Switchers */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setSelectedMedium('ENGLISH')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedMedium === 'ENGLISH'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setSelectedMedium('SINHALA')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedMedium === 'SINHALA'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              🇱🇰 සිංහල
            </button>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedGrade('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedGrade === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              All Grades
            </button>
            {user && (
              <button
                onClick={() => setSelectedGrade(user.grade)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedGrade === user.grade
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Grade {user.grade}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No papers found for Grade {selectedGrade === 'ALL' ? 'Any' : selectedGrade} in {selectedMedium === 'SINHALA' ? 'Sinhala' : 'English'} medium.
          </p>
          <button
            onClick={() => setSelectedGrade('ALL')}
            className="text-xs text-indigo-600 dark:text-cyan-400 font-bold hover:underline"
          >
            Show All Grades →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-cyan-300 text-xs font-bold border border-indigo-100 dark:border-slate-700">
                      Grade {paper.grade} ICT
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                      {paper.medium === 'SINHALA' ? '🇱🇰 සිංහල' : '🇬🇧 English'}
                    </span>
                  </div>

                  {paper.year && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {paper.year}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {paper.title}
                </h3>
                {paper.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {paper.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActivePaper(paper)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
                >
                  <Eye className="w-4 h-4" /> {selectedMedium === 'SINHALA' ? 'ප්‍රශ්න පත්‍රය නරඹන්න' : 'View PDF'}
                </button>
                <a
                  href={getGoogleDriveDownloadUrl(paper.driveUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded PDF View Modal */}
      {activePaper && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{activePaper.title}</h3>
                <p className="text-[11px] text-slate-400">
                  Grade {activePaper.grade} ICT Examination Paper ({activePaper.medium === 'SINHALA' ? 'සිංහල' : 'English'})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={getGoogleDriveDownloadUrl(activePaper.driveUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
                <button
                  onClick={() => setActivePaper(null)}
                  className="text-slate-400 hover:text-white text-base font-bold px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950">
              <iframe
                src={getGoogleDriveEmbedUrl(activePaper.driveUrl)}
                className="w-full h-full border-0"
                allow="autoplay"
                title={activePaper.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
