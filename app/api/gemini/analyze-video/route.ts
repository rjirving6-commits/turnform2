import { NextResponse } from 'next/server';
import { analyzeVideoForForm } from '@/lib/gemini-server';

// Use Node.js runtime for Gemini API compatibility
export const runtime = 'nodejs';
// Increase max duration for video processing (60 seconds)
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { videoBase64, mimeType, prompt } = await request.json();
    if (!videoBase64 || !mimeType) {
        return NextResponse.json({ message: 'Missing video data or mimeType' }, { status: 400 });
    }

    const result = await analyzeVideoForForm(videoBase64, mimeType, prompt);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in analyze-video API route:', error);
    return NextResponse.json({ message: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
