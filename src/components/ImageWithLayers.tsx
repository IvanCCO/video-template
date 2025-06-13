import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

interface ImageWithLayersProps {
  src: string;
  opacityFrames?: number;
}

// Image component with background and foreground layers
export const ImageWithLayers: React.FC<ImageWithLayersProps> = ({ src, opacityFrames = 100 }) => {
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
    [0, opacityFrames, durationInFrames - 30, durationInFrames],
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
              filter: `blur(${blurAmount}px) brightness(0.9) saturate(1.5)`, // Dynamic blur
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