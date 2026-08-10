import { NextResponse } from 'next/server';
import { QUIZZES } from '@/lib/data';
import { QuestionResultDetail, QuizResult } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quizId, studentName = 'Student', answers = {}, timeSpentSeconds = 0 } = body;

    const quiz = QUIZZES.find((q) => q.id === quizId);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    let correctAnswersCount = 0;
    const details: QuestionResultDetail[] = [];

    quiz.questions.forEach((q) => {
      const userSelected: number[] = (answers[q.id] || []).sort((a: number, b: number) => a - b);
      const expected: number[] = [...q.correctAnswers].sort((a: number, b: number) => a - b);

      const isCorrect =
        userSelected.length === expected.length &&
        userSelected.every((val, idx) => val === expected[idx]);

      if (isCorrect) {
        correctAnswersCount += 1;
      }

      details.push({
        questionId: q.id,
        questionText: q.text,
        userSelection: userSelected,
        correctAnswers: expected,
        isCorrect,
        options: q.options,
        explanation: q.explanation,
      });
    });

    const totalQuestions = quiz.questions.length;
    const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);
    const passed = scorePercentage >= quiz.passingScore;

    const result: QuizResult = {
      id: `res-${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      studentName,
      scorePercentage,
      correctAnswersCount,
      totalQuestions,
      passed,
      timeSpentSeconds,
      submittedAt: new Date().toISOString(),
      details,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
