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
  spring,
} from 'remotion';
import { z } from 'zod';
import { SlideshowProps as ExternalSlideshowProps } from '../../types/slideshowTypes';
import { VIDEO_FPS } from '../../types/constants';


const CONFIGURATION = {
  opacityFrames: 100,
}

// Define the props for our quote text
interface QuoteProps {
  text: string;
  author?: string;
}

// Props for our inner Slideshow component
interface InternalSlideshowProps {
  images: string[];
  song: string;
  quotes: Array<{ text: string; author?: string; startFrame: number; endFrame: number }>;
}

// Quote component with serif font
const Quote: React.FC<QuoteProps> = ({ text, author }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Animation for the quote - fade in at start, stay visible until the end
  const opacity = interpolate(
    frame,
    [0, CONFIGURATION.opacityFrames, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '85%',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          color: 'white',
          fontFamily: 'Georgia, serif',
          fontSize: 54,
          fontWeight: '800',
          lineHeight: 1.4,
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)',
          opacity,
          WebkitTextStroke: '1.5px black',
          letterSpacing: '0.5px',
          whiteSpace: 'wrap',
          wordWrap: 'break-word',
        }}
      >
        {text}
      </div>
      {author && (
        <div
          style={{
            color: 'white',
            fontFamily: 'Georgia, serif',
            fontSize: 36,
            fontWeight: '500',
            opacity,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
            marginTop: 40,
            fontStyle: 'italic',
          }}
        >
          - {author}
        </div>
      )}
    </div>
  );
};

// Image component with background and foreground layers
const ImageWithLayers: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Calculate blur amount - starting with full blur and reducing to 0 at 2 seconds
  const blurAmount = interpolate(
    frame,
    [0, 2 * fps],
    [20, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const opacity = interpolate(
    frame,
    [0, CONFIGURATION.opacityFrames, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Background layer - blurred and darkened */}
      <AbsoluteFill>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
          <Img
            src={src.startsWith('http') ? src : staticFile(src)}
            style={{
              width: '100%',
              height: '60%',
              objectFit: 'cover',
              filter: `blur(${blurAmount}px) brightness(0.7) saturate(1.5)`, // Dynamic blur
            }}
          />
          {/* Vignette effect overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle, transparent 10%, rgba(0,0,0,0.9) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const InnerSlideshow: React.FC<InternalSlideshowProps> = ({ images, song, quotes }) => {
  // Fixed duration of 10 seconds as per requirements
  const totalFrames = 10 * VIDEO_FPS;
  const silentPauseFrames = 1 * VIDEO_FPS; // 1 second silent pause at the end
  const contentFrames = totalFrames - silentPauseFrames;

  const mainImage = images[0];

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background music - ends 1 second before video ends */}
      <Audio
        src={song.startsWith('http') ? song : staticFile(song)}
        endAt={contentFrames}
        volume={0.7}
      />

      {/* Main image with layers */}
      <Sequence durationInFrames={contentFrames}>
        <ImageWithLayers src={mainImage} />
      </Sequence>

      {/* Quotes */}
      {quotes.map((quote, index) => (
        <Sequence
          key={index}
          from={quote.startFrame}
          durationInFrames={quote.endFrame - quote.startFrame}
        >
          <Quote text={quote.text} author={quote.author} />
        </Sequence>
      ))}

      {/* Silent pause at the end */}
      <Sequence from={contentFrames} durationInFrames={silentPauseFrames}>
        <AbsoluteFill style={{ backgroundColor: 'black' }} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Main Slideshow component that accepts props defined in slideshowTypes.ts
export const Slideshow: React.FC<z.infer<typeof ExternalSlideshowProps>> = (props) => {
  const quotes = [
    {
      text: props.title || 'An inspiring quote goes here',
      author: props.author,
      startFrame: 0,
      endFrame: 10 * VIDEO_FPS, // Stay for the entire video duration
    },
  ];

  return <InnerSlideshow images={props.images} song={props.song} quotes={quotes} />;
}; 