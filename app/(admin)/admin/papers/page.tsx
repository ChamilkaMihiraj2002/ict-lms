'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Download, Eye, Trash2, CheckCircle, Sparkles, Edit3 } from 'lucide-react';
import { getGoogleDriveEmbedUrl, getGoogleDriveDownloadUrl } from '@/lib/drive';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { GradeLevel, MediumType } from '@/types';

export default function AdminPapersPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  const [deletingPaper, setDeletingPaper] = useState<{ id: string; title: string } | null>(null);
  const [previewPaper, setPreviewPaper] = useState<any | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(10);
  const [medium, setMedium] = useState<MediumType>('ENGLISH');
  const [year, setYear] = useState(new Date().getFullYear());
  const [driveUrl, setDriveUrl] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPapers = () => {
    fetch('/api/admin/papers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPapers(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const openCreateModal = () => {
    setEditingPaperId(null);
    setTitle('');
    setGrade(10);
    setMedium('ENGLISH');
    setYear(new Date().getFullYear());
    setDriveUrl('');
    setDescription('');
    setShowAddModal(true);
  };

  const openEditModal = (paper: any) => {
    setEditingPaperId(paper.id);
    setTitle(paper.title || '');
    setGrade(paper.grade || 10);
    setMedium(paper.medium || 'ENGLISH');
    setYear(paper.year || new Date().getFullYear());
    setDriveUrl(paper.driveUrl || '');
    setDescription(paper.description || '');
    setShowAddModal(true);
  };

  const handleSavePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!editingPaperId;
    const url = '/api/admin/papers';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit ? { id: editingPaperId } : {}),
          title,
          grade,
          medium,
          year,
          driveUrl,
          description,
        }),
      });

      if (res.ok) {
        setMessage(isEdit ? 'Past paper updated successfully!' : 'Past paper uploaded and saved to NeonDB!');
        setShowAddModal(false);
        fetchPapers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPaper) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/papers?id=${deletingPaper.id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Past paper deleted successfully.');
        setDeletingPaper(null);
        fetchPapers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" /> ICT Exam Papers & PDFs
          </h1>
          <p className="text-xs text-slate-400">
            Upload, edit, and manage Google Drive PDF links for Grade 6-13 ICT exam papers in English and Sinhala mediums.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Past Paper PDF
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map((paper) => (
          <div
            key={paper.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 text-xs font-bold border border-slate-700">
                    Grade {paper.grade} ICT
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                    {paper.medium === 'SINHALA' ? '🇱🇰 සිංහල' : '🇬🇧 English'}
                  </span>
                </div>
                {paper.year && (
                  <span className="text-xs text-slate-400 font-semibold">{paper.year} Exam</span>
                )}
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{paper.title}</h3>
              {paper.description && (
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {paper.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewPaper(paper)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview PDF
                </button>
                <a
                  href={getGoogleDriveDownloadUrl(paper.driveUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(paper)}
                  className="p-2 rounded-xl text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                  title="Edit Paper"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingPaper({ id: paper.id, title: paper.title })}
                  className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  title="Delete Paper"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Paper Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                {editingPaperId ? 'Edit Past Paper PDF' : 'Upload Paper (Google Drive)'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePaper} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase">Paper Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2023 Grade 10 ICT Model Evaluation Paper I & II"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Medium</label>
                  <select
                    value={medium}
                    onChange={(e) => setMedium(e.target.value as MediumType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="ENGLISH">🇬🇧 English</option>
                    <option value="SINHALA">🇱🇰 සිංහල</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(parseInt(e.target.value, 10) as GradeLevel)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none"
                  >
                    {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Exam Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase">
                  Google Drive File Link
                </label>
                <input
                  type="url"
                  required
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/1ABC.../view"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <p className="text-[10px] text-slate-500">
                  Ensure link sharing is set to "Anyone with the link can view".
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional exam instructions or marking scheme notes..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg"
                >
                  {loading ? 'Saving...' : editingPaperId ? 'Update Paper' : 'Save Paper to NeonDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded PDF View Modal */}
      {previewPaper && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{previewPaper.title}</h3>
                <p className="text-[11px] text-slate-400">Grade {previewPaper.grade} ICT Exam Paper</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={getGoogleDriveDownloadUrl(previewPaper.driveUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
                <button
                  onClick={() => setPreviewPaper(null)}
                  className="text-slate-400 hover:text-white text-base font-bold px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950">
              <iframe
                src={getGoogleDriveEmbedUrl(previewPaper.driveUrl)}
                className="w-full h-full border-0"
                allow="autoplay"
                title={previewPaper.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Popup Confirmation Modal for Paper Deletion */}
      <ConfirmDeleteModal
        isOpen={!!deletingPaper}
        title="Delete Past Paper PDF?"
        itemName={deletingPaper?.title}
        description="Are you sure you want to delete this past paper PDF from the LMS? Students will no longer be able to view or download it."
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingPaper(null)}
      />
    </div>
  );
}
