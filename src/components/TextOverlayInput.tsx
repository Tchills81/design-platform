import React, { RefObject, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { tone } from '../types/tone';
import { useFontDrivenOverlay } from '../canvas/hooks/useFontDrivenOverlay';
import { DualTemplate } from '../types/template';

interface TextOverlayInputProps {
  inputPosition?: { x: number; y: number } | null | undefined;
  editingText?: string;
  onTextChange?: (val: string) => void;
  onTextBlur?: ((e: React.FocusEvent<HTMLTextAreaElement>) => void) | undefined;
  selectedFont?: string;
  selectedFontSize?: number;
  selectedColor?: string;
  isMultiline: boolean;
  isUnderline: boolean;
  isBold?: boolean;
  isItalic?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  tone: tone;
  zoom?: number;
  konvaText?: Konva.Text | null;
  toolbarRef: RefObject<HTMLDivElement | null>;
  textAreaRef: RefObject<HTMLTextAreaElement | null>;
  template?: DualTemplate | null;
  height: number;
}

const TextOverlayInput: React.FC<TextOverlayInputProps> = ({
  inputPosition,
  editingText,
  onTextChange,
  onTextBlur,
  selectedFont,
  selectedFontSize,
  selectedColor,
  isMultiline,
  isUnderline,
  isBold,
  isItalic,
  textAlign = 'left',
  lineHeight = 1,
  tone,
  zoom,
  konvaText,
  toolbarRef,
  textAreaRef,
  template,
  height
}) => {
  if (!template) return null;

  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scale = zoom ?? 1;
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);

  const fontFamily = selectedFont ?? 'Arial';
  const fontSize = selectedFontSize ?? 16;
  const fontWeight = isBold ? 'bold' : 'normal';
  const fontStyle = isItalic ? 'italic' : 'normal';
  const maxTextWidth = template.width - 36 * 2;
  const singleLineHeight = fontSize * lineHeight;

  const {
    size,
    updateSize,
    canvasRef,
    setSize,
  } = useFontDrivenOverlay({
    text: editingText ?? '',
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    lineHeight,
    konvaText,
    template,
  });

  useEffect(() => {
    textAreaRef.current?.focus();
    syncText(editingText ?? '');
  }, []);

  const toneBorderMap: Record<tone, string> = {
    festive: '3px solid #b91c1c',
    neutral: '3px solid #6b7280',
    primary: '3px solid #2563eb',
    accent: '3px solid #f43f5e',
    ceremonial: '3px solid #78350f',
    reflective: '3px solid #1e3a8a',
    elegant: '3px solid #4f46e5',
    minimal: '2px solid #d1d5db',
  };

  const borderStyle = tone ? toneBorderMap[tone] : '2px solid #3498db';

  const measureLongestLine = (text: string): number => {
    const canvas = canvasRef.current;
    if (!canvas) return template.width;
    const ctx = canvas.getContext('2d');
    if (!ctx) return template.width;
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    const lines = text.split('\n');
    return Math.max(...lines.map(line => ctx.measureText(line).width));
  };

  const syncText = (value: string) => {
    const longestLineWidth = measureLongestLine(value);
    const unclampedWidth = longestLineWidth + 20;
    const width = Math.min(unclampedWidth, maxTextWidth);
    const lineCount = value.split('\n').length;
    const height = lineCount * singleLineHeight;

    console.log(`🧮 Line count: ${lineCount}, Height: ${height}px`);

    setSize({ width, height });

    if (konvaText) {
      konvaText.text(value);
      konvaText.width(width);
      konvaText.height(height);
      konvaText.lineHeight(isMultiline ? lineHeight : undefined);
      konvaText.wrap('none');
      konvaText.getLayer()?.batchDraw();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onTextChange?.(value);
    updateSize(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    const isEnter = e.key === 'Enter';

    if (lockedHeight === null) {
      setLockedHeight(size.height); // lock height
    }

    if (isEnter) {
      syncText(value); // allow height update on Enter
    }

    onTextChange?.(value);
    updateSize(value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    syncText(value); // finalize layout
    setLockedHeight(null); // release lock
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;

    const newWidth = Math.max(50, size.width + dx);
    const newHeight = Math.max(singleLineHeight, size.height + dy);

    if (konvaText) {
      konvaText.width(newWidth);
      konvaText.height(newHeight);
      konvaText.text(editingText ?? '');
      konvaText.getLayer()?.batchDraw();
    }

    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={toolbarRef}
      id="text-overlay"
      style={{
        position: 'absolute',
        top: inputPosition?.y,
        left: inputPosition?.x,
        width: `${size.width}px`,
        height: `${lockedHeight ?? size.height}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        zIndex: 10,
      }}
    >
      <textarea
        ref={textAreaRef}
        value={editingText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={onTextBlur}
        style={{
          width: `${size.width}px`,
          height: `${lockedHeight ?? size.height}px`,
          fontFamily,
          fontSize,
          color: selectedColor,
          textDecoration: isUnderline ? 'underline' : 'none',
          fontWeight,
          fontStyle,
          textAlign,
          lineHeight,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          resize: 'none',
          outline: 'none',
          pointerEvents: 'auto',
          boxSizing: 'border-box',
          background: '#ffffff',
          border: borderStyle,
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.2s ease, border 0.2s ease',
        }}
      />
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          bottom: -16,
          right: -16,
          width: 12,
          height: 12,
          background: '#FFF',
          cursor: 'nwse-resize',
          borderRadius: 2,
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default TextOverlayInput;
