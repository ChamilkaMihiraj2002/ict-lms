import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { ApiError, requireUser, serverError } from '@/server/auth/authorization';
import { safeWebUrl } from '@/features/classroom/lib/classroom';

export async function POST(request: Request) {
  try {
    const user = await requireUser('STUDENT');
    const body = await request.json();
    if (typeof body.itemId !== 'string' || typeof body.content !== 'string' || !body.content.trim() || body.content.length > 20000) {
      throw new ApiError('Include your answer (up to 20,000 characters).');
    }
    let attachmentUrl;
    try { attachmentUrl = safeWebUrl(body.attachmentUrl); } catch (e) { throw new ApiError((e as Error).message); }
    const item = await prisma.classroomItem.findFirst({ where: { id: body.itemId, kind: 'ASSIGNMENT', grade: user.grade, medium: user.medium } });
    if (!item) throw new ApiError('Assignment not found for your class.', 404);
    // One immutable hand-in prevents accidental overwrites and grading races; late hand-ins are accepted and flagged.
    const existing = await prisma.submission.findUnique({ where: { itemId_userId: { itemId: item.id, userId: user.id } } });
    if (existing) throw new ApiError('You have already submitted this assignment.', 409);
    const result = await prisma.submission.create({ data: { itemId: item.id, userId: user.id, content: body.content.trim(), attachmentUrl } });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') return NextResponse.json({ error: 'You have already submitted this assignment.' }, { status: 409 });
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireUser('ADMIN');
    const { id, score, feedback } = await request.json();
    if (typeof id !== 'string' || !Number.isInteger(score) || typeof feedback !== 'string' || feedback.length > 10000) throw new ApiError('Provide valid marks and feedback (up to 10,000 characters).');
    const submission = await prisma.submission.findUnique({ where: { id }, include: { item: true } });
    if (!submission) throw new ApiError('Submission not found.', 404);
    if (score < 0 || score > submission.item.maxPoints) throw new ApiError(`Marks must be from 0 to ${submission.item.maxPoints}.`);
    return NextResponse.json(await prisma.submission.update({ where: { id }, data: { score, feedback: feedback.trim(), gradedAt: new Date() } }));
  } catch (error) { return serverError(error); }
}
