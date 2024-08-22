import { startCallService } from '@/lib/call-service';
import { prisma } from '@/lib/prisma';

async function checkScheduledCalls() {
  console.log('Checking scheduled calls at:', new Date().toISOString());
  console.log('Server timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  const now = new Date();
  const scheduledCalls = await prisma.scheduledCall.findMany({
    where: {
      scheduledTime: {
        lte: now,
      },
      status: 'PENDING',
    },
  });

  console.log('Found scheduled calls:', scheduledCalls.length);

  for (const call of scheduledCalls) {
    try {
      console.log('Processing call:', call.id);
      const callData = JSON.parse(call.callData);
      await startCallService(callData);
      
      await prisma.scheduledCall.update({
        where: { id: call.id },
        data: { status: 'COMPLETED' },
      });
      console.log('Call completed:', call.id);
    } catch (error) {
      console.error(`Failed to start scheduled call ${call.id}:`, error);
      await prisma.scheduledCall.update({
        where: { id: call.id },
        data: { status: 'FAILED' },
      });
    }
  }
}

export default checkScheduledCalls;