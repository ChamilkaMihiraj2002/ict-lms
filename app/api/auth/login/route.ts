import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Fallback for demo if user doesn't exist yet
      if (email === 'admin@ict.lk') {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
          data: {
            name: 'System Admin',
            email: 'admin@ict.lk',
            password: hashedPassword,
            role: 'ADMIN',
            grade: 13,
          },
        });
      } else {
        return NextResponse.json({ error: 'Invalid credentials. Account not found.' }, { status: 401 });
      }
    }

    // Verify bcrypt password hash (with fallback to direct comparison for legacy plain text passwords)
    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid && password === user.password) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
