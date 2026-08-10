import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { COURSES } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gradeParam = searchParams.get('grade');
    const mediumParam = searchParams.get('medium');

    let courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!courses || courses.length === 0) {
      let fallback = COURSES;
      if (gradeParam) fallback = fallback.filter((c) => c.grade === parseInt(gradeParam, 10));
      if (mediumParam) fallback = fallback.filter((c) => c.medium === mediumParam);
      return NextResponse.json(fallback);
    }

    if (gradeParam) {
      const grade = parseInt(gradeParam, 10);
      courses = courses.filter((c) => c.grade === grade);
    }

    if (mediumParam) {
      courses = courses.filter((c) => c.medium === mediumParam);
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error('API courses fetch error:', error);
    return NextResponse.json(COURSES);
  }
}
