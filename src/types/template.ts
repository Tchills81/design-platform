export type TemplateElement =
  | {
      type: 'image';
      id: string;
      src: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      tone: string;
    }
  | {
      type: 'text';
      id: string;
      label: string;
      position: { x: number; y: number };
      font: string;
      size: number;
      color: string;
      isBold?: boolean;
      isItalic?: boolean;
      tone: string;
      text: string;
    };


export interface Template {
  id:string
  tone: string;
  card: {
    width: number;
    height: number;
    background: string;
    backgroundImage?: string; // ✅ Optional background image
    gridColors?: string[]; // ✅ Add this line
  };
  elements: TemplateElement[];
}


export interface DualTemplate {
  id: string;
  tone: string;
  name:string;
  author:string;
  thumbnailUrl:string,
  front?: {
    card: {
      width: number;
      height: number;
      background: string;
      backgroundImage?: string;
      gridColors?: string[];
    };
    elements: TemplateElement[];
  };
  back?: {
    card: {
      width: number;
      height: number;
      background: string;
      backgroundImage?: string;
      gridColors?: string[];
    };
    elements: TemplateElement[];
  };
}


export function isTextElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'text' }> {
  return el.type === 'text';
}




