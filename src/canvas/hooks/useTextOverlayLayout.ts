import Konva from 'konva';
import { RefObject, useCallback } from 'react';
import { DualTemplate } from '../../types/template';

export const useTextOverlayLayout = ({
  fontFamily,
  fontSize,
  fontWeight,
  fontStyle,
  lineHeight,
  canvasRef,
  konvaText,
  template,
  isMultiline,
  setSize,
}: {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  lineHeight: number;
  canvasRef: RefObject<HTMLCanvasElement>;
  konvaText: Konva.Text | null;
  template: DualTemplate;
  isMultiline: boolean;
  setSize: (size: { width: number; height: number }) => void;
}) => {
  const singleLineHeight = fontSize * lineHeight;

  const measureLongestLine = useCallback((text: string): number => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return template.width;
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    return Math.max(...text.split('\n').map(line => ctx.measureText(line).width));
  }, [canvasRef, fontFamily, fontSize, fontWeight, fontStyle, template.width]);

  const syncText = useCallback((text: string) => {
    const longestLineWidth = measureLongestLine(text);
    const width = Math.min(longestLineWidth + 20, template.width - 72);
    const lineCount = text.split('\n').length;
    const height = lineCount * singleLineHeight;

    console.log(`🧮 Line count: ${lineCount}, Height: ${height}px`);

    setSize({ width, height });

    if (konvaText) {
      konvaText.text(text);
      konvaText.width(width);
      konvaText.height(height);
      konvaText.lineHeight(isMultiline ? lineHeight : undefined);
      konvaText.wrap('none');
      konvaText.getLayer()?.batchDraw();
    }
  }, [measureLongestLine, konvaText, isMultiline, lineHeight, setSize, singleLineHeight, template.width]);

  return { syncText, singleLineHeight };
};
