import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const scheduledCalls = await prisma.scheduledCall.findMany({
      where: {
        status: 'PENDING',
      },
      orderBy: {
        scheduledTime: 'asc',
      },
    });

    return NextResponse.json({ scheduledCalls });
  } catch (error) {
    console.error('Error fetching scheduled calls:', error);
    return NextResponse.json({ error: 'Failed to fetch scheduled calls' }, { status: 500 });
  }
}