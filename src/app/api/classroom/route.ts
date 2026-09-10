import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { ApiError, requireUser, serverError } from '@/server/auth/authorization';
import { validateItem } from '@/features/classroom/lib/classroom';

export async function GET() {
  try {
    const user = await requireUser();
    const admin = user.role === 'ADMIN';
    const items = await prisma.classroomItem.findMany({
      where: admin ? {} : { grade: user.grade, medium: user.medium },
      include: { submissions: { where: admin ? {} : { userId: user.id },
        include: { user: { select: { name: true, email: true } } }, orderBy: { submittedAt: 'desc' } } },
      orderBy: [{ dueAt: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ items, role: user.role, grade: user.grade, medium: user.medium });
  } catch (error) { return serverError(error); }
}

export async function POST(request: Request) {
  try {
    await requireUser('ADMIN');
    const body = await request.json();
    let data;
    try { data = validateItem(body); } catch (e) { throw new ApiError((e as Error).message); }
    const item = await prisma.classroomItem.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (error) { return serverError(error); }
}

export async function PUT(request: Request) {
  try {
    await requireUser('ADMIN');
    const body = await request.json();
    if (typeof body.id !== 'string') throw new ApiError('Activity ID is required.');
    let data;
    try { data = validateItem(body); } catch (e) { throw new ApiError((e as Error).message); }
    // Keep cohort and grading rules stable once published; students may be submitting concurrently.
    const item = await prisma.classroomItem.findUnique({ where: { id: body.id } });
    if (!item) throw new ApiError('Activity not found.', 404);
    if (item.kind !== data.kind || item.grade !== data.grade || item.medium !== data.medium || item.maxPoints !== data.maxPoints) {
      throw new ApiError('Type, cohort and maximum marks cannot change after publishing. Create a new activity instead.');
    }
    return NextResponse.json(await prisma.classroomItem.update({ where: { id: item.id }, data }));
  } catch (error) { return serverError(error); }
}

export async function DELETE(request: Request) {
  try {
    await requireUser('ADMIN');
    const id = new URL(request.url).searchParams.get('id');
    if (!id) throw new ApiError('Activity ID is required.');
    await prisma.classroomItem.deleteMany({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) { return serverError(error); }
}
