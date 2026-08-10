import { COURSES, INITIAL_USER, QUIZZES } from '@/lib/data';
import { Course, Quiz, QuizResult, User } from '@/types';

const STORAGE_KEYS = {
  USER: 'ict_lms_user_v1',
  QUIZ_RESULTS: 'ict_lms_quiz_results_v1',
};

export function getStoredUser(): User {
  if (typeof window === 'undefined') return INITIAL_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USER;
  }
}

export function saveStoredUser(user: User): User {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user in localStorage', e);
    }
  }
  return user;
}

export function logoutStoredUser(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error('Failed to clear user from localStorage', e);
    }
  }
}

export function markLessonAsCompleted(lessonId: string): User {
  const user = getStoredUser();
  if (!user.completedLessonIds.includes(lessonId)) {
    const updated: User = {
      ...user,
      completedLessonIds: [...user.completedLessonIds, lessonId],
      points: user.points + 25,
    };
    return saveStoredUser(updated);
  }
  return user;
}

export function getAllCourses(): Course[] {
  return COURSES;
}

export function getCourseById(courseId: string): Course | undefined {
  return COURSES.find((c) => c.id === courseId);
}

export function getAllQuizzes(): Quiz[] {
  return QUIZZES;
}

export function getQuizById(quizId: string): Quiz | undefined {
  return QUIZZES.find((q) => q.id === quizId);
}

export function getStoredQuizResults(): QuizResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveQuizResult(result: QuizResult): void {
  if (typeof window !== 'undefined') {
    try {
      const existing = getStoredQuizResults();
      const updatedList = [result, ...existing.filter((r) => r.id !== result.id)];
      localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(updatedList));

      const user = getStoredUser();
      const earnedPoints = result.passed ? result.scorePercentage + 50 : 10;
      saveStoredUser({
        ...user,
        points: user.points + earnedPoints,
      });
    } catch (e) {
      console.error('Failed to save quiz result', e);
    }
  }
}

export function getQuizResultById(resultId: string): QuizResult | undefined {
  const results = getStoredQuizResults();
  return results.find((r) => r.id === resultId);
}
