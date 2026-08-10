'use client';

import { useState, useEffect } from 'react';
import { Plus, BookOpen, CheckCircle, Sparkles, Eye, Edit3, HelpCircle } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { GradeLevel, MediumType } from '@/types';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(10);
  const [medium, setMedium] = useState<MediumType>('ENGLISH');
  const [category, setCategory] = useState('Web Development');
  const [description, setDescription] = useState(
    `# Course Curriculum & Objectives\nLearn the fundamentals of web layout using **HTML5**, **CSS3**, and interactive **JavaScript**.\n\n> Note: This course covers national ICT syllabus topics for G.C.E. O/L.\n\n### Sample HTML Code\n\`\`\`html\n<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello ICT Student!</h1>\n  </body>\n</html>\n\`\`\``
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCourses = () => {
    fetch('/api/admin/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          grade,
          medium,
          category,
          description,
        }),
      });

      if (res.ok) {
        setMessage('Course created and saved to NeonDB PostgreSQL!');
        setShowAddModal(false);
        setTitle('');
        fetchCourses();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">ICT Course Management</h1>
          <p className="text-xs text-slate-400">
            Publish and manage English and Sinhala medium curriculum courses with rich Markdown descriptions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Course
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 text-xs font-bold border border-slate-700">
                    Grade {course.grade} ICT
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                    {course.medium === 'SINHALA' ? '🇱🇰 සිංහල' : '🇬🇧 English'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{course.category}</span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">{course.title}</h3>

              <div className="text-xs text-slate-300 max-h-32 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-slate-800">
                <MarkdownRenderer content={course.description} />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>{course.modules?.length || 0} Modules</span>
              <span className="text-emerald-400 font-semibold">Published in NeonDB</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating Course with Markdown Editor + Live Preview */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Create ICT Course (Markdown Enabled)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grade 10 ICT: HTML5 & Web Development"
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
                  <label className="text-xs font-semibold text-slate-300 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Programming">Programming</option>
                    <option value="Networking">Networking</option>
                    <option value="Hardware & Systems">Hardware & Systems</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Databases">Databases</option>
                  </select>
                </div>
              </div>

              {/* Markdown Description Field with Live Preview Tab */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                    Course Description (Markdown Supported)
                  </label>

                  <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveTab('write')}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        activeTab === 'write' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" /> Write .md
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        activeTab === 'preview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Eye className="w-3 h-3" /> Live Render Preview
                    </button>
                  </div>
                </div>

                {activeTab === 'write' ? (
                  <textarea
                    rows={6}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="# Course Title&#10;**Bold text**, *Italic text*, lists, and ```html live code runners```..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
                  />
                ) : (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl max-h-60 overflow-y-auto">
                    <MarkdownRenderer content={description} />
                  </div>
                )}
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
                  {loading ? 'Creating...' : 'Save Course to NeonDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
