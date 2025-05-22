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
import { VIDEO_FPS } from '../../types/constants';

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

// Enhanced subtitle component for TikTok-style dynamic text
const Subtitle: React.FC<SubtitleProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split text into individual characters for character-by-character animation
  const characters = text.split('');

  // Base opacity animation for the container
  const containerOpacity = interpolate(
    frame,
    [0, 10, 30, 40],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  // Dynamic scale/bounce effect based on frame
  const baseScale = spring({
    frame,
    fps,
    config: {
      mass: 0.5,
      damping: 10,
      stiffness: 100,
    }
  });
  
  // Pulse effect that repeats every 30 frames
  const pulse = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.05, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        opacity: containerOpacity,
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: 12,
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
          transform: `scale(${pulse})`,
          border: '2px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
        }}
      >
        {characters.map((char, index) => {
          const charDelay = index * 2;
          
          const charScale = interpolate(
            frame - charDelay,
            [0, 5, 10],
            [0, 1.4, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );
          
          // Character bounce effect that repeats
          const charBounce = (frame > charDelay + 10) 
            ? spring({
                frame: (frame - charDelay) % 60,
                fps,
                config: {
                  mass: 0.3,
                  damping: 15,
                }
              }) * 0.1 + 0.9 // Scale down the bounce effect
            : 1;

          // Different colors for emphasis
          const colors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#FF8C42', '#F2F2F2'];
          const color = index % 5 === 0 ? colors[index % colors.length] : 'white';
          
          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                transform: `scale(${charScale * charBounce})`,
                fontSize: char === ' ' ? 60 : 60, // Larger font size for TikTok
                color,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                margin: '0 2px',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Image component with enhanced transitions for TikTok
const ImageWithTransition: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Create a spring animation for the scale
  const scale = spring({
    frame,
    fps,
    config: {
      mass: 0.8,
      damping: 15,
      stiffness: 100,
    },
    durationInFrames: durationInFrames,
  });

  // Faster, more dramatic fade in/out effect for TikTok pacing
  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // More dynamic zoom effect
  const zoom = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.08],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  // Add slight rotation for visual interest
  const rotation = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [0, 0.3, 0],
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
        overflow: 'hidden', // Prevent image from overflowing during animations
      }}
    >
      <Img
        src={src.startsWith('http') ? src : staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          filter: 'saturate(1.2) contrast(1.1)',
        }}
      />
    </AbsoluteFill>
  );
};

// Inner Slideshow component with the actual implementation
const InnerSlideshow: React.FC<InternalSlideshowProps> = ({ images, song, subtitles }) => {
  const { fps } = useVideoConfig();
  // Set shorter durations for TikTok pacing
  const totalFrames = 20 * VIDEO_FPS; // 20 seconds total
  // Faster transitions between images (1-3 seconds per image for TikTok)
  const frameDurationPerImage = Math.min(3 * VIDEO_FPS, Math.floor(totalFrames / Math.max(1, images.length)));

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background music */}
      <Audio src={song.startsWith('http') ? song : staticFile(song)} />

      {/* Images shown in series with faster pacing */}
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
  const { fps } = useVideoConfig();
  // Shorter, more dynamic subtitles for TikTok attention spans
  const hardcodedSubtitles = [
    {
      text: props.title || 'Welcome!',
      startFrame: 0,
      endFrame: 5 * VIDEO_FPS, // First 5 seconds
    },
    {
      text: 'Check This Out!',
      startFrame: 5 * VIDEO_FPS + 1,
      endFrame: 10 * VIDEO_FPS, // Next 5 seconds
    },
    {
      text: 'Amazing Content',
      startFrame: 10 * VIDEO_FPS + 1,
      endFrame: 15 * VIDEO_FPS, // Next 5 seconds
    },
    {
      text: '🔥 Follow for More! 🔥',
      startFrame: 15 * VIDEO_FPS + 1,
      endFrame: 20 * VIDEO_FPS, // Last 5 seconds
    },
  ];

  return <InnerSlideshow images={props.images} song={props.song} subtitles={hardcodedSubtitles} />;
}; 