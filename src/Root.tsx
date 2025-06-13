import {Composition} from 'remotion';
import { Main as ImageSlideshowMain } from './remotion/ImageSlideshow/Main';
import { Main as JustMessageMain } from './remotion/JustMessage/Main';
import { SlideshowProps, defaultSlideshowProps, SLIDESHOW_DURATION_IN_FRAMES } from './types/slideshowTypes';
import { COMPOSITION_ID, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from './types/constants';
import { JUST_MESSAGE_DURATION_IN_FRAMES, JustMessageProps, defaultJustMessageProps } from './types/justMessage';
import { SlidesEdit } from './remotion/Slides/Edit';
import { defaultSlidesProps, SlidesProps, SLIDES_DURATION_IN_FRAMES } from './types/slides';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMPOSITION_ID.ImageSlideshow}
        component={ImageSlideshowMain}
        durationInFrames={SLIDESHOW_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={SlideshowProps}
        defaultProps={defaultSlideshowProps} 
      />
      <Composition
        id={COMPOSITION_ID.JustMessage}
        component={JustMessageMain}
        durationInFrames={JUST_MESSAGE_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={JustMessageProps} 
        defaultProps={defaultJustMessageProps}
      />
      <Composition
        id={COMPOSITION_ID.Slides}
        component={SlidesEdit}
        durationInFrames={SLIDES_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={SlidesProps}
        defaultProps={defaultSlidesProps}
      />

    </>
  );
}; 