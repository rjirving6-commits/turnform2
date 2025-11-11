import React, { useState, useRef, useCallback } from 'react';
import { analyzeVideoForForm, generateSpeechFromText } from '../services/geminiService';
import { useSavedVideos } from '../hooks/useSavedVideos';
import type { AnalysisResult } from '../types';
import { Spinner } from './Spinner';
import { UploadIcon, SparklesIcon, SpeakerWaveIcon, BookmarkIcon } from './icons/Icons';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
  
// From @google/genai docs for TTS playback
const decode = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const AIVideoCoach: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { saveVideo } = useSavedVideos();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Limit to 30MB (base64 encoding increases size by ~33%, so this becomes ~40MB)
      // Vercel Pro plan supports up to 50MB, but we'll be conservative
      if (file.size > 30 * 1024 * 1024) {
        setError('File is too large. Please select a video under 30MB. For larger videos, consider compressing them first.');
        return;
      }
      setError(null);
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setAnalysis(null);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!videoFile) {
      setError('Please select a video first.');
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const base64Video = await fileToBase64(videoFile);
      const result = await analyzeVideoForForm(base64Video, videoFile.type, prompt);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      // Handle 413 Payload Too Large error specifically
      if (err.message?.includes('413') || err.message?.includes('Payload Too Large') || err.message?.includes('Request Entity Too Large')) {
        setError('Video file is too large. Please use a video under 30MB or compress it before uploading.');
      } else {
        setError(err.message || 'Failed to analyze video. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [videoFile, prompt]);
  
  const handleJumpToTimestamp = (time: number) => {
      if (videoRef.current) {
          videoRef.current.currentTime = time;
          videoRef.current.play();
      }
  };

  const handleTextToSpeech = async (text: string) => {
      if (isSpeaking) return;
      setIsSpeaking(true);

      if (!audioContextRef.current) {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      }
      const audioContext = audioContextRef.current;

      try {
        const audioBase64 = await generateSpeechFromText(text);
        const audioBytes = decode(audioBase64);
        const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => {
            setIsSpeaking(false);
        };
        source.start();
      } catch (err) {
        console.error(err);
        setError("Failed to generate audio feedback.");
        setIsSpeaking(false);
      }
  }
  
  const handleSaveVideo = () => {
      if (videoFile && analysis) {
          saveVideo(videoFile.name, prompt, analysis, videoFile);
          alert("Video analysis saved!");
      }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Video Coach</h2>
        <p className="text-gray-400">Upload a video of a routine for form analysis and scoring.</p>
      </div>

      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />
          <UploadIcon className="w-10 h-10 text-gray-500 mb-2"/>
          <p className="text-gray-400">
            {videoFile ? `Selected: ${videoFile.name}` : 'Click to upload video (Max 30MB)'}
          </p>
        </div>

        {error && <p className="text-red-400 mt-2 text-center">{error}</p>}

        {videoPreview && (
          <div className="mt-4">
            <video ref={videoRef} src={videoPreview} controls className="w-full max-w-md mx-auto rounded-lg" />
          </div>
        )}
      </div>

       {videoFile && (
        <>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Any specific concerns? (e.g., 'check my leg form on the back handspring')"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                rows={2}
            />
            <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
            {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
            {isLoading ? 'Analyzing...' : 'Analyze Routine'}
            </button>
        </>
      )}

      {analysis && (
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-indigo-400">AI Analysis Results</h3>
                <button 
                    onClick={handleSaveVideo}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                   <BookmarkIcon className="w-4 h-4" /> Save Analysis
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Corrections */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-lg text-white">Form Corrections</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {analysis.formCorrections.map((item, index) => (
                            <div key={index} className="p-3 bg-gray-800 rounded-lg">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-gray-300 flex-1">{item.feedback}</p>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => handleJumpToTimestamp(item.timestamp)} className="text-xs text-indigo-400 font-mono bg-indigo-900/50 px-2 py-1 rounded">@{item.timestamp}s</button>
                                        <button onClick={() => handleTextToSpeech(item.feedback)} disabled={isSpeaking} className="text-gray-400 hover:text-white disabled:opacity-50"><SpeakerWaveIcon className="w-5 h-5"/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deductions */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-lg text-white">Potential Deductions</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                         {analysis.deductions.map((item, index) => (
                            <div key={index} className="p-3 bg-gray-800 rounded-lg">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-gray-300 flex-1">{item.description}</p>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs font-semibold text-amber-400 bg-amber-900/50 px-2 py-1 rounded">{item.deductionRangeMin.toFixed(1)}-{item.deductionRangeMax.toFixed(1)}</span>
                                        <button onClick={() => handleJumpToTimestamp(item.timestamp)} className="text-xs text-indigo-400 font-mono bg-indigo-900/50 px-2 py-1 rounded">@{item.timestamp}s</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Final Score */}
            <div className="text-center pt-4 border-t border-gray-700">
                <p className="text-gray-400">Estimated Final Score (from 10.0)</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {analysis.finalScoreRange.min.toFixed(2)} - {analysis.finalScoreRange.max.toFixed(2)}
                </p>
            </div>
        </div>
      )}
    </div>
  );
};
