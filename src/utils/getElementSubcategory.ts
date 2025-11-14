// src/components/elements/getElementSubcategory.ts
import { shapeType, TemplateElementType } from '@/src/types/template';

export function getElementSubcategory(type: TemplateElementType, shape?: shapeType): string {
  if (type === 'shape') {
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
  }

  if (type === 'icon') {
    return 'symbols';
  }

  if (type === 'sticker') {
    return 'stickers';
  }

  if (type === 'text') {
    return 'typography';
  }

  if (type === 'image') {
    return 'photos';
  }

  return 'misc';
}
