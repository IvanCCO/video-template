import { Composition } from "remotion";
import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { Main as SlideshowMain } from "./ImageSlideshow/Main";
import { SLIDESHOW_DURATION_IN_FRAMES, defaultSlideshowProps } from "../types/slideshowTypes";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMP_NAME}
        component={SlideshowMain}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultSlideshowProps}
      />
      <Composition
        id="ImageSlideshow"
        component={SlideshowMain}
        durationInFrames={SLIDESHOW_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultSlideshowProps}
      />
    </>
  );
};
