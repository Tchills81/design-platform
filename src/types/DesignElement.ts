export type ElementType = 'text' | 'shape' | 'image';
import { shapeType } from '@/src/types/template';

export interface DesignElement {
  id: string;
  type: ElementType;
  label?: string;
  x: number;
  y: number;

  // Shared dimensions
  width?: number;
  height?: number;

  // Text-specific
  fontSize?: number;

  // Visual styling
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  font?:string;
  isBold?:boolean;
  isItalic?:boolean;

  // Image-specific
  src?: string;

  // Shape-specific
  shapeType: shapeType;
}
