import { CanvasMode } from "./CanvasMode";

export  type shapeType = 'rectangle' | 'circle' | 'line' | 'regularPolygon' |'ring' |'star' |
                         'arrow'|'heart' | 'heading' |'body'|'image' |'flower' |'text' | 'frame_basic' | 'frame_dashed' | 'frame_rounded';


export type TemplateElementType='shape' | 'icon' | 'sticker' | 'frame' | 'text' | 'image';


export type ElementItem = {
  id: string;
  label: string;
  category: string;
  preview: React.ReactNode;
  role?:'symbol' | 'message' | 'container';
  emoji?:string;
  type?:shapeType
};


export type TemplateElement =
  | {
      type: 'image';
      id: string;
      label?: string;
      src: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      tone: string;
      shapeType?:shapeType;
      role?: 'decoration' | 'logo' | 'background' | 'motif' | 'inside-decoration';
    }
  | {
      type: 'text';
      id: string;
      label: string;
      shapeType: shapeType;
      text: string;
      textWidth?: number;
      textAlign?: 'left' | 'center' | 'right';
      lineHeight?: number;
      textHeight?: number;
      font: string;
      size: number;
      color: string;
      isBold?: boolean;
      isItalic?: boolean;
      position: { x: number; y: number };
      tone: string;
      role?: 'frame' | 'divider' | 'accent' | 'inside-frame' | 'symbol' | 'message' | 'container';
    }
  | {
      type: 'shape';
      id: string;
      label: string;
      shapeType: shapeType;
      position: { x: number; y: number };
      size: { width: number; height: number };
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      tone: string;
    
      role?: 'frame' | 'divider' | 'accent' | 'inside-frame';
    }
  | {
      type: 'icon';
      id: string;
      label: string;
      emoji: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      tone: string;
      shapeType?:shapeType;
      role?: 'symbol' | 'motif' | 'inside-icon';
    }
  | {
      type: 'sticker';
      id: string;
      label: string;
      emoji: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      tone: string;
      shapeType?:shapeType;
      role?: 'celebration' | 'seasonal' | 'inside-sticker';
    }
  | {
      type: 'frame';
      id: string;
      label: string;
      shapeType?: shapeType;
      position: { x: number; y: number };
      size: { width: number; height: number };
      stroke?: string;
      strokeWidth?: number;
      tone: string;
   
      role?: 'border' | 'container' | 'inside-frame';
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
        cellSize?: number;
      };
      elements: TemplateElement[];
    }
    


    export interface DualTemplate {
      id: string;
      name: string;
      author: string;
      tone: string;
      size: string;
      sizeLabel: string;
      width: number;
      height: number;
      thumbnailUrl: string;
      subtype?: string; // ✅ Add this optional subtype for expressive subcategorization
      faces: ['front', 'back', 'insideFront', 'insideBack'];
    
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

// Individual Face Page within a Template


    export interface FacePage {
      id: string; // e.g. 'front', 'back', 'insideFront'
      label: string; // e.g. 'Front', 'Back', 'Inside Left'
      card: Template['card'];
      elements: TemplateElement[];
      role?: 'front' | 'back' | 'inside' | 'folded' | 'panel';
    }

    // Full Template Document with Metadata and Pages

    export interface TemplateDocument {
      id: string;
      name: string;
      author: string;
      tone: string;
      size: string;
      sizeLabel: string;
      width: number;
      height: number;
      thumbnailUrl: string;
      type?: string;
      subtype?: string; // ✅ New: optional subtype for expressive subcategorization
      theme?: string;
      tokens?: DualTemplate['tokens'];
      previewMode?: DualTemplate['previewMode'];
      meta?: DualTemplate['meta'];
      pages: FacePage[];
    }


    export type TemplateKind = 'dual' | 'document';
    export type UnifiedTemplate = {
      kind: TemplateKind;
      dual?: DualTemplate;
      document?: TemplateDocument;
    };


    export interface TemplateFace {
      card: {
        width: number;
        height: number;
        background: string;
        backgroundImage?: string;
        gridColors?: string[];
        cellSize?: number;
      };
      elements: TemplateElement[];
    }
    

    // Type Guards    
    
    




    export function isTextElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'text' }> {
      return el.type === 'text';
    }
    
    export function isShapeElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'shape' }> {
      return el.type === 'shape';
    }
    
    export function isImageElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'image' }> {
      return el.type === 'image';
    }


    // Primitive Text: role === 'message'
export function isPrimitiveTextElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'text' }> {
  return el.type === 'text' && el.role === 'message';
}


// Primitive Shape: role === 'accent' or shapeType is defined
export function isPrimitiveShapeElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'shape' }> {
  return el.type === 'shape' && el.role === 'accent' && !!el.shapeType;
}

// Primitive Image: role === 'decoration' or src is defined
export function isPrimitiveImageElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'image' }> {
  return el.type === 'image' && el.role === 'decoration' && !!el.src;
}

// Legacy Text: anything else
export function isLegacyTextElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'text' }> {
  return el.type === 'text' && el.role !== 'message';
}


export function isStyledTextPrimitive(
  el: TemplateElement
): el is Extract<TemplateElement, { type: 'text' }> {
  return (
    el.type === 'text' &&
    el.role === 'message' &&
    ['body text', 'heading', 'subheading', 'quote', 'label'].includes(el.label?.toLowerCase() ?? '')
  );
}



export function isTextElementForTextComponent(el: TemplateElement): el is Extract<TemplateElement, { type: 'text' }> {
  return (
    el.type === 'text' &&
    (isLegacyTextElement(el) || isStyledTextPrimitive(el) || (el as Extract<TemplateElement, { type: 'text' }>).role === 'symbol')
  );
}



export function getElementsByRole(page: FacePage, role: string): TemplateElement[] {
  return page.elements.filter(el => el.role === role);
}


export function getElementsByType(page: FacePage, type: string): TemplateElement[] {
  return page.elements.filter(el => el.type === type);
}


export function isIconElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'icon' }> {
  return el.type === 'icon';
}

export function isStickerElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'sticker' }> {
  return el.type === 'sticker';
}

export function isFrameElement(el: TemplateElement): el is Extract<TemplateElement, { type: 'frame' }> {
  return el.type === 'frame';
}



    





