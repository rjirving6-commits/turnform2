import type { AnalysisResult } from "../types";

export const analyzeVideoForForm = async (videoBase64: string, mimeType: string, prompt: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/gemini/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoBase64, mimeType, prompt }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze video.');
    }
    return await response.json();
  } catch (error) {
    console.error("Error analyzing video:", error);
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
