import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

interface KineticTextProps {
  text: string;
  animationType?: 'bounce' | 'slide' | 'zoom' | 'typewriter' | 'shake';
  color?: string;
  fontSize?: number;
  position?: 'top' | 'center' | 'bottom';
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  animationType = 'bounce',
  color = 'white',
  fontSize = 32,
  position = 'bottom'
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Fast entrance animation (0.5 seconds)
  const entranceFrames = fps * 0.5;
  
  // Bounce animation with spring
  const bounceScale = spring({
    frame,
    fps,
    config: {
      mass: 0.3,
      damping: 8,
      stiffness: 200,
    },
    durationInFrames: entranceFrames,
  });

  // Slide animation
  const slideY = animationType === 'slide' ? interpolate(
    frame,
    [0, entranceFrames],
    [100, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  ) : 0;

  // Zoom animation
  const zoomScale = animationType === 'zoom' ? interpolate(
    frame,
    [0, entranceFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  ) : 1;

  // Typewriter effect
  const typewriterProgress = animationType === 'typewriter' ? interpolate(
    frame,
    [0, entranceFrames * 2],
    [0, text.length],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  ) : text.length;

  // Shake effect for emphasis
  const shakeX = animationType === 'shake' ? 
    Math.sin(frame * 0.8) * 2 * (frame > entranceFrames ? 1 : 0) : 0;
  const shakeY = animationType === 'shake' ? 
    Math.cos(frame * 1.2) * 1 * (frame > entranceFrames ? 1 : 0) : 0;

  // Pulsing effect for continuous engagement
  const pulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.95, 1.05],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Opacity for entrance
  const opacity = interpolate(
    frame,
    [0, entranceFrames * 0.3],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Position calculations
  const getPosition = () => {
    switch (position) {
      case 'top':
        return { top: 120 };
      case 'center':
        return { top: '50%', transform: 'translateY(-50%)' };
      case 'bottom':
      default:
        return { bottom: 120 };
    }
  };

  const displayText = animationType === 'typewriter' 
    ? text.substring(0, Math.floor(typewriterProgress))
    : text;

  const finalScale = animationType === 'bounce' ? bounceScale : 
                    animationType === 'zoom' ? zoomScale : 1;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          width: '90%',
          textAlign: 'center',
          transform: `translateX(-50%) translate(${shakeX}px, ${slideY + shakeY}px) scale(${finalScale * pulse})`,
          opacity,
          ...getPosition(),
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px 30px',
            borderRadius: 15,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div
            style={{
              color,
              fontFamily: 'Arial, sans-serif',
              fontSize,
              fontWeight: 'bold',
              lineHeight: 1.3,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              letterSpacing: '0.5px',
              // Add text stroke for better visibility
              WebkitTextStroke: '1px rgba(0, 0, 0, 0.5)',
            }}
          >
            {displayText}
            {animationType === 'typewriter' && frame < entranceFrames * 2 && (
              <span style={{ opacity: Math.sin(frame * 0.5) > 0 ? 1 : 0 }}>|</span>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}; 