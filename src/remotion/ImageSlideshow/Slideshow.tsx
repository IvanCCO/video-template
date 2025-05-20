import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { z } from 'zod';
import { SlideshowProps as ExternalSlideshowProps } from '../../types/slideshowTypes'; // Corrected path

// Define the props for our subtitles
interface SubtitleProps {
  text: string;
}

// Props for our inner Slideshow component - now matches ExternalSlideshowProps structure for images and song
interface InternalSlideshowProps {
  images: string[];
  song: string;
  subtitles: Array<{ text: string; startFrame: number; endFrame: number }>; // Subtitles remain for now
}

// Subtitle component
const Subtitle: React.FC<SubtitleProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation for the subtitle
  const opacity = interpolate(
    frame,
    [0, 10, 30, 40],
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
        bottom: 80,
        width: '100%',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 10,
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif',
          fontSize: 36,
          fontWeight: 'bold',
          opacity,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Image component with fade-in/fade-out effect
const ImageWithTransition: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Create a spring animation for the scale
  const scale = spring({
    frame,
    fps,
    config: {
      mass: 1,
      damping: 200,
    },
    durationInFrames: durationInFrames,
  });

  // Create fade in/out effect
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Subtle zoom effect
  const zoom = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.05],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
      }}
    >
      <Img
        src={src.startsWith('http') ? src : staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${zoom})`,
        }}
      />
    </AbsoluteFill>
  );
};

// Inner Slideshow component with the actual implementation
const InnerSlideshow: React.FC<InternalSlideshowProps> = ({ images, song, subtitles }) => {
  const { fps } = useVideoConfig();
  const frameDurationPerImage = (5 * fps); // 5 seconds per image, ensure SLIDESHOW_DURATION_IN_FRAMES reflects this

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background music */}
      <Audio src={song.startsWith('http') ? song : staticFile(song)} />

      {/* Images shown in series */}
      <Series>
        {images.map((imageSrc, index) => (
          <Series.Sequence
            key={index}
            durationInFrames={frameDurationPerImage}
          >
            <ImageWithTransition src={imageSrc} />
          </Series.Sequence>
        ))}
      </Series>

      {/* Subtitles */}
      {subtitles.map((subtitle, index) => (
        <Sequence
          key={index}
          from={subtitle.startFrame}
          durationInFrames={subtitle.endFrame - subtitle.startFrame}
        >
          <Subtitle text={subtitle.text} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Main Slideshow component that accepts props defined in slideshowTypes.ts
export const Slideshow: React.FC<z.infer<typeof ExternalSlideshowProps>> = (props) => {
  // Use the props passed from Main.tsx. Subtitles are still hardcoded here.
  // Consider making subtitles dynamic or removing if not needed for API-driven version.
  const hardcodedSubtitles = [
    {
      text: props.title || 'Welcome to the slideshow',
      startFrame: 0,
      endFrame: 90, // Example: 3 seconds
    },
    {
      text: 'Created with Remotion',
      startFrame: 91,
      endFrame: 180, // Example: 3 seconds
    },
    // Add more subtitles as needed or make them dynamic
  ];

  return <InnerSlideshow images={props.images} song={props.song} subtitles={hardcodedSubtitles} />;
}; 