import { z } from 'zod';
import { VIDEO_FPS } from './constants';

export const JustMessageProps = z.object({
  images: z.array(z.string().url()).min(1, "At least one image URL is required"),
  message: z.string().min(1, "Message is required"),
  author: z.string().optional(),
  song: z.string().url("Song must be a valid URL or resolvable path"), // Or z.string() if it's a local path processed by staticFile
});

export const defaultJustMessageProps: z.infer<typeof JustMessageProps> = {
  message: 'O homem é o filho do homem, e com ele se deve falar de homem.',
  images: ['https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Magritte_TheSonOfMan.jpg/250px-Magritte_TheSonOfMan.jpg'],
  author: "Bob Dylan",
  song: 'https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3',
};

export const JUST_MESSAGE_DURATION_IN_FRAMES = 10 * VIDEO_FPS;


