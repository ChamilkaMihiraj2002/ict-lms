import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        quizzes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Admin fetch courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, grade, medium = 'ENGLISH', category, description, iconName = 'BookOpen', bannerGradient = 'from-blue-600 to-cyan-500' } = await request.json();

    if (!title || !grade || !category || !description) {
      return NextResponse.json({ error: 'Title, grade, category, and description are required' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        grade: parseInt(String(grade), 10),
        medium: medium === 'SINHALA' ? 'SINHALA' : 'ENGLISH',
        category,
        description,
        iconName,
        bannerGradient,
        modules: {
          create: [{
            title: 'Main Module',
            description: 'Main topics for this course',
            order: 1
          }]
        }
      },
      include: {
        modules: true
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, grade, medium = 'ENGLISH', category, description, iconName, bannerGradient } = await request.json();

    if (!id || !title || !grade || !category || !description) {
      return NextResponse.json({ error: 'Course ID, title, grade, category, and description are required' }, { status: 400 });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        title,
        grade: parseInt(String(grade), 10),
        medium: medium === 'SINHALA' ? 'SINHALA' : 'ENGLISH',
        category,
        description,
        ...(iconName ? { iconName } : {}),
        ...(bannerGradient ? { bannerGradient } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
