import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const scheduledCalls = await prisma.scheduledCall.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        scheduledTime: 'desc',
      },
    });

    return NextResponse.json(scheduledCalls);
  } catch (error) {
    console.error('Error fetching scheduled calls:', error);
    return NextResponse.json({ error: 'Failed to fetch scheduled calls' }, { status: 500 });
  }
}