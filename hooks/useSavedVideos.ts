import { useState, useCallback } from 'react';
import type { SavedVideo, AnalysisResult } from '../types';

// Using a singleton pattern to keep videos in memory across component unmounts
const videoStore: { videos: SavedVideo[] } = {
    videos: []
};

export const useSavedVideos = () => {
    const [savedVideos, setSavedVideos] = useState<SavedVideo[]>(videoStore.videos);

    const saveVideo = useCallback((name: string, prompt: string, analysis: AnalysisResult, videoFile: File) => {
        const newVideo: SavedVideo = {
            id: `video-${Date.now()}`,
            name: name || videoFile.name,
            videoUrl: URL.createObjectURL(videoFile),
            mimeType: videoFile.type,
            prompt,
            analysis,
            date: new Date().toISOString(),
        };
        videoStore.videos = [newVideo, ...videoStore.videos];
        setSavedVideos([...videoStore.videos]);
    }, []);
    
    const deleteVideo = useCallback((videoId: string) => {
        const videoToDelete = videoStore.videos.find(v => v.id === videoId);
        if (videoToDelete) {
            URL.revokeObjectURL(videoToDelete.videoUrl);
        }
        videoStore.videos = videoStore.videos.filter(v => v.id !== videoId);
        setSavedVideos([...videoStore.videos]);
    }, []);

    return {
        savedVideos,
        saveVideo,
        deleteVideo,
    };
};
