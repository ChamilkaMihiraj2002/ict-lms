import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const papers = await prisma.paper.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(papers);
  } catch (error) {
    console.error('Admin fetch papers error:', error);
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
    console.error('Create paper API error:', error);
    return NextResponse.json({ error: 'Failed to create paper' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
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
    console.error('Delete paper error:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}
