
import { shapeType, TemplateElementType } from '@/src/types/template';

export interface DesignElement {
  id: string;
  type: TemplateElementType
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
  rotation?:number,
  opacity?:number;
  visible?:boolean;
  locked?:boolean;
  name?:string;
  emoji?:string;
  text?:string;
  role?: 'frame' | 'divider' | 'accent' | 'inside-frame' | 'symbol' | 'message' | 'container';

  // Shape-specific
  shapeType: shapeType;
}
