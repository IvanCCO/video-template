import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { z } from 'zod';
import { VIDEO_FPS } from '../../types/constants';
import { SLIDES_DURATION_IN_FRAMES, SlidesProps } from '../../types/slides';
import { InstagramCTA, VideoWithLayers, TypewriterText, SubscribeButton } from '../../components';

// Transition types for variety
const TRANSITION_TYPES: Array<'zoom' | 'shake' | 'rotate' | 'scale' | 'strobe'> =
  ['zoom', 'shake', 'rotate', 'scale', 'strobe'];

// Slide component that shows a video with typewriter text overlay
interface SlideProps {
  video: string;
  text: string;
  slideIndex: number;
  durationPerVideoSeconds: number;
}

const Slide: React.FC<SlideProps> = ({ video, text, slideIndex, durationPerVideoSeconds }) => {
  const frame = useCurrentFrame();
  const slideFrames = durationPerVideoSeconds * VIDEO_FPS;

  // Dynamic opacity frames based on video duration (faster for shorter videos)
  const opacityFrames = Math.min(12, Math.max(6, slideFrames * 0.1)); // 10% of slide duration, min 6 frames, max 12 frames

  // Vary transitions to maintain engagement - predictable pattern with variation
  const transitionType = TRANSITION_TYPES[slideIndex % TRANSITION_TYPES.length];

  // Break rhythm every 3rd slide for attention reset
  const isRhythmBreaker = slideIndex % 3 === 2;
  const effectiveTransition = isRhythmBreaker ? 'scale' : transitionType;

  // Calculate typing speed based on video duration and text length
  const typingSpeed = Math.max(4, Math.min(12, text.length / (durationPerVideoSeconds * 0.8))); // Use 80% of video duration for typing

  return (
    <AbsoluteFill>
      {/* Background video with dynamic effects */}
      <VideoWithLayers
        src={video}
        opacityFrames={opacityFrames}
        transitionType={effectiveTransition}
      />

      {/* Typewriter text overlay synced to video */}
      <TypewriterText
        text={text}
        fontSize={isRhythmBreaker ? 36 : 32} // Larger text for rhythm breakers
        position="bottom"
        typingSpeed={typingSpeed}
        baseColor={isRhythmBreaker ? '#FF6B6B' : 'white'} // Warm color for emphasis
      />

      {/* Dynamic arrow cue for interaction (appears after text is fully typed) */}
      {frame > slideFrames * 0.8 && frame < slideFrames * 0.95 && (
        <div
          style={{
            position: 'absolute',
            right: 30,
            top: '50%',
            transform: `translateY(-50%) scale(${1 + Math.sin(frame * 0.3) * 0.1})`,
            fontSize: 40,
            color: '#FF6B6B',
            textShadow: '0 0 10px rgba(255, 107, 107, 0.8)',
            animation: 'bounce 0.5s infinite alternate',
          }}
        >
          →
        </div>
      )}
    </AbsoluteFill>
  );
};

// Props for our inner Slideshow component
interface InternalSlidesProps {
  images: string[];
  texts: string[];
  song: string;
}

const InnerSlides: React.FC<InternalSlidesProps> = ({ images, texts, song }) => {
  const slideCount = images.length;
  const instagramCTAFrames = 3 * VIDEO_FPS; // 3 seconds for Instagram CTA
  const totalFrames = SLIDES_DURATION_IN_FRAMES;
  
  // Calculate duration per video (5 seconds as specified)
  const durationPerVideoSeconds = 5;
  const slideFrames = durationPerVideoSeconds * VIDEO_FPS; // 5 seconds * 30 FPS = 150 frames per slide
  const contentFrames = slideCount * slideFrames; // Total frames for all video content

  // Dynamic transition frames based on video duration
  const transitionFrames = Math.min(6, Math.max(3, slideFrames * 0.1)); // 10% of slide duration for overlap

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background music with higher volume for engagement */}
      <Audio
        src={song.startsWith('http') ? song : staticFile(song)}
        endAt={totalFrames}
        volume={0.8} // Increased volume for TikTok appeal
      />

      <Sequence
        from={contentFrames + instagramCTAFrames}
        durationInFrames={instagramCTAFrames}
      >
        <SubscribeButton />
      </Sequence>

      {/* Video slides with overlapping transitions */}
      {images.map((video, index) => {
        const startFrame = index * slideFrames;
        const duration = slideFrames +
          (index < images.length - 1 ? transitionFrames : 0);

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={duration}
          >
            <Slide
              video={video}
              text={texts[index]}
              slideIndex={index}
              durationPerVideoSeconds={durationPerVideoSeconds}
            />
          </Sequence>
        );
      })}

      {/* Instagram CTA with enhanced animation */}
      <Sequence
        from={contentFrames}
        durationInFrames={instagramCTAFrames}
      >
        <InstagramCTA />
      </Sequence>


      {/* Beat-synced flash effects (simulated) - frequency based on total duration */}
      {Array.from({ length: Math.floor(totalFrames / (VIDEO_FPS * 0.5)) }, (_, i) => (
        <Sequence
          key={`flash-${i}`}
          from={i * VIDEO_FPS * 0.5}
          durationInFrames={2}
        >
          <AbsoluteFill
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Main Slides component that accepts props defined in slides.ts
export const SlidesEdit: React.FC<z.infer<typeof SlidesProps>> = (props) => {

  console.log(props);
  return <InnerSlides images={props.images} texts={props.texts} song={props.song} />;
}; 