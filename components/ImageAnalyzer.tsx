import React, { useState, useRef, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Spinner } from './Spinner';
import { UploadIcon, SparklesIcon } from './icons/Icons';

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

export const ImageAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File is too large. Please select an image under 10MB.');
        return;
      }
      setError(null);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysis('');
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setAnalysis('');
    setError(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await analyzeImage(base64Image, imageFile.type);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Image Analyzer</h2>
        <p className="text-gray-400">Upload a photo to get insights on form and position.</p>
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
            accept="image/*"
            className="hidden"
          />
          <UploadIcon className="w-10 h-10 text-gray-500 mb-2"/>
          <p className="text-gray-400">
            {imageFile ? `Selected: ${imageFile.name}` : 'Click to upload image (Max 10MB)'}
          </p>
        </div>

        {error && <p className="text-red-400 mt-2">{error}</p>}

        {imagePreview && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Preview" className="w-full max-w-md mx-auto rounded-lg" />
          </div>
        )}
      </div>

      {imageFile && (
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
          {isLoading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      )}

      {analysis && (
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-3">
          <h3 className="text-xl font-semibold text-indigo-400">AI Analysis</h3>
          <p className="text-gray-300 leading-relaxed">{analysis}</p>
        </div>
      )}
    </div>
  );
};
