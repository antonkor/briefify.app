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

export interface SampleDataError extends Error {
  isRetryable: boolean;
  statusCode?: number;
}

const createSampleDataError = (message: string, isRetryable = false, statusCode?: number): SampleDataError => {
  const error = new Error(message) as SampleDataError;
  error.isRetryable = isRetryable;
  error.statusCode = statusCode;
  return error;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loadSampleVideoData = async (
  retries = 3,
  delayMs = 1000
): Promise<VideoData[]> => {
  let lastError: SampleDataError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retrying sample data fetch (attempt ${attempt + 1}/${retries + 1})`);
        await delay(delayMs * attempt);
      }

      const response = await fetch('/sample-video.json', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const isRetryable = response.status >= 500 || response.status === 429;
        throw createSampleDataError(
          `Failed to fetch sample data: ${response.status} ${response.statusText}`,
          isRetryable,
          response.status
        );
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw createSampleDataError('Sample data is empty or invalid format', false);
      }

      console.log(`Successfully loaded ${data.length} sample videos`);
      return data;

    } catch (error) {
      if (error instanceof Error) {
        const sampleError = error as SampleDataError;
        lastError = sampleError;

        console.error(`Sample data fetch attempt ${attempt + 1} failed:`, {
          message: error.message,
          isRetryable: sampleError.isRetryable,
          statusCode: sampleError.statusCode,
        });

        if (!sampleError.isRetryable || attempt === retries) {
          break;
        }
      } else {
        lastError = createSampleDataError('Unknown error occurred', false);
        break;
      }
    }
  }

  throw lastError || createSampleDataError('Failed to load sample data after all retries', false);
};

export const getRandomSampleVideo = async (): Promise<VideoData> => {
  const data = await loadSampleVideoData();
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};

export const getSampleVideoById = async (id: string): Promise<VideoData | null> => {
  const data = await loadSampleVideoData();
  return data.find(video => video.id === id) || null;
};