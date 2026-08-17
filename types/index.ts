export type GradeLevel = 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type MediumType = 'ENGLISH' | 'SINHALA';

export interface User {
  id: string;
  name: string;
  email: string;
  grade: GradeLevel;
  medium?: MediumType;
  avatarUrl?: string;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  points: number;
  streakDays: number;
  role?: 'STUDENT' | 'ADMIN';
}

export interface Video {
  id: string;
  subLessonId: string;
  title: string;
  youtubeUrl: string;
  order: number;
}

export interface Pdf {
  id: string;
  subLessonId: string;
  title: string;
  pdfUrl: string;
  order: number;
}

export interface SubLesson {
  id: string;
  lessonId: string;
  title: string;
  order: number;
  content?: string;
  videos: Video[];
  pdfs: Pdf[];
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  order: number;
  durationMinutes: number;
  isCompleted?: boolean;
  sections: {
    heading: string;
    text: string;
    codeSnippet?: {
      language: string;
      code: string;
    };
    tip?: string;
  }[];
  subLessons?: SubLesson[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  grade: GradeLevel;
  medium?: MediumType;
  category: 'Programming' | 'Web Development' | 'Networking' | 'Hardware & Systems' | 'Cybersecurity' | 'Databases';
  description: string;
  iconName: string;
  bannerGradient: string;
  modules: Module[];
}

export interface QuestionOption {
  id: number;
  text: string;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: 'single' | 'multiple';
  options: QuestionOption[];
  correctAnswers: number[];
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  grade: GradeLevel;
  medium?: MediumType;
  durationMinutes: number;
  passingScore: number;
  questions: Question[];
}

export interface QuestionResultDetail {
  questionId: string;
  questionText: string;
  userSelection: number[];
  correctAnswers: number[];
  isCorrect: boolean;
  options: QuestionOption[];
  explanation: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  studentName: string;
  scorePercentage: number;
  correctAnswersCount: number;
  totalQuestions: number;
  passed: boolean;
  timeSpentSeconds: number;
  submittedAt: string;
  details: QuestionResultDetail[];
}

export interface Paper {
  id: string;
  title: string;
  grade: GradeLevel;
  medium: MediumType;
  year?: number;
  driveUrl: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
