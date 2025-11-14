import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';

interface UseFontDrivenOverlayProps {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: number;
  konvaText?: Konva.Text | null;
}

export function useFontDrivenOverlay({
  text,
  fontFamily = 'Arial',
  fontSize = 16,
  fontWeight = 'normal',
  fontStyle = 'normal',
  lineHeight = 1.4,
  konvaText,
}: UseFontDrivenOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ width: 200, height: 100 });

  const measure = (content: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 200, height: 100 };

    const ctx = canvas.getContext('2d');
    if (!ctx) return { width: 200, height: 100 };

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    const lines = content.split('\n');
    const lineHeightPx = fontSize * lineHeight;
    const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width));

    return {
      width: Math.min(maxWidth + 20, 600),
      height: lines.length * lineHeightPx + 10,
    };
  };

  const updateSize = (content: string) => {
    const { width, height } = measure(content);
    setSize({ width, height });

    if (konvaText) {
      konvaText.fontFamily(fontFamily);
      konvaText.fontSize(fontSize);
      konvaText.fontStyle(fontStyle);
      konvaText.fontVariant(fontWeight);
      konvaText.width(width);
      konvaText.height(height);
      konvaText.text(content);
      konvaText.getLayer()?.batchDraw();
    }
  };

  useEffect(() => {
    if (text) updateSize(text);
  }, [fontFamily, fontSize, fontWeight, fontStyle, lineHeight]);

  return { size, updateSize, canvasRef };
}
