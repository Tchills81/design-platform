import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { DualTemplate } from '@/src/types/template';

interface UseFontDrivenOverlayProps {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  overrideFontSize?: number; // ✅ new
  lineHeight?: number;
  konvaText?: Konva.Text | null;
  template?:DualTemplate | null;
}

export function useFontDrivenOverlay({
  text,
  fontFamily = 'Arial',
  fontSize = 16,
  overrideFontSize,
  fontWeight = 'normal',
  fontStyle = 'normal',
  lineHeight = 1,
  konvaText,
  template
  
}: UseFontDrivenOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ width: 200, height: 100 });

  const effectiveFontSize = overrideFontSize ?? fontSize;


  const measure = (content: string) => {

    if(!template) return size;

    const canvas = canvasRef.current;
    if (!canvas) return size;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return size;
  
    ctx.font = `${fontStyle} ${fontWeight} ${effectiveFontSize}px ${fontFamily}`;
    const lineHeightPx = effectiveFontSize * lineHeight;
    
    const maxWidth = template.width-72; // your width cap
  
    const lines = content.split('\n');
    let visualLineCount = 0;
    let widestLine = 0;
  
    for (const line of lines) {
      const words = line.split(' ');
      let currentLine = '';
  
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = ctx.measureText(testLine).width;
  
        if (testWidth > maxWidth) {
          visualLineCount++;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
  
        widestLine = Math.max(widestLine, testWidth);
      }
  
      visualLineCount++; // count final line
    }
  
    const padding = 5; // smaller, tunable
    const width = Math.min(Math.ceil(widestLine + padding), maxWidth);
    
    const height = visualLineCount * lineHeightPx + 10;


    //console.log('Measured lines:', visualLineCount, 'Height:', height);

  
    return { width, height, measuredWidth: widestLine };

  };
  
  
  

  const updateSize = (content: string) => {
    const newSize = measure(content);
    setSize(newSize);

    if (konvaText) {
      konvaText.fontFamily(fontFamily);
      konvaText.fontSize(effectiveFontSize);
      konvaText.fontStyle(fontStyle);
      konvaText.fontVariant(fontWeight);
      konvaText.width(newSize.width);
      konvaText.height(newSize.height);
      konvaText.text(content);
      konvaText.getLayer()?.batchDraw();
    }
  };

  // Update size on mount and when font/text props change
  useEffect(() => {
    updateSize(text);
  }, [text, fontFamily, fontSize, fontWeight, fontStyle, lineHeight]);

  return { size, updateSize, setSize, canvasRef, effectiveFontSize, measure };
}
