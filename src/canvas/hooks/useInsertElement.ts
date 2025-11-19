import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { ELEMENT_LIBRARY } from '@/lib/elements';
import { ElementItem, shapeType } from '@/src/types/template';
import { tone, toneColorMap } from '@/src/types/tone';
import { DesignElement } from '@/src/types/DesignElement';

import { useInsertElementFromDesign } from './insertElementFromDesign';
import { useCanvasStore } from '../store/createCanvasStore';
import { getToneDefaults } from '@/src/utils/getToneDefaults';

type InsertOptions = {
  tone: tone | null
  x?: number;
  y?: number;
  role?: string; // ✅ Add this line
  shapeType?: string; // (optional) if you want to support shapeType too
  toneColor?: string; // ✅ new field
  font?: string; // ✅ new field
  fonstSize?:number
  textWidth?:number;
  textHeight?:number;
  isUnderline?:boolean;
  isMultiline?:boolean;
  textAlign?: 'left' | 'center' | 'right';
};

export function useInsertElement() {
  const { insertElementFromDesign } = useInsertElementFromDesign();
  const tone = useCanvasStore((s) => s.tone);

  const insertShape = useCallback((shape: string, options?: InsertOptions) => {
    const preset = ELEMENT_LIBRARY.find(
      (el) => el.type === 'shape' && el.shapeType === shape
    );

    const { fill, size } = getToneDefaults(tone);

    const element: DesignElement = {
      id: uuid(),
      type: 'shape',
      shapeType: shape as shapeType,
      label: preset?.label ?? shape,
      x: options?.x ?? preset?.x ?? 200,
      y: options?.y ?? preset?.y ?? 200,
      width: preset?.width ?? 100,
      height: preset?.height ?? 100,
      fill,
      stroke: '#1e293b',
      strokeWidth: 1
    };

    insertElementFromDesign(element);
  }, [insertElementFromDesign, tone]);

  const insertImage = useCallback((src: string, options?: InsertOptions) => {
    const element: DesignElement = {
      id: uuid(),
      type: 'image',
      src,
      label: 'Image',
      x: options?.x ?? 200,
      y: options?.y ?? 200,
      width: 240,
      height: 180,
      shapeType: 'image'
    };

    insertElementFromDesign(element);
  }, [insertElementFromDesign]);

  const insertText = useCallback((label: string, options?: InsertOptions) => {
    const { fill, size } = getToneDefaults(tone);
  
    const element: DesignElement = {
      id: uuid(),
      type: 'text',
      label,
      text: label,
      x: options?.x ?? 200,
      y: options?.y ?? 200,
      width: 200,
      height: 60,
      textWidth:options?.textWidth ?? 200,
      textHeight:options?.textHeight ?? 200,
      fontSize:options?.fonstSize ?? 24,
      font: options?.font || '--font-inter',
      fill: options?.toneColor ?? fill,
      isBold: false,
      isItalic: false,
      shapeType: 'text'
    };
  
    insertElementFromDesign(element);
  }, [insertElementFromDesign, tone]);
  


  const insertSticker = useCallback((el: ElementItem, options?: InsertOptions) => {
    const { font, size } = getToneDefaults(options?.tone ?? 'primary');
  
    const element: DesignElement = {
      id: uuid(),
      type: 'text',
      label: el.emoji,
      font,
      fontSize: size.width * 0.9,
      fill: '#000',
      x: options?.x ?? 180,
      y: options?.y ?? 180,
      width: size.width,
      height: size.height,
      isBold: false,
      isItalic: false,
      shapeType: 'text',
      role: el.role ?? 'symbol'
    };
  
    insertElementFromDesign(element);
  }, [insertElementFromDesign]);
  



  const insertIcon = useCallback((el: ElementItem, options?: InsertOptions) => {
    const { fill, font, size } = getToneDefaults(options?.tone ?? 'primary');
  

    
    const element: DesignElement = {
      id: uuid(),
      type: 'text',
      label: el.emoji,
      font,
      fontSize: size.width * 0.8,
      fill,
      x: options?.x ?? 200,
      y: options?.y ?? 200,
      width: size.width,
      height: size.height,
      isBold: false,
      isItalic: false,
      shapeType: 'text',
      role: el.role ?? 'symbol'
    };
  
    insertElementFromDesign(element);
  }, [insertElementFromDesign]);



  const insertFrame = useCallback((frameType: shapeType, options?: InsertOptions) => {
    const { fill, size } = getToneDefaults(options?.tone ?? tone);
  
    const element: DesignElement = {
      id: uuid(),
      type: 'shape',
      shapeType: frameType, // e.g. 'frame-basic', 'frame-dashed', 'frame-rounded'
      label: 'Frame',
      x: options?.x ?? 100,
      y: options?.y ?? 100,
      width: size.width,
      height: size.height,
      fill: 'transparent',
      stroke: '#1e293b',
      strokeWidth: 2,
      role: 'accent'
    };
  
    insertElementFromDesign(element);
  }, [insertElementFromDesign, tone]);
  
  
  

  return { insertShape, insertImage, insertText, insertIcon, insertSticker, insertFrame };
}
