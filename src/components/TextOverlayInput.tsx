import React, { RefObject, useEffect, useRef, useState } from 'react';
import SelectionFrame from './SelectionFrame';
import { tone } from '../types/tone';
import Konva from 'konva';

interface TextOverlayInputProps {
  inputPosition?: {
    x: number;
    y: number;
  } | null | undefined;
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
  width,
  height,
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
  toolbarRef
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [size, setSize] = useState({ width: width ?? 200, height: height ?? 100 });
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scale = zoom ?? 1;

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const toneBorderMap: Record<tone, string> = {
    festive: '2px solid #b91c1c',
    neutral: '2px solid #6b7280',
    primary: '2px solid #2563eb',
    accent: '2px solid #f43f5e',
    ceremonial: '2px solid #78350f',
    reflective: '2px solid #1e3a8a',
    elegant: '2px solid #4f46e5',
    minimal: '1px solid #d1d5db'
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
  
    setSize(prev => {
      const newWidth = Math.max(50, prev.width + dx);
      const newHeight = Math.max(30, prev.height + dy);
  
      // ✅ Sync Konva.Text dimensions
      if (konvaText) {
        konvaText.width(newWidth);
        konvaText.height(newHeight);
        konvaText.getLayer()?.batchDraw();
      }
  
      return { width: newWidth, height: newHeight };
    });
  
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
    <>
      <div  ref={toolbarRef} id='text-overlay'
        style={{
          position: 'absolute',
          top: inputPosition?.y,
          left: inputPosition?.x,
          width: size.width,
          height: size.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          zIndex: 1000
        }}
      >
        <textarea
          ref={ref}
          value={editingText}
          onChange={(e) => {
            if (onTextChange) {
              konvaText?.visible(false);
              onTextChange(e.target.value);
            }
          }}
          onBlur={onTextBlur}
          style={{
            width: '100%',
            height: '100%',
            fontFamily: selectedFont,
            fontSize: selectedFontSize,
            color: selectedColor,
            textDecoration: isUnderline ? 'underline' : 'none',
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            textAlign: textAlign,
            lineHeight: 1.0,
            background: '#ffffff',
            border: borderStyle,
            borderRadius: 2,
            resize: 'none',
            outline: 'none',
            pointerEvents: 'auto',
            boxSizing: 'border-box',
            padding: 4
          }}
        />
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 12,
            height: 12,
            background: '#ccc',
            cursor: 'nwse-resize',
            borderRadius: 2
          }}
        />
      </div>
    </>
  );
};

export default TextOverlayInput;
