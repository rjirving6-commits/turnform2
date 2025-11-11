import { NextResponse } from 'next/server';
import { generateSpeechFromText } from '@/lib/gemini-server';

// Use Node.js runtime for Gemini API compatibility
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
        return NextResponse.json({ message: 'Missing text for speech generation' }, { status: 400 });
    }

    const audioBase64 = await generateSpeechFromText(text);
    return NextResponse.json({ audioBase64 });
  } catch (error: any) {
    console.error('Error in generate-speech API route:', error);
    return NextResponse.json({ message: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
