import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { AnalysisResult } from "../types";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const analyzeVideoForForm = async (videoBase64: string, mimeType: string, prompt: string): Promise<AnalysisResult> => {
    const videoPart = fileToGenerativePart(videoBase64, mimeType);
    const systemInstruction = "You are 'Apex AI Judge,' an expert gymnastics judge and coach. Your purpose is to analyze a gymnast's routine from a video. First, provide constructive feedback on form. Second, identify potential deductions based on scoring rules (e.g., bent legs, flexed feet, steps on landing). For each deduction, provide a timestamp, a description, and a potential deduction range (e.g., 0.1 to 0.3). Finally, calculate a final score range, assuming a 10.0 start value.";

    const fullPrompt = `Please analyze the routine in this video. Here are my specific concerns: "${prompt || 'No specific concerns mentioned'}". Provide both form corrections and a list of potential deductions with ranges. Then, give me an estimated final score range for the routine.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
          parts: [
              { text: fullPrompt },
              videoPart
          ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                formCorrections: {
                    type: Type.ARRAY,
                    description: "A list of feedback points for the gymnast's form.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            timestamp: { type: Type.NUMBER, description: "The timestamp in seconds for the form correction." },
                            feedback: { type: Type.STRING, description: "The constructive feedback on form." }
                        },
                        required: ["timestamp", "feedback"]
                    }
                },
                deductions: {
                    type: Type.ARRAY,
                    description: "A list of potential deductions a judge might take.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            timestamp: { type: Type.NUMBER, description: "The timestamp in seconds where the error occurs." },
                            description: { type: Type.STRING, description: "Description of the error leading to a deduction." },
                            deductionRangeMin: { type: Type.NUMBER, description: "The minimum deduction amount (e.g., 0.1)." },
                            deductionRangeMax: { type: Type.NUMBER, description: "The maximum deduction amount (e.g., 0.3)." }
                        },
                        required: ["timestamp", "description", "deductionRangeMin", "deductionRangeMax"]
                    }
                },
                finalScoreRange: {
                    type: Type.OBJECT,
                    description: "The estimated final score range for the routine.",
                    properties: {
                        min: { type: Type.NUMBER, description: "The minimum estimated score." },
                        max: { type: Type.NUMBER, description: "The maximum estimated score." }
                    },
                    required: ["min", "max"]
                }
            },
            required: ["formCorrections", "deductions", "finalScoreRange"]
        }
      }
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse || { formCorrections: [], deductions: [], finalScoreRange: { min: 0, max: 0 } };
};

export const generateSpeechFromText = async (text: string): Promise<string> => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Say with a helpful and encouraging tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) {
      throw new Error("No audio data returned from API.");
    }
    return audioBase64;
};


export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
    const imagePart = fileToGenerativePart(imageBase64, mimeType);
    const prompt = "You are 'Apex AI Coach,' an expert gymnastics coaching assistant. Analyze the gymnast's form and position in this image. Provide constructive, safe, and encouraging feedback. Focus on alignment, posture, and extension.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
          parts: [
              { text: prompt },
              imagePart
          ]
      },
    });

    return response.text;
};
