import React from 'react';
import {
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

export const SubscribeButton: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Animation timing
  const swipeUpDuration = 0.8 * fps; // 0.8 seconds for swipe up
  const clickDelay = 0.5 * fps; // 0.5 seconds before click
  const clickDuration = 0.3 * fps; // 0.3 seconds for click effect
  const exitDelay = 1.5 * fps; // 1.5 seconds before exit
  const exitDuration = 0.4 * fps; // 0.4 seconds for exit
  
  // Swipe up animation - button slides up from bottom
  const translateY = interpolate(
    frame,
    [0, swipeUpDuration],
    [200, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // Ease out cubic
    }
  );
  
  // Click effect - scale animation
  const clickScale = interpolate(
    frame,
    [
      clickDelay,
      clickDelay + clickDuration * 0.3,
      clickDelay + clickDuration * 0.7,
      clickDelay + clickDuration
    ],
    [1, 0.95, 1.05, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // Ease in-out quad
    }
  );
  
  // Exit animation - whoosh out to the right
  const exitTranslateX = interpolate(
    frame,
    [exitDelay, exitDelay + exitDuration],
    [0, 800],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => t * t * t, // Ease in cubic for fast exit
    }
  );
  
  // Opacity for smooth entrance and exit
  const opacity = interpolate(
    frame,
    [0, swipeUpDuration * 0.5, exitDelay, exitDelay + exitDuration * 0.3],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <>
      {/* Whoosh sound effect when exiting */}
      {frame >= exitDelay && (
        <Audio
          src={staticFile('whoosh.mp3')}
          startFrom={0}
          volume={0.5}
        />
      )}
      
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: `translateX(-50%) translateY(${translateY}px) translateX(${exitTranslateX}px) scale(${clickScale})`,
          opacity,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #FF3333 0%, #FF1111 100%)',
            borderRadius: 50,
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 8px 32px rgba(255, 51, 51, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Shine effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: -100,
              width: 100,
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              transform: `translateX(${interpolate(
                frame,
                [clickDelay * 0.5, clickDelay * 0.5 + 30],
                [0, 300],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )}px)`,
            }}
          />
          
          {/* Subscribe text */}
          <span
            style={{
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '1px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            SUBSCRIBE
          </span>
          
          {/* Bell icon */}
          <div
            style={{
              width: 28,
              height: 28,
              position: 'relative',
            }}
          >
            {/* Bell SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="white"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              }}
            >
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </div>
        </div>
        
        {/* Hand cursor icon */}
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: -10,
            transform: `scale(${interpolate(
              frame,
              [clickDelay, clickDelay + clickDuration],
              [1, 1.2],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )})`,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="white"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))',
            }}
          >
            <path d="M13.5 6.5c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zM10 10.5c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5zm4 0c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5zm-8 0c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5zm12 0c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5z"/>
          </svg>
        </div>
      </div>
    </>
  );
}; 