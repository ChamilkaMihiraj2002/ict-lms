import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { requireUser, serverError } from '@/server/auth/authorization';

export async function GET() {
  try {
    const user = await requireUser();
    const courses = await prisma.course.findMany({
      where: user.role === 'ADMIN' ? {} : { grade: user.grade, medium: user.medium },
      include: { modules: { orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' }, include: { subLessons: { orderBy: { order: 'asc' }, include: { videos: { orderBy: { order: 'asc' } }, pdfs: { orderBy: { order: 'asc' } } } } } } } } },
      orderBy: { title: 'asc' },
    });
    return NextResponse.json(courses);
  } catch (error) { return serverError(error); }
}
