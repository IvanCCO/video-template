import {Composition} from 'remotion';
import { Main as ImageSlideshowMain } from './remotion/ImageSlideshow/Main';
import { Main as ImageSlideshowTestMain } from './remotion/ImageSlideshowTest/Main';
import { SlideshowProps, defaultSlideshowProps, SLIDESHOW_DURATION_IN_FRAMES } from './types/slideshowTypes';

const FPS = 30;
const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ImageSlideshowComposition"
        component={ImageSlideshowMain}
        durationInFrames={SLIDESHOW_DURATION_IN_FRAMES} 
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={SlideshowProps} // Zod schema for props
        defaultProps={defaultSlideshowProps} // Default props
      />
      <Composition
        id="ImageSlideshowTestComposition"
        component={ImageSlideshowTestMain}
        durationInFrames={SLIDESHOW_DURATION_IN_FRAMES} 
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={SlideshowProps} // Zod schema for props
        defaultProps={defaultSlideshowProps} // Default props
      />
    </>
  );
}; 