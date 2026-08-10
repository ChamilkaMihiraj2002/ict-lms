'use client';

import { useState, useEffect } from 'react';
import { Plus, HelpCircle, CheckCircle, Sparkles, Trash2, Clock, Award, Globe } from 'lucide-react';
import { GradeLevel, MediumType } from '@/types';

interface OptionDraft {
  id: number;
  text: string;
}

interface QuestionDraft {
  text: string;
  type: 'single' | 'multiple';
  options: OptionDraft[];
  correctAnswers: number[];
  explanation: string;
}

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(10);
  const [medium, setMedium] = useState<MediumType>('ENGLISH');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [passingScore, setPassingScore] = useState(70);

  // Questions List
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      text: '',
      type: 'single',
      options: [
        { id: 0, text: '' },
        { id: 1, text: '' },
        { id: 2, text: '' },
        { id: 3, text: '' },
      ],
      correctAnswers: [0],
      explanation: '',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchQuizzesAndCourses = () => {
    fetch('/api/admin/quizzes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuizzes(data);
      })
      .catch(() => {});

    fetch('/api/admin/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
          if (data.length > 0) {
            setCourseId(data[0].id);
            setGrade(data[0].grade);
            setMedium(data[0].medium || 'ENGLISH');
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchQuizzesAndCourses();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'single',
        options: [
          { id: 0, text: '' },
          { id: 1, text: '' },
          { id: 2, text: '' },
          { id: 3, text: '' },
        ],
        correctAnswers: [0],
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, idx) => idx !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const next = [...questions];
    next[index].text = text;
    setQuestions(next);
  };

  const handleQuestionTypeChange = (index: number, type: 'single' | 'multiple') => {
    const next = [...questions];
    next[index].type = type;
    setQuestions(next);
  };

  const handleOptionTextChange = (qIndex: number, optId: number, text: string) => {
    const next = [...questions];
    next[qIndex].options[optId].text = text;
    setQuestions(next);
  };

  const handleToggleCorrectOption = (qIndex: number, optId: number) => {
    const next = [...questions];
    const q = next[qIndex];
    if (q.type === 'single') {
      q.correctAnswers = [optId];
    } else {
      if (q.correctAnswers.includes(optId)) {
        q.correctAnswers = q.correctAnswers.filter((id) => id !== optId);
      } else {
        q.correctAnswers = [...q.correctAnswers, optId];
      }
    }
    setQuestions(next);
  };

  const handleExplanationChange = (index: number, text: string) => {
    const next = [...questions];
    next[index].explanation = text;
    setQuestions(next);
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          title,
          description,
          grade,
          medium,
          durationMinutes,
          passingScore,
          questions,
        }),
      });

      if (res.ok) {
        setMessage('Quiz created and saved to NeonDB PostgreSQL!');
        setShowAddModal(false);
        setTitle('');
        setDescription('');
        setQuestions([
          {
            text: '',
            type: 'single',
            options: [
              { id: 0, text: '' },
              { id: 1, text: '' },
              { id: 2, text: '' },
              { id: 3, text: '' },
            ],
            correctAnswers: [0],
            explanation: '',
          },
        ]);
        fetchQuizzesAndCourses();
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
          <h1 className="text-2xl font-bold text-white">ICT Quiz Management</h1>
          <p className="text-xs text-slate-400">
            Create and publish English & Sinhala medium quiz assessments in NeonDB PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Quiz
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 text-xs font-bold border border-slate-700">
                    Grade {quiz.grade} ICT
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                    {quiz.medium === 'SINHALA' ? '🇱🇰 සිංහල' : '🇬🇧 English'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  {quiz.questions?.length || 0} Questions
                </span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">{quiz.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {quiz.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {quiz.durationMinutes} Mins
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Pass: {quiz.passingScore}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Quiz Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Create Quiz & Questions
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-6">
              {/* Select Course & Medium Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Select Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => {
                      setCourseId(e.target.value);
                      const found = courses.find((c) => c.id === e.target.value);
                      if (found) {
                        setGrade(found.grade);
                        setMedium(found.medium || 'ENGLISH');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. HTML සහ වෙබ් මූලධර්ම පරීක්ෂණය හෝ Web Fundamentals Assessment"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Quiz description..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Questions Builder */}
              <div className="space-y-6 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-cyan-400" /> Questions ({questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400">
                        Question #{qIdx + 1}
                      </span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <input
                        type="text"
                        required
                        value={q.text}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        placeholder="Question prompt..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`qtype-${qIdx}`}
                          checked={q.type === 'single'}
                          onChange={() => handleQuestionTypeChange(qIdx, 'single')}
                        />
                        Single Choice
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`qtype-${qIdx}`}
                          checked={q.type === 'multiple'}
                          onChange={() => handleQuestionTypeChange(qIdx, 'multiple')}
                        />
                        Multiple Choice
                      </label>
                    </div>

                    {/* Options A, B, C, D */}
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">
                        Option Choices (Check box to set correct answer)
                      </div>
                      {q.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={q.correctAnswers.includes(opt.id)}
                            onChange={() => handleToggleCorrectOption(qIdx, opt.id)}
                            className="w-4 h-4 accent-cyan-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-400 w-4">
                            {String.fromCharCode(65 + opt.id)}
                          </span>
                          <input
                            type="text"
                            required
                            value={opt.text}
                            onChange={(e) => handleOptionTextChange(qIdx, opt.id, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + opt.id)} text`}
                            className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 pt-2">
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                        placeholder="Explanation for correct answer..."
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg"
                >
                  {loading ? 'Saving Quiz...' : 'Save Quiz to NeonDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
