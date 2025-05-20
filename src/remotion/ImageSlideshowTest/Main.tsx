import React from 'react';
import { z } from 'zod';
import { Slideshow } from './Slideshow';
import { SlideshowProps } from '../../types/slideshowTypes';

export const Main: React.FC<z.infer<typeof SlideshowProps>> = (props) => {
  return <Slideshow {...props} />;
}; 