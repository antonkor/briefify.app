import { useState, useCallback } from 'react';
import { loadSampleVideoData, getRandomSampleVideo, SampleDataError } from '@/utils/sampleData';
import { logger, devTools } from '@/config/dev';

interface VideoData {
  id: string;
  publishDate: string;
  title: string;
  description: string;
  category: string;
  author: string;
  ownerChannelName: string;
  channelId: string;
  allowRatings: boolean;
  isPrivate: boolean;
  isLiveContent: boolean;
  isUnlisted: boolean;
  length: number;
  viewCount: number;
  likeCount: number;
  captionTracks: Array<{
    language: string;
    kind: string;
  }>;
}

interface UseVideoDataReturn {
  videoData: VideoData | null;
  isLoading: boolean;
  error: string | null;
  loadRandomVideo: () => Promise<void>;
  loadFirstVideo: () => Promise<void>;
  clearError: () => void;
  retryCount: number;
}

export const useVideoData = (): UseVideoDataReturn => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const handleError = useCallback((err: unknown, operation: string) => {
    let errorMessage = `Failed to ${operation}`;

    if (err instanceof Error) {
      const sampleError = err as SampleDataError;
      errorMessage = sampleError.message;

      logger.error(`Video data operation failed: ${operation}`, {
        message: sampleError.message,
        isRetryable: sampleError.isRetryable,
        statusCode: sampleError.statusCode,
        retryCount,
      });

      if (sampleError.isRetryable) {
        errorMessage += ` (Retryable error - attempt ${retryCount + 1})`;
      }
    } else {
      logger.error(`Unknown error during ${operation}:`, err);
    }

    setError(errorMessage);
    setRetryCount(prev => prev + 1);
  }, [retryCount]);

  const loadRandomVideo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const startTime = performance.now();
    devTools.logFetchAttempt('/sample-video.json', retryCount + 1, 3);

    try {
      const video = await getRandomSampleVideo();
      setVideoData(video);
      setRetryCount(0);

      const endTime = performance.now();
      devTools.logFetchSuccess('/sample-video.json', endTime - startTime);

      logger.debug('Loaded random video:', video.title);
    } catch (err) {
      devTools.logFetchError('/sample-video.json', err as Error, retryCount + 1);
      handleError(err, 'load random video');
    } finally {
      setIsLoading(false);
    }
  }, [retryCount, handleError]);

  const loadFirstVideo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const startTime = performance.now();
    devTools.logFetchAttempt('/sample-video.json', retryCount + 1, 3);

    try {
      const data = await loadSampleVideoData();
      if (data.length > 0) {
        setVideoData(data[0]);
        setRetryCount(0);

        const endTime = performance.now();
        devTools.logFetchSuccess('/sample-video.json', endTime - startTime);

        logger.debug('Loaded first video:', data[0].title);
      } else {
        throw new Error('No video data available');
      }
    } catch (err) {
      devTools.logFetchError('/sample-video.json', err as Error, retryCount + 1);
      handleError(err, 'load first video');
    } finally {
      setIsLoading(false);
    }
  }, [retryCount, handleError]);

  return {
    videoData,
    isLoading,
    error,
    loadRandomVideo,
    loadFirstVideo,
    clearError,
    retryCount,
  };
};