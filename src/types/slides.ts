import { z } from 'zod';
import { VIDEO_FPS } from './constants';

export const SlidesProps = z.object({
  images: z.array(z.string().url()).min(1, "At least one image URL is required"),
  texts: z.array(z.string().min(1, "Text cannot be empty")).min(1, "At least one text is required"),
  song: z.string().url("Song must be a valid URL or resolvable path"),
})

export const defaultSlidesProps: z.infer<typeof SlidesProps> = {
  images: [
    'https://videos.pexels.com/video-files/7565439/7565439-hd_1080_1920_25fps.mp4',
    'https://videos.pexels.com/video-files/7565625/7565625-hd_1080_1920_25fps.mp4',
    'https://videos.pexels.com/video-files/3694915/3694915-uhd_1440_2560_30fps.mp4',
    'https://videos.pexels.com/video-files/7565622/7565622-hd_1080_1920_25fps.mp4'
  ],
  texts: [
    'Big Buck Bunny - A short film',
    'Elephants Dream - Animation masterpiece',
    'Animation masterpiece',
    'Animation short film'
  ],
  song: 'https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3',
};

// Calculate duration based on total duration and number of videos
export const calculateSlidesDuration = (totalDurationSeconds: number) => totalDurationSeconds * VIDEO_FPS;

export const SLIDES_DURATION_IN_FRAMES = 20 * VIDEO_FPS;