import { NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini-server';

export async function POST(request: Request) {
  try {
    const { imageBase64, mimeType } = await request.json();
    if (!imageBase64 || !mimeType) {
        return NextResponse.json({ message: 'Missing image data or mimeType' }, { status: 400 });
    }

    const result = await analyzeImage(imageBase64, mimeType);
    return NextResponse.json({ text: result });
  } catch (error: any) {
    console.error('Error in analyze-image API route:', error);
    return NextResponse.json({ message: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
