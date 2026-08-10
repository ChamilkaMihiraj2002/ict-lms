import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { moduleId, title, order = 1, durationMinutes = 15, sections } = await request.json();

    if (!moduleId || !title || !sections) {
      return NextResponse.json({ error: 'moduleId, title, and sections are required' }, { status: 400 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        order: parseInt(String(order), 10),
        durationMinutes: parseInt(String(durationMinutes), 10),
        sections,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Create lesson error:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, order, durationMinutes, sections } = await request.json();

    if (!id || !title) {
      return NextResponse.json({ error: 'Lesson ID and title are required' }, { status: 400 });
    }

    const updated = await prisma.lesson.update({
      where: { id },
      data: {
        title,
        ...(order !== undefined ? { order: parseInt(String(order), 10) } : {}),
        ...(durationMinutes !== undefined ? { durationMinutes: parseInt(String(durationMinutes), 10) } : {}),
        ...(sections !== undefined ? { sections } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update lesson error:', error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete lesson error:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
