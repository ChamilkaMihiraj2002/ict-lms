'use client';

import { useState, useEffect } from 'react';
import { Plus, BookOpen, CheckCircle, Sparkles, Eye, Edit3, Trash2, Video, FileText, PlusCircle } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { GradeLevel, MediumType } from '@/types';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<{ id: string; title: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(10);
  const [medium, setMedium] = useState<MediumType>('ENGLISH');
  const [category, setCategory] = useState('Web Development');
  const sampleMarkdown = `# පාඨමාලා හැඳින්වීම (Course Overview)

මෙම පාඨමාලාව මගින් ජාතික ICT විෂය නිර්දේශයට අනුකූලව **පරිගණක විද්‍යාව** සහ **තොරතුරු තාක්ෂණය** පිළිබඳ පූර්ණ දැනුම ලබා දේ.

### පාඨමාලාවේ ප්‍රධාන අරමුණු:
* පරිගණක පද්ධති සහ දෘඩාංග පිළිබඳ මූලික අවබෝධය ලබා දීම
* දත්ත නිරූපණය සහ සංඛ්‍යා පද්ධති පිළිබඳ ප්‍රායෝගික දැනුම
* වෙබ් අඩවි නිර්මාණය සහ ක්‍රමලේඛනය (Programming)

> **සටහන:** එක් එක් පාඩම් (Lessons) සහ අභ්‍යාස සවිස්තරාත්මකව හැදෑරීම සඳහා Module සටහන් භාවිතා කරන්න.`;

  const [description, setDescription] = useState(sampleMarkdown);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Lesson Management State
  const [managingCourse, setManagingCourse] = useState<any | null>(null);
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState(15);
  const [lessonContent, setLessonContent] = useState('');
  const [lessonActiveTab, setLessonActiveTab] = useState<'write' | 'preview'>('write');
  const [lessonLoading, setLessonLoading] = useState(false);
  const [subLessons, setSubLessons] = useState<any[]>([]);

  const sampleLessonMarkdown = `### 1. හැඳින්වීම
දත්ත සහ තොරතුරු සැකසීම පිළිබඳ පූර්ණ විස්තරය...

* **අංග 1:** විග්‍රහය
* **අංග 2:** උදාහරණ 45<sub>10</sub>, 1011<sub>2</sub>

| අංගය | අගය |
| :--- | :--- |
| **දශමය** | 10 |
| **ද්විමය** | 2 |`;

  const openManageLessons = (course: any) => {
    setManagingCourse(course);
    const firstModId = course.modules?.[0]?.id || '';
    setSelectedModuleId(firstModId);
    setEditingLessonId(null);
    setLessonTitle('');
    setLessonDuration(15);
    setLessonContent(sampleLessonMarkdown);
    setSubLessons([]);
    setShowLessonsModal(true);
  };

  const openAddLessonForm = () => {
    setEditingLessonId(null);
    setLessonTitle('');
    setLessonDuration(15);
    setLessonContent(sampleLessonMarkdown);
    setSubLessons([]);
  };

  const openEditLessonForm = (lesson: any) => {
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title || '');
    setLessonDuration(lesson.durationMinutes || 15);
    const secText = Array.isArray(lesson.sections) && lesson.sections[0] ? lesson.sections[0].text : '';
    setLessonContent(secText);
    setSubLessons(lesson.subLessons || []);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingCourse) return;
    setLessonLoading(true);

    let targetModuleId = selectedModuleId;
    if (!targetModuleId) {
      if (managingCourse.modules && managingCourse.modules.length > 0) {
        targetModuleId = managingCourse.modules[0].id;
      } else {
        alert('This course has no modules yet. Please try refreshing the page or create a module first.');
        setLessonLoading(false);
        return;
      }
    }

    const isEdit = !!editingLessonId;
    const url = '/api/admin/lessons';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit ? { id: editingLessonId } : { moduleId: targetModuleId }),
          title: lessonTitle,
          durationMinutes: lessonDuration,
          sections: [
            {
              heading: lessonTitle,
              text: lessonContent,
            },
          ],
          subLessons: subLessons,
        }),
      });

      if (res.ok) {
        setMessage(isEdit ? 'Lesson updated successfully!' : 'Lesson created successfully!');
        fetchCourses();
        setShowLessonsModal(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Error: ${errData.error || 'Failed to save lesson. Check server console.'}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLessonLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      const res = await fetch(`/api/admin/lessons?id=${lessonId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Lesson deleted successfully.');
        fetchCourses();
        setShowLessonsModal(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

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

  const openCreateModal = () => {
    setEditingCourseId(null);
    setTitle('');
    setGrade(10);
    setMedium('SINHALA');
    setCategory('Hardware & Systems');
    setDescription(sampleMarkdown);
    setShowAddModal(true);
  };

  const openEditModal = (course: any) => {
    setEditingCourseId(course.id);
    setTitle(course.title || '');
    setGrade(course.grade || 10);
    setMedium(course.medium || 'ENGLISH');
    setCategory(course.category || 'Web Development');
    setDescription(course.description || '');
    setShowAddModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!editingCourseId;
    const url = '/api/admin/courses';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit ? { id: editingCourseId } : {}),
          title,
          grade,
          medium,
          category,
          description,
        }),
      });

      if (res.ok) {
        setMessage(isEdit ? 'Course updated successfully!' : 'Course created and saved to NeonDB!');
        setShowAddModal(false);
        fetchCourses();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCourse) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/courses?id=${deletingCourse.id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Course deleted successfully.');
        setDeletingCourse(null);
        fetchCourses();
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
          <h1 className="text-2xl font-bold text-white">ICT Lesson & Module Management</h1>
          <p className="text-xs text-slate-400">
            Publish, edit, and delete English and Sinhala medium curriculum lessons with rich Markdown descriptions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
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

            <div className="pt-3 border-t border-slate-800 text-xs font-medium flex items-center justify-between">
              <span className="text-slate-500">{course.modules?.length || 0} Modules</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openManageLessons(course)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-500/30"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Manage Lessons
                </button>
                <button
                  onClick={() => openEditModal(course)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeletingCourse({ id: course.id, title: course.title })}
                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating / Editing Course */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                {editingCourseId ? 'Edit ICT Course' : 'Create ICT Course (Markdown Enabled)'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
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
                  {loading ? 'Saving...' : editingCourseId ? 'Update Course' : 'Save Course to NeonDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Managing / Creating Lessons */}
      {showLessonsModal && managingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Manage Lessons & Content
                </h3>
                <p className="text-xs text-slate-400">
                  Course: <span className="text-slate-200 font-semibold">{managingCourse.title}</span>
                </p>
              </div>
              <button
                onClick={() => setShowLessonsModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* List of Existing Lessons in Course */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Existing Lessons
                </span>
                <button
                  type="button"
                  onClick={openAddLessonForm}
                  className="px-3 py-1 rounded-xl bg-indigo-600/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/40 border border-indigo-500/30 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> New Lesson
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto p-2 rounded-2xl bg-slate-950 border border-slate-800">
                {(managingCourse.modules || []).flatMap((m: any) => m.lessons || []).length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-3">
                    No lessons in this course yet. Use the form below to create one!
                  </p>
                ) : (
                  (managingCourse.modules || []).flatMap((m: any) =>
                    (m.lessons || []).map((l: any) => (
                      <div
                        key={l.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-200">{l.title}</div>
                          <div className="text-[10px] text-slate-400">{l.durationMinutes} Mins Read</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditLessonForm(l)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 hover:bg-cyan-900 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(l.id)}
                            className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>

            {/* Lesson Edit / Create Form */}
            <form onSubmit={handleSaveLesson} className="space-y-4 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {editingLessonId ? 'Edit Lesson Content' : 'Create New Lesson with Markdown'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Lesson Title</label>
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="e.g. පරිගණක විද්‍යාවේ සංඛ්‍යා පද්ධති"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              {/* Lesson Body Markdown Editor with Preview Tab */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Lesson Intro (Legacy Content)
                  </label>

                  <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setLessonActiveTab('write')}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        lessonActiveTab === 'write' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" /> Write .md
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonActiveTab('preview')}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        lessonActiveTab === 'preview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Eye className="w-3 h-3" /> Live Render Preview
                    </button>
                  </div>
                </div>

                {lessonActiveTab === 'write' ? (
                  <textarea
                    rows={4}
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                    placeholder="Short intro paragraph..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
                  />
                ) : (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl max-h-64 overflow-y-auto">
                    <MarkdownRenderer content={lessonContent} />
                  </div>
                )}
              </div>

              {/* Sub-Lessons Builder */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Sub-Lessons (Rich Content)
                  </h5>
                  <button
                    type="button"
                    onClick={() => setSubLessons([...subLessons, { id: Date.now(), title: '', content: '', videos: [], pdfs: [] }])}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-500/30"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Sub-Lesson
                  </button>
                </div>

                {subLessons.map((sl, slIdx) => (
                  <div key={sl.id || slIdx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Sub-Lesson {slIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...subLessons];
                          updated.splice(slIdx, 1);
                          setSubLessons(updated);
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Sub-Lesson Title"
                        value={sl.title}
                        onChange={(e) => {
                          const updated = [...subLessons];
                          updated[slIdx].title = e.target.value;
                          setSubLessons(updated);
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs"
                      />
                      <textarea
                        rows={3}
                        placeholder="Markdown Content..."
                        value={sl.content}
                        onChange={(e) => {
                          const updated = [...subLessons];
                          updated[slIdx].content = e.target.value;
                          setSubLessons(updated);
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono"
                      />

                      {/* Videos */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/50">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                          <span>Videos</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...subLessons];
                              if(!updated[slIdx].videos) updated[slIdx].videos = [];
                              updated[slIdx].videos.push({ id: Date.now(), title: '', youtubeUrl: '' });
                              setSubLessons(updated);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Video
                          </button>
                        </div>
                        {sl.videos?.map((v: any, vIdx: number) => (
                          <div key={v.id || vIdx} className="flex gap-2 items-center">
                            <Video className="w-4 h-4 text-slate-500 shrink-0" />
                            <input
                              type="text"
                              placeholder="Video Title"
                              value={v.title}
                              onChange={(e) => {
                                const updated = [...subLessons];
                                updated[slIdx].videos[vIdx].title = e.target.value;
                                setSubLessons(updated);
                              }}
                              className="flex-1 min-w-[100px] px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="YouTube URL"
                              value={v.youtubeUrl}
                              onChange={(e) => {
                                const updated = [...subLessons];
                                updated[slIdx].videos[vIdx].youtubeUrl = e.target.value;
                                setSubLessons(updated);
                              }}
                              className="flex-1 min-w-[150px] px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...subLessons];
                                updated[slIdx].videos.splice(vIdx, 1);
                                setSubLessons(updated);
                              }}
                              className="text-rose-400 p-1 shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* PDFs */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/50">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                          <span>PDF Documents</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...subLessons];
                              if(!updated[slIdx].pdfs) updated[slIdx].pdfs = [];
                              updated[slIdx].pdfs.push({ id: Date.now(), title: '', pdfUrl: '' });
                              setSubLessons(updated);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add PDF
                          </button>
                        </div>
                        {sl.pdfs?.map((p: any, pIdx: number) => (
                          <div key={p.id || pIdx} className="flex gap-2 items-center">
                            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                            <input
                              type="text"
                              placeholder="PDF Title"
                              value={p.title}
                              onChange={(e) => {
                                const updated = [...subLessons];
                                updated[slIdx].pdfs[pIdx].title = e.target.value;
                                setSubLessons(updated);
                              }}
                              className="flex-1 min-w-[100px] px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="PDF URL"
                              value={p.pdfUrl}
                              onChange={(e) => {
                                const updated = [...subLessons];
                                updated[slIdx].pdfs[pIdx].pdfUrl = e.target.value;
                                setSubLessons(updated);
                              }}
                              className="flex-1 min-w-[150px] px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...subLessons];
                                updated[slIdx].pdfs.splice(pIdx, 1);
                                setSubLessons(updated);
                              }}
                              className="text-rose-400 p-1 shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLessonsModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={lessonLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg"
                >
                  {lessonLoading ? 'Saving...' : editingLessonId ? 'Update Lesson' : 'Save Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Confirmation Modal for Course Deletion */}
      <ConfirmDeleteModal
        isOpen={!!deletingCourse}
        title="Delete Course?"
        itemName={deletingCourse?.title}
        description="Are you sure you want to delete this course? All modules, lessons, and content will be permanently removed."
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingCourse(null)}
      />
    </div>
  );
}
