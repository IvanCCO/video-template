import {Composition} from 'remotion';
import { Main as ImageSlideshowMain } from './remotion/ImageSlideshow/Main';
import { Main as ImageSlideshowTestMain } from './remotion/PhylosoficalMessage/Main';
import { SlideshowProps, defaultSlideshowProps, defaultSlideshowPropsTest } from './types/slideshowTypes';
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from './types/constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ImageSlideshowComposition"
        component={ImageSlideshowMain}
        durationInFrames={20 * VIDEO_FPS} // 20 seconds duration
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={SlideshowProps} // Zod schema for props
        defaultProps={defaultSlideshowProps} // Default props
      />
      <Composition
        id="ImageSlideshowTestComposition"
        component={ImageSlideshowTestMain}
        durationInFrames={10 * VIDEO_FPS} // 10 seconds duration
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={SlideshowProps} // Zod schema for props
        defaultProps={defaultSlideshowPropsTest} // Default props
      />
    </>
  );
}; 