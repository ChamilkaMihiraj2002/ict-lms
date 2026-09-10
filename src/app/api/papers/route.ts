import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gradeParam = searchParams.get('grade');
    const mediumParam = searchParams.get('medium');

    const where: any = {};
    if (gradeParam) {
      where.grade = parseInt(gradeParam, 10);
    }
    if (mediumParam) {
      where.medium = mediumParam;
    }

    const papers = await prisma.paper.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(papers);
  } catch (error) {
    console.error('Fetch papers API error:', error);
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}
