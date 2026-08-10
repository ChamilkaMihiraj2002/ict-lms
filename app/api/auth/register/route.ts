import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createJWT, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, grade = 10, medium = 'ENGLISH' } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        grade: parseInt(String(grade), 10),
        medium: medium === 'SINHALA' ? 'SINHALA' : 'ENGLISH',
        role: 'STUDENT',
        points: 100,
        streakDays: 1,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    const token = await createJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      grade: user.grade,
    });

    const response = NextResponse.json({ user: userWithoutPassword, success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
