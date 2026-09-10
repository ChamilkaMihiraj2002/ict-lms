import { requireUser, apiError } from '@/server/auth/authorization';
import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';

export async function GET() {
  try {
    await requireUser('ADMIN');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        grade: true,
        medium: true,
        points: true,
        streakDays: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Fetch admin users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireUser('ADMIN');
    const { userId, grade, medium, role } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if ((grade !== undefined && (!Number.isInteger(grade) || grade < 6 || grade > 13)) ||
        (medium !== undefined && !['ENGLISH', 'SINHALA'].includes(medium)) ||
        (role !== undefined && !['ADMIN', 'STUDENT'].includes(role))) {
      return NextResponse.json({ error: 'Choose a valid grade, medium and role.' }, { status: 400 });
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(grade !== undefined && { grade: parseInt(String(grade), 10) }),
        ...(medium !== undefined && { medium }),
        ...(role !== undefined && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        grade: true,
        medium: true,
        points: true,
        streakDays: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireUser('ADMIN');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
