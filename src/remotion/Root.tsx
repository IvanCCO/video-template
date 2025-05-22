import { Composition } from "remotion";
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  COMPOSITION_ID,
} from "../types/constants";
import { Main as SlideshowMain } from "./ImageSlideshow/Main";
import { defaultSlideshowProps } from "../types/slideshowTypes";
import { Main as JustMessageMain } from "./JustMessage/Main";
import { JUST_MESSAGE_DURATION_IN_FRAMES, defaultJustMessageProps } from "../types/justMessage";


export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMPOSITION_ID.ImageSlideshow}
        component={SlideshowMain}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultSlideshowProps}
      />
      <Composition
        id={COMPOSITION_ID.JustMessage}
        component={JustMessageMain}
        durationInFrames={JUST_MESSAGE_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultJustMessageProps}
      />
    </>
  );
};
