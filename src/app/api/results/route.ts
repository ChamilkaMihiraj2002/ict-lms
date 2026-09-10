import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { ApiError, requireUser, serverError } from '@/server/auth/authorization';

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const id = new URL(request.url).searchParams.get('id');
    const results = await prisma.quizResult.findMany({ where: { userId: user.id, ...(id ? { id } : {}) },
      include: { quiz: { select: { title: true } }, user: { select: { name: true } } }, orderBy: { submittedAt: 'desc' }, take: id ? 1 : 100 });
    const mapped = results.map(({ quiz, user: student, ...result }) => ({ ...result, quizTitle: quiz.title, studentName: student.name }));
    if (id && !mapped[0]) throw new ApiError('Result not found.', 404);
    return NextResponse.json(id ? mapped[0] : mapped);
  } catch (error) { return serverError(error); }
}
