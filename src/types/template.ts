export type TemplateElement =
  | {
      type: 'image';
      id: string;
      src: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      tone: string;
      role?: 'decoration' | 'logo' | 'background' | 'motif' | 'inside-decoration';
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
      role?: 'greeting' | 'title' | 'message' | 'inside-message' | 'caption';
    };




export interface Template {
  id: string;
  tone: string;
  card: {
    width: number;
    height: number;
    background: string;
    backgroundImage?: string;
    gridColors?: string[];
  };
  elements: TemplateElement[];
}


export interface DualTemplate {
  id: string;
  name: string;
  author: string;
  tone: string;
  size: number;
  sizeLabel: string;
  width: number;
  height: number;
  thumbnailUrl: string;

  // 🆕 Classification
  type?: 'gift-card' | 'business-card' | 'seasonal' | 'enterprise';
  theme?: 'christmas' | 'new_year' | 'valentine' | 'generic';

  // 🆕 Styling Tokens
  tokens?: {
    borderStyle?: 'ornate' | 'minimal' | 'dashed';
    fontFamily?: string;
    accentColor?: string;
  };

  // 🆕 Preview Mode
  previewMode?: 'wrapped' | 'flat' | 'printable';

  // 🆕 Audit Metadata & Expressive Payload
  meta?: {
    createdBy?: string;
    lastEditedBy?: string;
    approvedBy?: string;
    locked?: boolean;

    // 💌 Emotional Payload
    insideMessage?: string;
    sticker?: string;
    motifType?: string;
    gradientStyle?: string;
  };

  // 🧩 Faces
  front?: {
    card: {
      width: number;
      height: number;
      background: string;
      backgroundImage?: string;
      gridColors?: string[];
      cellSize?: number;
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
      cellSize?: number;
    };
    elements: TemplateElement[];
  };

  inside?: {
    card: {
      width: number;
      height: number;
      background: string;
      backgroundImage?: string;
      gridColors?: string[];
      cellSize?: number;
    };
    elements: TemplateElement[];
  };
}




export function isTextElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'text' }> {
  return el.type === 'text';
}




