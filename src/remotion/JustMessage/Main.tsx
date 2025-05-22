import React from 'react';
import { z } from 'zod';
import { JustMessageEdit } from './Edit';
import { JustMessageProps } from '../../types/justMessage';

export const Main: React.FC<z.infer<typeof JustMessageProps>> = (props) => {
  return <JustMessageEdit {...props} />;
}; 