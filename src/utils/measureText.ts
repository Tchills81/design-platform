import { DualTemplate } from "@/src/types/template";

export function measureText({
    text,
    fontSize,
    fontFamily = 'Arial',
    fontWeight = 'normal',
    fontStyle = 'normal',
    lineHeight = 1,
    template,
    canvas,
  }: {
    text: string;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    lineHeight?: number;
    template: DualTemplate | null;
    canvas: HTMLCanvasElement;
  }) {
    const ctx = canvas.getContext('2d');
    if (!ctx || !template) return { width: 0, height: 0, measuredWidth: 0 };
  
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    const lineHeightPx = fontSize * lineHeight;
    const maxWidth = template.width - 72;
  
    const lines = text.split('\n');
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
  
      visualLineCount++;
    }
  
    const padding = 5;
    const width = Math.min(Math.ceil(widestLine + padding), maxWidth);
    const height = visualLineCount * lineHeightPx + 10;
  
    return { width, height, measuredWidth: widestLine };
  }
  