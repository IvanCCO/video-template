import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

interface TypewriterTextProps {
  text: string;
  fontSize?: number;
  position?: 'top' | 'center' | 'bottom';
  typingSpeed?: number; // Characters per second
  baseColor?: string;
}

// Array of vibrant colors for random selection
const VIBRANT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  fontSize = 32,
  position = 'bottom',
  typingSpeed = 8, // 8 characters per second
  baseColor = 'white'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate how many characters should be visible
  const framesPerCharacter = fps / typingSpeed;
  const visibleCharCount = Math.floor(frame / framesPerCharacter);
  
  // Split text into characters
  const characters = text.split('');
  
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

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          width: '90%',
          textAlign: 'center',
          transform: 'translateX(-50%)',
          ...getPosition(),
        }}
      >
        <div
          style={{
            padding: '20px 30px',
            borderRadius: 15,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            display: 'inline-block',
            minHeight: fontSize * 1.5,
          }}
        >
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              lineHeight: 1.3,
              letterSpacing: '0.5px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {characters.map((char, index) => {
              const isVisible = index < visibleCharCount;
              const isCurrentlyTyping = index === visibleCharCount - 1;
              const charFrame = frame - (index * framesPerCharacter);
              
              if (!isVisible) return null;

              // Random color for each character (consistent per character)
              const colorIndex = (char.charCodeAt(0) + index) % VIBRANT_COLORS.length;
              const charColor = VIBRANT_COLORS[colorIndex];
              
              // Spring animation for character entrance
              const charScale = spring({
                frame: charFrame,
                fps,
                config: {
                  mass: 0.2,
                  damping: 10,
                  stiffness: 200,
                },
                durationInFrames: framesPerCharacter,
              });

              // Bounce effect for currently typing character
              const typingBounce = isCurrentlyTyping ? interpolate(
                Math.sin(charFrame * 0.8),
                [-1, 1],
                [0.9, 1.3],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }
              ) : 1;

              // Random motion for each character
              const motionX = Math.sin(charFrame * 0.1 + index) * 2;
              const motionY = Math.cos(charFrame * 0.15 + index) * 1;

              // Size variation - currently typing character is bigger
              const sizeMultiplier = isCurrentlyTyping ? 1.4 : 1;
              
              // Glow effect for currently typing character
              const glowIntensity = isCurrentlyTyping ? 
                interpolate(Math.sin(charFrame * 0.5), [-1, 1], [0.5, 1]) : 0;

              return (
                <span
                  key={index}
                  style={{
                    color: isCurrentlyTyping ? charColor : baseColor,
                    fontSize: fontSize * sizeMultiplier,
                    transform: `translate(${motionX}px, ${motionY}px) scale(${charScale * typingBounce})`,
                    textShadow: `
                      0 2px 8px rgba(0, 0, 0, 0.9),
                      0 0 ${glowIntensity * 20}px ${charColor}
                    `,
                    WebkitTextStroke: isCurrentlyTyping ? `1px ${charColor}` : '1px rgba(0, 0, 0, 0.5)',
                    display: 'inline-block',
                    transition: 'all 0.1s ease-out',
                    filter: isCurrentlyTyping ? `drop-shadow(0 0 ${glowIntensity * 10}px ${charColor})` : 'none',
                    animation: isCurrentlyTyping ? 'pulse 0.2s infinite alternate' : 'none',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
            
            {/* Blinking cursor */}
            {visibleCharCount < characters.length && (
              <span
                style={{
                  color: '#FF6B6B',
                  fontSize: fontSize * 1.2,
                  opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0.3,
                  textShadow: '0 0 10px #FF6B6B',
                  marginLeft: '2px',
                }}
              >
                |
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Add CSS keyframes for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </AbsoluteFill>
  );
}; 