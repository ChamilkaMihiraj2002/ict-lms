import { NextResponse } from 'next/server';
import { getAuthSession } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

export class ApiError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export const publicUserSelect = {
  id: true, name: true, email: true, role: true, grade: true, medium: true,
  points: true, streakDays: true, completedLessonIds: true,
} as const;

export async function requireUser(role?: 'ADMIN' | 'STUDENT') {
  const session = await getAuthSession();
  if (!session) throw new ApiError('Please sign in to continue.', 401);
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: publicUserSelect });
  if (!user) throw new ApiError('Your account is no longer available.', 401);
  if (role && user.role !== role) throw new ApiError('You do not have access to this action.', 403);
  return user;
}

export function apiError(error: unknown) {
  if (error instanceof ApiError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  return null;
}

export function serverError(error: unknown) {
  const known = apiError(error);
  if (known) return known;
  console.error('LMS request failed:', error);
  return NextResponse.json({ error: 'Unable to save or load data. Please try again.' }, { status: 500 });
}
