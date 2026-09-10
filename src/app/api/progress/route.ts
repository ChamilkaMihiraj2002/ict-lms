import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { ApiError, publicUserSelect, requireUser, serverError } from '@/server/auth/authorization';

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { lessonId } = await request.json();
    if (typeof lessonId !== 'string') throw new ApiError('Lesson ID is required.');
    const lesson = await prisma.lesson.findFirst({ where: { id: lessonId, ...(user.role === 'ADMIN' ? {} : { module: { course: { grade: user.grade, medium: user.medium } } }) } });
    if (!lesson) throw new ApiError('Lesson not found for your class.', 404);
    // The predicate and award are one atomic update, including concurrent requests.
    await prisma.user.updateMany({ where: { id: user.id, NOT: { completedLessonIds: { has: lessonId } } }, data: { completedLessonIds: { push: lessonId }, points: { increment: 25 } } });
    return NextResponse.json({ user: await prisma.user.findUnique({ where: { id: user.id }, select: publicUserSelect }) });
  } catch (error) { return serverError(error); }
}
