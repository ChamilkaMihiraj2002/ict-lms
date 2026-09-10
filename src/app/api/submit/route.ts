import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { ApiError, requireUser, serverError } from '@/server/auth/authorization';
import { gradeQuiz } from '@/features/quizzes/lib/grading';
import type { Question } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { quizId, answers, timeSpentSeconds = 0 } = await request.json();
    if (typeof quizId !== 'string' || !Number.isInteger(timeSpentSeconds) || timeSpentSeconds < 0 || timeSpentSeconds > 86400) throw new ApiError('Invalid quiz submission.');
    const quiz = await prisma.quiz.findFirst({ where: { id: quizId, ...(user.role === 'ADMIN' ? {} : { grade: user.grade, medium: user.medium }) }, include: { questions: true } });
    if (!quiz) throw new ApiError('Quiz not found for your class.', 404);
    let graded;
    try { graded = gradeQuiz(quiz.questions as unknown as Question[], answers, quiz.passingScore); }
    catch (e) { throw new ApiError((e as Error).message); }
    const result = await prisma.quizResult.create({ data: { ...graded, details: JSON.parse(JSON.stringify(graded.details)), quizId: quiz.id, userId: user.id, timeSpentSeconds } });
    return NextResponse.json({ ...result, quizTitle: quiz.title, studentName: user.name }, { status: 201 });
  } catch (error) { return serverError(error); }
}
