import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();

  const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
  const VOICE_ID = 'FGY2WhTYpPnrIDTdsKH5'; // Add this to your environment variables

  if (!ELEVEN_LABS_API_KEY || !VOICE_ID) {
    return NextResponse.json({ error: 'Missing API key or Voice ID' }, { status: 500 });
  }

  const options = {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVEN_LABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    }),
  };

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ElevenLabs API error:', errorData);
      throw new Error(`Failed to generate speech: ${response.status} ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to generate speech', message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to generate speech', message: 'An unknown error occurred' }, { status: 500 });
    }
  }
}