import { requireUser, apiError } from '@/server/auth/authorization';
import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';

export async function POST(request: Request) {
  try {
    await requireUser('ADMIN');
    const { moduleId, title, order = 1, durationMinutes = 15, sections, subLessons } = await request.json();

    if (!moduleId || !title) {
      return NextResponse.json({ error: 'moduleId and title are required' }, { status: 400 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        order: parseInt(String(order), 10),
        durationMinutes: parseInt(String(durationMinutes), 10),
        sections: sections || [],
        ...(subLessons ? {
          subLessons: {
            create: subLessons.map((sl: any) => ({
              title: sl.title,
              content: sl.content,
              order: sl.order || 1,
              videos: {
                create: (sl.videos || []).map((v: any, vIdx: number) => ({ title: v.title, youtubeUrl: v.youtubeUrl, order: v.order || vIdx + 1 }))
              },
              pdfs: {
                create: (sl.pdfs || []).map((p: any, pIdx: number) => ({ title: p.title, pdfUrl: p.pdfUrl, order: p.order || pIdx + 1 }))
              }
            }))
          }
        } : {})
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Create lesson error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create lesson' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireUser('ADMIN');
    const { id, title, order, durationMinutes, sections, subLessons } = await request.json();

    if (!id || !title) {
      return NextResponse.json({ error: 'Lesson ID and title are required' }, { status: 400 });
    }

    if (subLessons !== undefined) {
      // Delete existing sub-lessons to cleanly replace them
      await prisma.subLesson.deleteMany({ where: { lessonId: id } });
    }

    const updated = await prisma.lesson.update({
      where: { id },
      data: {
        title,
        ...(order !== undefined ? { order: parseInt(String(order), 10) } : {}),
        ...(durationMinutes !== undefined ? { durationMinutes: parseInt(String(durationMinutes), 10) } : {}),
        ...(sections !== undefined ? { sections } : {}),
        ...(subLessons !== undefined ? {
          subLessons: {
            create: subLessons.map((sl: any) => ({
              title: sl.title,
              content: sl.content,
              order: sl.order || 1,
              videos: {
                create: (sl.videos || []).map((v: any, vIdx: number) => ({ title: v.title, youtubeUrl: v.youtubeUrl, order: v.order || vIdx + 1 }))
              },
              pdfs: {
                create: (sl.pdfs || []).map((p: any, pIdx: number) => ({ title: p.title, pdfUrl: p.pdfUrl, order: p.order || pIdx + 1 }))
              }
            }))
          }
        } : {})
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Update lesson error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update lesson' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireUser('ADMIN');
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
    const authError = apiError(error);
    if (authError) return authError;
    console.error('Delete lesson error:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
