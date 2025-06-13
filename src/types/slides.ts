import { z } from 'zod';
import { VIDEO_FPS } from './constants';

export const SlidesProps = z.object({
  videos: z.array(z.string().url()).min(1, "At least one video URL is required"),
  texts: z.array(z.string().min(1, "Text cannot be empty")).min(1, "At least one text is required"),
  song: z.string().url("Song must be a valid URL or resolvable path"),
  totalDuration: z.number().min(5).max(60).default(15), // Total duration in seconds (5-60 seconds)
}).refine(
  (data) => data.videos.length === data.texts.length,
  {
    message: "Videos and texts arrays must have the same length",
    path: ["videos", "texts"],
  }
);

export const defaultSlidesProps: z.infer<typeof SlidesProps> = {
  videos: [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  ],
  texts: [
    'Big Buck Bunny - A short film',
    'Elephants Dream - Animation masterpiece'
  ],
  song: 'https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3',
  totalDuration: 30, 
};

// Calculate duration based on total duration and number of videos
export const calculateSlidesDuration = (totalDurationSeconds: number) => totalDurationSeconds * VIDEO_FPS;

// Calculate duration per video (excluding subscribe button time)
export const calculateDurationPerVideo = (totalDurationSeconds: number, videoCount: number) => {
  const subscribeButtonSeconds = 3;
  const availableTimeForVideos = Math.max(totalDurationSeconds - subscribeButtonSeconds, videoCount * 1); // Minimum 1 second per video
  const secondsPerVideo = availableTimeForVideos / videoCount;
  return Math.max(secondsPerVideo, 1); // Ensure minimum 1 second per video
};