// utils/computeDynamicBackground.ts

import { computeAverageColor } from './colorUtils';
import { DualTemplate } from '../types/template';
import { color } from 'framer-motion';

export default function getDynamicBackgroundFromTemplate(template: DualTemplate | null, side: 'front' | 'back'): string | null {
  const face = template?.[side];
  const gridColors = face?.card?.gridColors;



  if (!gridColors || gridColors.length === 0) {
    console.warn('🛑 No gridColors found for', side, gridColors);
    return null;
  }

  let colors=computeAverageColor(gridColors);

  console.log('average colors computed', colors);
  return colors;
}
