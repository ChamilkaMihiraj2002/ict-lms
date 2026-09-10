import { NextResponse } from 'next/server';
import { requireUser, serverError } from '@/server/auth/authorization';

export async function GET() {
  try { return NextResponse.json({ user: await requireUser() }); }
  catch (error) { return serverError(error); }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const { name, email } = await request.json();
    if (typeof name !== 'string' || !name.trim() || name.length > 100 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid name and email address.' }, { status: 400 });
    }
    const { prisma } = await import('@/server/db/prisma');
    const { publicUserSelect } = await import('@/server/auth/authorization');
    return NextResponse.json({ user: await prisma.user.update({ where: { id: user.id }, data: { name: name.trim(), email: email.trim().toLowerCase() }, select: publicUserSelect }) });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') return NextResponse.json({ error: 'This email address is already in use.' }, { status: 409 });
    return serverError(error);
  }
}
