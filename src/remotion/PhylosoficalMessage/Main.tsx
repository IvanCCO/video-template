import React from 'react';
import { z } from 'zod';
import { PhylosoficalEdit } from './PhylosoficalEdit';
import { SlideshowProps } from '../../types/slideshowTypes';

export const Main: React.FC<z.infer<typeof SlideshowProps>> = (props) => {
  return <PhylosoficalEdit {...props} />;
}; 