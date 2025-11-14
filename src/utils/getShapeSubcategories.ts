// src/components/elements/getShapeSubcategories.ts
import { shapeType } from '@/src/types/template';

export const getShapeSubcategory = (shape: shapeType): string => {
  switch (shape) {
    case 'line':
    case 'arrow':
      return 'lines';
    case 'star':
    case 'regularPolygon':
      return 'stars';
    case 'heart':
      return 'hearts';
    case 'flower':
      return 'flowers';
    case 'ring':
    case 'circle':
    case 'rectangle':
      return 'basic';
    default:
      return 'misc';
  }
};
