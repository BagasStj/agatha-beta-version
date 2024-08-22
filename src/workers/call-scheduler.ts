import { startCallService } from '@/lib/call-service';
import { prisma } from '@/lib/prisma';

async function processScheduledCalls() {
  const now = new Date();
  const scheduledCalls = await prisma.scheduledCall.findMany({
    where: {
      scheduledTime: {
        lte: now,
      },
      status: 'PENDING',
    },
  });

  for (const call of scheduledCalls) {
    try {
      await startCallService(JSON.parse(call.callData));
      await prisma.scheduledCall.update({
        where: { id: call.id },
        data: { status: 'COMPLETED' },
      });
    } catch (error) {
      console.error(`Failed to process scheduled call ${call.id}:`, error);
      await prisma.scheduledCall.update({
        where: { id: call.id },
        data: { status: 'FAILED' },
      });
    }
  }
}

// Run this function periodically (e.g., every minute)
setInterval(processScheduledCalls, 60000);