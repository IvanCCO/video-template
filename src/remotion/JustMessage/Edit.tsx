import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { z } from 'zod';
import { VIDEO_FPS } from '../../types/constants';
import { JustMessageProps } from '../../types/justMessage';
import { SubscribeButton, Quote, ImageWithLayers } from '../../components';

const CONFIGURATION = {
  opacityFrames: 100,
}

// Props for our inner Slideshow component
interface InternalSlideshowProps {
  images: string[];
  song: string;
  quotes: Array<{ text: string; author?: string; startFrame: number; endFrame: number }>;
}

const InnerSlideshow: React.FC<InternalSlideshowProps> = ({ images, song, quotes }) => {
  const totalFrames = 10 * VIDEO_FPS;
  const silentPauseFrames = 1 * VIDEO_FPS; 
  const contentFrames = totalFrames - silentPauseFrames;

  const mainImage = images[0];

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background music - ends 1 second before video ends */}
      <Audio
        src={song.startsWith('http') ? song : staticFile(song)}
        endAt={totalFrames}
        volume={0.7}
      />

      {/* Main image with layers */}
      <Sequence durationInFrames={contentFrames}>
        <ImageWithLayers src={mainImage} opacityFrames={CONFIGURATION.opacityFrames} />
      </Sequence>

      {/* Quotes */}
      {quotes.map((quote, index) => (
        <Sequence
          key={index}
          from={quote.startFrame}
          durationInFrames={quote.endFrame - quote.startFrame}
        >
          <Quote 
            text={quote.text} 
            author={quote.author} 
            opacityFrames={CONFIGURATION.opacityFrames}
          />
        </Sequence>
      ))}

      {/* Subscribe button - appears in the last 3 seconds */}
      <Sequence
        from={totalFrames - 3 * VIDEO_FPS}
        durationInFrames={3 * VIDEO_FPS}
      >
        <SubscribeButton />
      </Sequence>

      {/* Silent pause at the end */}
      <Sequence from={contentFrames} durationInFrames={silentPauseFrames}>
        <AbsoluteFill style={{ backgroundColor: 'black' }} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Main Slideshow component that accepts props defined in slideshowTypes.ts
export const JustMessageEdit: React.FC<z.infer<typeof JustMessageProps>> = (props) => {
  const quotes = [
    {
      text: props.message,
      author: props.author,
      startFrame: 0,
      endFrame: (10 - 1) * VIDEO_FPS, 
    },
  ];

  return <InnerSlideshow images={props.images} song={props.song} quotes={quotes} />;
}; 