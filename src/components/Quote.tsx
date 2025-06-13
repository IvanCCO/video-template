import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

// Define the props for our quote text
interface QuoteProps {
  text: string;
  author?: string;
  opacityFrames?: number;
}

// Quote component with serif font
export const Quote: React.FC<QuoteProps> = ({ text, author, opacityFrames = 100 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Animation for the quote - fade in at start, stay visible until the end
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