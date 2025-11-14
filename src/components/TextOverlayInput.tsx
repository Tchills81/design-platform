import React, { RefObject, useEffect, useRef } from 'react';
import Konva from 'konva';
import { tone } from '../types/tone';

import { useFontDrivenOverlay } from '../canvas/hooks/useFontDrivenOverlay';


interface TextOverlayInputProps {
  inputPosition?: { x: number; y: number } | null | undefined;
  width?: number;
  height?: number;
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
  lineHeight = 1.4,
  tone,
  zoom,
  konvaText,
  toolbarRef,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scale = zoom ?? 1;

  const fontFamily = selectedFont ?? 'Arial';
  const fontSize = selectedFontSize ?? 16;
  const fontWeight = isBold ? 'bold' : 'normal';
  const fontStyle = isItalic ? 'italic' : 'normal';

  const {
    size,
    updateSize,
    canvasRef,
  } = useFontDrivenOverlay({
    text: editingText ?? '',
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    lineHeight,
    konvaText,
  });

  useEffect(() => {
    ref.current?.focus();
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
    const newHeight = Math.max(30, size.height + dy);

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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onTextChange?.(value);
    updateSize(value);

    window.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
    }));
  };

  return (
    <div
      ref={toolbarRef}
      id="text-overlay"
      style={{
        position: 'absolute',
        top: inputPosition?.y,
        left: inputPosition?.x,
        width: size.width,
        height: size.height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        zIndex: 10,
      }}
    >
      <textarea
        ref={ref}
        value={editingText}
        onChange={handleTextChange}
        onBlur={onTextBlur}
        style={{
          width: '100%',
          height: '100%',
          fontFamily,
          fontSize,
          color: selectedColor,
          textDecoration: isUnderline ? 'underline' : 'none',
          fontWeight,
          fontStyle,
          textAlign,
          lineHeight,
          background: '#ffffff',
          border: borderStyle,
          borderRadius: 2,
          resize: 'none',
          outline: 'none',
          pointerEvents: 'auto',
          boxSizing: 'content-box',
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
