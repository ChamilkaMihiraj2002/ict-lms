import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { QUIZZES } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('id');
    const mediumParam = searchParams.get('medium');

    if (quizId) {
      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true },
      });

      if (!quiz) {
        const fallbackQuiz = QUIZZES.find((q) => q.id === quizId);
        if (!fallbackQuiz) {
          return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }
        return NextResponse.json(fallbackQuiz);
      }

      return NextResponse.json(quiz);
    }

    let quizzes = await prisma.quiz.findMany({
      include: { questions: true },
    });

    if (!quizzes || quizzes.length === 0) {
      let fallback = QUIZZES;
      if (mediumParam) fallback = fallback.filter((q) => q.medium === mediumParam);
      return NextResponse.json(fallback);
    }

    if (mediumParam) {
      quizzes = quizzes.filter((q) => q.medium === mediumParam);
    }

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('API quizzes fetch error:', error);
    return NextResponse.json(QUIZZES);
  }
}
