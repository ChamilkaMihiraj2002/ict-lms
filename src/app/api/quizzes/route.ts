import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { ApiError, requireUser, serverError } from '@/server/auth/authorization';

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const id = new URL(request.url).searchParams.get('id');
    const quizzes = await prisma.quiz.findMany({
      where: { ...(id ? { id } : {}), ...(user.role === 'ADMIN' ? {} : { grade: user.grade, medium: user.medium }) },
      include: { questions: { select: { id: true, quizId: true, text: true, type: true, options: true }, orderBy: { id: 'asc' } } },
      orderBy: { title: 'asc' },
    });
    if (id && !quizzes[0]) throw new ApiError('Quiz not found for your class.', 404);
    return NextResponse.json(id ? quizzes[0] : quizzes);
  } catch (error) { return serverError(error); }
}
