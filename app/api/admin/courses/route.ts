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
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
