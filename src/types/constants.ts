import { z } from "zod";
export const COMP_NAME = "MyComp";

export const COMPOSITION_ID = {
  "JustMessage": "JustMessage",
  "ImageSlideshow": "ImageSlideshow",
  "Slides": "Slides",
}

export const CompositionProps = z.object({
  title: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 24;
