import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        course: true,
        questions: true,
      },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Fetch admin quizzes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      courseId,
      title,
      description,
      grade,
      medium = 'ENGLISH',
      durationMinutes = 10,
      passingScore = 70,
      questions = [],
    } = body;

    if (!courseId || !title || !description || questions.length === 0) {
      return NextResponse.json(
        { error: 'Course, quiz title, description, and at least 1 question are required.' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        title,
        description,
        grade: parseInt(String(grade), 10),
        medium: medium === 'SINHALA' ? 'SINHALA' : 'ENGLISH',
        durationMinutes: parseInt(String(durationMinutes), 10),
        passingScore: parseInt(String(passingScore), 10),
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            type: q.type || 'single',
            options: q.options,
            correctAnswers: q.correctAnswers,
            explanation: q.explanation || '',
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Create quiz API error:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
