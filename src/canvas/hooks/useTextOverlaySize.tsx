import { useEffect, useRef, useState } from 'react';

interface UseTextOverlaySizeProps {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  maxWidth?: number;
  initialWidth?: number;
  initialHeight?: number;
}

export function useTextOverlaySize({
  text,
  fontFamily = 'Arial',
  fontSize = 16,
  fontWeight = 'normal',
  fontStyle = 'normal',
  maxWidth = 600,
  initialWidth,
  initialHeight,
}: UseTextOverlaySizeProps) {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({
    width: initialWidth ?? 200,
    height: initialHeight ?? 100,
  });

  useEffect(() => {
    if (!mirrorRef.current) return;

    mirrorRef.current.textContent = text?.replace(/\n$/, '\n.') || '.';
    const rect = mirrorRef.current.getBoundingClientRect();
    const hasNewline = text.includes('\n');

    setSize((prev) => ({
      width: hasNewline ? prev.width : Math.min(rect.width + 20, maxWidth),
      height: hasNewline ? rect.height + 20 : prev.height,
    }));
  }, [text, fontFamily, fontSize, fontWeight, fontStyle, maxWidth]);

  const Mirror = (
    <div
      ref={mirrorRef}
      style={{
        position: 'absolute',
        visibility: 'hidden',
        whiteSpace: 'pre',
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
        lineHeight: 1.0,
        padding: 0,
        margin: 0,
        maxWidth,
        overflowWrap: 'break-word',
      }}
    />
  );

  return { size, setSize, Mirror };
}
