import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId, scheduledTime, callData } = await req.json();

  console.log('Scheduling call for:', scheduledTime);
  console.log('Call data:', JSON.stringify(callData, null, 2));

  try {
    const scheduledCall = await prisma.scheduledCall.create({
      data: {
        userId,
        scheduledTime,
        callData: JSON.stringify(callData),
      },
    });

    console.log('Call scheduled successfully:', scheduledCall.id);

    return NextResponse.json({ success: true, id: scheduledCall.id });
  } catch (error) {
    console.error('Error scheduling call:', error);
    return NextResponse.json({ success: false, error: 'Failed to schedule call' }, { status: 500 });
  }
}