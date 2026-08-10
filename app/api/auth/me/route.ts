import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Try fetching user from database
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        grade: true,
        medium: true,
        points: true,
        streakDays: true,
        completedLessonIds: true,
      },
    });

    if (user) {
      return NextResponse.json({ user });
    }

    // Fallback using token payload if user not found in DB (e.g. static mock admin)
    return NextResponse.json({
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
        grade: session.grade || 10,
        medium: 'ENGLISH',
        points: 100,
        streakDays: 1,
        completedLessonIds: [],
      },
    });
  } catch (error) {
    console.error('Error fetching current session user:', error);
    return NextResponse.json({ error: 'Failed to retrieve session user' }, { status: 500 });
  }
}
