import { NextResponse } from 'next/server';
import checkScheduledCalls from '@/scripts/checkScheduledCalls';

export async function GET(req: Request) {
  console.log('Cron job triggered at:', new Date().toISOString());
  try {
    await checkScheduledCalls();
    console.log('Scheduled calls checked and processed successfully');
    return NextResponse.json({ success: true, message: 'Scheduled calls checked and processed' });
  } catch (error) {
    console.error('Error checking scheduled calls:', error);
    return NextResponse.json({ success: false, error: 'Failed to check scheduled calls' }, { status: 500 });
  }
}