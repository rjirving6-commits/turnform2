import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSavedVideos } from '../hooks/useSavedVideos';
import type { SavedVideo } from '../types';

export const SavedVideos: React.FC = () => {
    const { savedVideos, deleteVideo } = useSavedVideos();
    const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null);
    const router = useRouter();

    if (selectedVideo) {
        // Detail View
        return (
            <div className="space-y-6">
                <button onClick={() => setSelectedVideo(null)} className="text-sm text-gray-400 hover:text-white">&larr; Back to Saved Videos</button>
                <h2 className="text-2xl font-bold text-white">{selectedVideo.name}</h2>
                <video src={selectedVideo.videoUrl} controls className="w-full rounded-lg" />
                
                 <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4">
                    <h3 className="text-xl font-semibold text-indigo-400">Analysis Details</h3>
                     <p className="text-gray-400"><span className="font-semibold text-gray-200">Prompt:</span> {selectedVideo.prompt || "N/A"}</p>
                    
                    <div>
                        <h4 className="font-semibold text-lg text-white mb-2">Form Corrections</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                            {selectedVideo.analysis.formCorrections.map((item, i) => <li key={i}>@{item.timestamp}s: {item.feedback}</li>)}
                        </ul>
                    </div>

                     <div>
                        <h4 className="font-semibold text-lg text-white mb-2">Potential Deductions</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                           {selectedVideo.analysis.deductions.map((item, i) => <li key={i}>@{item.timestamp}s: {item.description} ({item.deductionRangeMin.toFixed(1)}-{item.deductionRangeMax.toFixed(1)})</li>)}
                        </ul>
                    </div>
                     <div className="text-center pt-4 border-t border-gray-700">
                        <p className="text-gray-400">Estimated Final Score</p>
                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                            {selectedVideo.analysis.finalScoreRange.min.toFixed(2)} - {selectedVideo.analysis.finalScoreRange.max.toFixed(2)}
                        </p>
                    </div>
                 </div>
            </div>
        )
    }

    // List View
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Saved Videos</h2>
                <p className="text-gray-400">Review your past analyses.</p>
            </div>

            {savedVideos.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-dashed border-gray-700">
                    <p className="text-gray-500">You haven&apos;t saved any videos yet.</p>
                    <button onClick={() => router.push('/dashboard/ai-coach')} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
                        Analyze a Video
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedVideos.map(video => (
                        <div key={video.id} className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
                           <video src={video.videoUrl} className="w-full h-32 object-cover bg-black" />
                           <div className="p-4 space-y-3">
                                <h3 className="font-semibold truncate text-white">{video.name}</h3>
                                <p className="text-xs text-gray-400">{new Date(video.date).toLocaleDateString()}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setSelectedVideo(video)} className="flex-1 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-md">View</button>
                                    <button onClick={() => { if(window.confirm('Are you sure you want to delete this video?')) deleteVideo(video.id) } } className="flex-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-500 rounded-md">Delete</button>
                                </div>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
