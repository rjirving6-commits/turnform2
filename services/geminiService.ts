import type { AnalysisResult } from "../types";

export const analyzeVideoForForm = async (videoBase64: string, mimeType: string, prompt: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/gemini/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoBase64, mimeType, prompt }),
    });
    if (!response.ok) {
        // Handle 413 Payload Too Large specifically
        if (response.status === 413) {
            throw new Error('Video file is too large. Please use a video under 30MB or compress it before uploading.');
        }
        // Try to parse error message, but handle non-JSON responses
        let errorMessage = 'Failed to analyze video.';
        try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
        } catch {
            // If response is not JSON, use status text
            errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error analyzing video:", error);
    // Re-throw if it's already our formatted error
    if (error.message && (error.message.includes('too large') || error.message.includes('413'))) {
        throw error;
    }
    throw new Error("Sorry, I encountered an error while analyzing the video. Please check the console and try again.");
  }
};

export const generateSpeechFromText = async (text: string): Promise<string> => {
  try {
     const response = await fetch('/api/gemini/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate speech.');
    }
    const { audioBase64 } = await response.json();
    return audioBase64;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Failed to generate audio for feedback.");
  }
};

export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
  try {
     const response = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze image.');
    }
    const { text } = await response.json();
    return text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Sorry, I encountered an error while analyzing the image. Please check the console and try again.");
  }
};
