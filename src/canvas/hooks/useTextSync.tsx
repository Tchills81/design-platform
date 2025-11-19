import Konva from "konva";

interface UseTextSyncProps {
    konvaText: Konva.Text | null;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    mirrorRef: React.RefObject<HTMLDivElement>;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    lineHeight: number;
    isMultiline: boolean;
    setSize: (size: { width: number; height: number }) => void;
  }
  
  export const useTextSync = ({
    konvaText,
    canvasRef,
    mirrorRef,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    lineHeight,
    isMultiline,
    setSize,
  }: UseTextSyncProps) => {
    const measureLongestLine = (text: string): number => {
      const canvas = canvasRef.current;
      if (!canvas) return 200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return 200;
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      const lines = text.split('\n');
      return Math.max(...lines.map(line => ctx.measureText(line).width));
    };
  
    const syncText = (text: string) => {
      const longestLineWidth = measureLongestLine(text);
      const trueHeight = mirrorRef.current?.scrollHeight ?? 100;
      const width = longestLineWidth + 20;
      const height = trueHeight;
  
      setSize({ width, height });
  
      if (konvaText) {
        konvaText.text(text);
        konvaText.width(width);
        konvaText.lineHeight(isMultiline ? lineHeight : undefined);
        konvaText.wrap(isMultiline ? 'word' : 'none');
        konvaText.height(height);
        konvaText.getLayer()?.batchDraw();
      }
    };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const value = e.currentTarget.value;
      const isTypingKey = e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter';
      if (isTypingKey) syncText(value);
    };
  
    return { handleKeyDown, syncText };
  };
  