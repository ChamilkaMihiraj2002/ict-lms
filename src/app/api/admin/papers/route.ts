import { requireUser, apiError } from '@/server/auth/authorization';
import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';

export async function GET() {
  try {
    await requireUser('ADMIN');
    const papers = await prisma.paper.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(papers);
  } catch (error) {
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Admin fetch papers error:', error);
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireUser('ADMIN');
    const { title, grade, medium = 'ENGLISH', year, driveUrl, description } = await request.json();

    if (!title || !grade || !driveUrl) {
      return NextResponse.json(
        { error: 'Paper title, grade, and Google Drive URL are required.' },
        { status: 400 }
      );
    }

    const paper = await prisma.paper.create({
      data: {
        title,
        grade: parseInt(String(grade), 10),
        medium: medium === 'SINHALA' ? 'SINHALA' : 'ENGLISH',
        year: year ? parseInt(String(year), 10) : undefined,
        driveUrl,
        description,
      },
    });

    return NextResponse.json(paper);
  } catch (error) {
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Create paper API error:', error);
    return NextResponse.json({ error: 'Failed to create paper' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireUser('ADMIN');
    const { id, title, grade, medium = 'ENGLISH', year, driveUrl, description } = await request.json();

    if (!id || !title || !grade || !driveUrl) {
      return NextResponse.json(
        { error: 'Paper ID, title, grade, and Google Drive URL are required.' },
        { status: 400 }
      );
    }

    const updated = await prisma.paper.update({
      where: { id },
      data: {
        title,
        grade: parseInt(String(grade), 10),
        medium: medium === 'SINHALA' ? 'SINHALA' : 'ENGLISH',
        year: year ? parseInt(String(year), 10) : undefined,
        driveUrl,
        description,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Update paper API error:', error);
    return NextResponse.json({ error: 'Failed to update paper' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireUser('ADMIN');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Paper ID is required' }, { status: 400 });
    }

    await prisma.paper.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Delete paper error:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}
