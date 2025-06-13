import React from 'react';
import {
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
} from 'remotion';

export const InstagramCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Animation timing
  const swipeLeftDuration = 0.8 * fps; // 0.8 seconds for swipe left
  const clickDelay = 0.5 * fps; // 0.5 seconds before click
  const clickDuration = 0.3 * fps; // 0.3 seconds for click effect
  const exitDelay = 1.5 * fps; // 1.5 seconds before exit
  const exitDuration = 0.4 * fps; // 0.4 seconds for exit
  
  // Swipe left animation - card slides in from left
  const translateX = interpolate(
    frame,
    [0, swipeLeftDuration],
    [-300, 0],
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
    [0, swipeLeftDuration * 0.5, exitDelay, exitDelay + exitDuration * 0.3],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Icon bounce effect
  const iconBounce = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.95, 1.05],
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
          src={staticFile('audio/whoosh.wav')}
          startFrom={0}
          volume={0.5}
        />
      )}
      
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: `translateX(-50%) translateX(${translateX}px) translateX(${exitTranslateX}px) scale(${clickScale})`,
          opacity,
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            border: '2px solid rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            minWidth: 140,
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
              background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)',
              transform: `translateX(${interpolate(
                frame,
                [clickDelay * 0.5, clickDelay * 0.5 + 30],
                [0, 300],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )}px)`,
            }}
          />
          
          {/* Instagram Icon */}
          <div
            style={{
              width: 48,
              height: 48,
              transform: `scale(${iconBounce})`,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Img
              src={staticFile('images/Instagram_icon.png.webp')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          
          {/* Instagram Handle */}
          <span
            style={{
              color: '#333',
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            @ivanfreiremm
          </span>
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
            fill="#333"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
            }}
          >
            <path d="M13.5 6.5c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zM10 10.5c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5zm4 0c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5zm-8 0c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5zm12 0c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5z"/>
          </svg>
        </div>
        
        {/* Floating hearts effect during click */}
        {frame >= clickDelay && frame <= clickDelay + clickDuration && (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '20%',
                  transform: `translateX(-50%) translateY(${interpolate(
                    frame - clickDelay,
                    [0, clickDuration],
                    [0, -60 - i * 10],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )}px) translateX(${Math.sin((frame - clickDelay) * 0.1 + i) * 20}px)`,
                  opacity: interpolate(
                    frame - clickDelay,
                    [0, clickDuration * 0.3, clickDuration],
                    [0, 1, 0],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  ),
                  fontSize: 16 + i * 2,
                  color: '#E91E63',
                  pointerEvents: 'none',
                }}
              >
                ❤️
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}; 