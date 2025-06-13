import React from 'react';
import {
  AbsoluteFill,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

interface VideoWithLayersProps {
  src: string;
  opacityFrames?: number;
  transitionType?: 'zoom' | 'shake' | 'rotate' | 'scale' | 'strobe';
}

// Video component with dynamic transitions and TikTok-optimized effects
export const VideoWithLayers: React.FC<VideoWithLayersProps> = ({ 
  src, 
  opacityFrames = 30,
  transitionType = 'zoom'
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Fast fade in/out for TikTok pacing (1-3 seconds max)
  const opacity = interpolate(
    frame,
    [0, opacityFrames, durationInFrames - opacityFrames, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Dynamic zoom effect - constant motion for engagement
  const zoom = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.15],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Shake effect for high-energy transitions
  const shakeX = transitionType === 'shake' ? 
    Math.sin(frame * 0.5) * 3 * (frame < durationInFrames * 0.2 ? 1 : 0) : 0;
  const shakeY = transitionType === 'shake' ? 
    Math.cos(frame * 0.7) * 2 * (frame < durationInFrames * 0.2 ? 1 : 0) : 0;

  // Rotation for visual interest
  const rotation = transitionType === 'rotate' ? interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  ) : 0;

  // Spring scale animation for dynamic entry
  const springScale = spring({
    frame,
    fps,
    config: {
      mass: 0.5,
      damping: 12,
      stiffness: 150,
    },
    durationInFrames: Math.min(fps, durationInFrames),
  });

  const scale = transitionType === 'scale' ? springScale : 1;

  // Strobe effect for beat sync (simulated)
  const strobeOpacity = transitionType === 'strobe' && frame % 6 < 3 ? 0.8 : 1;

  // Dynamic lighting effect
  const lightingIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.9, 1.1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ opacity: opacity * strobeOpacity }}>
      {/* Background layer with enhanced effects */}
      <AbsoluteFill>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}>
          <Video
            src={src.startsWith('http') ? src : staticFile(src)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${zoom * scale}) rotate(${rotation}deg)`,
              // Enhanced saturation and contrast for TikTok appeal
              filter: `saturate(1.4) contrast(1.2) brightness(${lightingIntensity}) hue-rotate(${frame * 0.1}deg)`,
            }}
            muted
          />
          
          {/* Dynamic vignette effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle, transparent 20%, rgba(0,0,0,${0.3 + Math.sin(frame * 0.05) * 0.2}) 100%)`,
              pointerEvents: 'none',
            }}
          />
          
          {/* Color overlay for warm tones */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(45deg, rgba(255,100,50,${0.1 + Math.sin(frame * 0.08) * 0.05}), rgba(255,150,100,${0.05}))`,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}; 