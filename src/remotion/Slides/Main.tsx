import React from 'react';
import { z } from 'zod';
import { SlidesProps } from '../../types/slides';
import { SlidesEdit } from './Edit';

export const Main: React.FC<z.infer<typeof SlidesProps>> = (props) => {
  return <SlidesEdit {...props} />;
}; 