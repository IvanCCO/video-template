import { z } from 'zod';

export const SlideshowProps = z.object({
  title: z.string().optional(),
  images: z.array(z.string().url()).min(1, "At least one image URL is required"),
  song: z.string().url("Song must be a valid URL or resolvable path"), // Or z.string() if it's a local path processed by staticFile
});

export const defaultSlideshowProps: z.infer<typeof SlideshowProps> = {
  title: 'Image Slideshow',
  images: ['https://via.placeholder.com/1920x1080.png?text=Default+Image'], // Default placeholder image
  song: 'audio/default-background-music.mp3', // Default placeholder song, ensure this exists in public/audio
};

export const SLIDESHOW_DURATION_IN_FRAMES = 150; // 5 seconds at 30 FPS, adjust as needed per image 