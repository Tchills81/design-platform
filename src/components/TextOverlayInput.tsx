import React, { RefObject, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { tone } from '../types/tone';
import { useFontDrivenOverlay } from '../canvas/hooks/useFontDrivenOverlay';
import { DualTemplate } from '../types/template';
import { measureText } from '../utils/measureText';
import ResizeHandle from './ResizeHandle';

interface TextOverlayInputProps {
  inputPosition?: { x: number; y: number } | null | undefined;
  editingText?: string;
  onTextChange?: (val: string) => void;
  onTextBlur?: ((e: React.FocusEvent<HTMLTextAreaElement>) => void) | undefined;
  selectedFont?: string;
  selectedFontSize?: number;
  setSelectedFontSize?: (size: number) => void;

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
  onFontSizeChange: (newSize: number) => void
  template?: DualTemplate | null;
  height?: number;
  width?: number;
}

const TextOverlayInput: React.FC<TextOverlayInputProps> = ({
  inputPosition,
  editingText,
  onTextChange,
  onFontSizeChange,
  onTextBlur,
  selectedFont,
  selectedFontSize,
  setSelectedFontSize,
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
}) => {
  if (!template) return null;

  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scale = zoom ?? 1;
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const manualSizeRef = useRef<{ width: number; height: number } | null>(null);
  const [isManuallyResized, setIsManuallyResized] = useState(false);
  const initialSizeRef = useRef<{ width: number; height: number }>({ width: 200, height: 100 });
  const initialFontSizeRef = useRef<number>(selectedFontSize ?? 16);

  const [dynamicFontSize, setDynamicFontSize] = useState(selectedFontSize ?? 16);
  

  const activeHandle = useRef<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | null>(null);
  const [, setResizeTick] = useState(0);

  const fontFamily = selectedFont ?? 'Arial';
  const fontWeight = isBold ? 'bold' : 'normal';
  const fontStyle = isItalic ? 'italic' : 'normal';
  const maxTextWidth = template.width - 72;
  const maxTextHeight = template.height - 72;


 

  
  
  

  const {
    size,
    updateSize,
    canvasRef,
    setSize,
    effectiveFontSize,
    measure
  
  } = useFontDrivenOverlay({
    text: editingText ?? '',
    fontFamily,
    fontSize: dynamicFontSize,
    overrideFontSize: dynamicFontSize,
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


  useEffect(() => {
    if (!isManuallyResized && selectedFontSize !== undefined) {
      setDynamicFontSize(selectedFontSize);
      updateSize(editingText ?? '');
    }
  }, [selectedFontSize]);
  


  const singleLineHeight = dynamicFontSize * lineHeight;
  const sessionMinWidthRef = useRef<number>(size.width);



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
  const toneColor = toneBorderMap[tone]?.match(/#[0-9a-fA-F]{6}/)?.[0] ?? '#2563eb';
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);



  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    width: 12,
    height: 12,
    background: 'white',
    border: `2px solid ${toneColor}`,
    borderRadius: '50%',
    boxShadow: '0 0 2px rgba(0,0,0,0.2)',
    zIndex: 20,
    cursor: 'nwse-resize',
  };
  
  const rectHandleStyle: React.CSSProperties = {
    position: 'absolute',
    width: 16,
    height: 8,
    background: '#2563eb',
    borderRadius: 2,
    boxShadow: '0 0 2px rgba(0,0,0,0.2)',
    zIndex: 20,
    cursor: 'ew-resize',
  };




  const throttle = (fn: Function, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  };
  
  const throttledResize = throttle(() => {
    // update font size, Konva, etc.
  }, 16); // ~60fps
  

  const syncText = (value: string) => {
    if (isManuallyResized) return;
    updateSize(value);
  };




  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (manualSizeRef.current) {
      manualSizeRef.current = null;
      setIsManuallyResized(false);
    }
    onTextChange?.(value);
    updateSize(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    if (lockedHeight === null) setLockedHeight(size.height);
    if (e.key === 'Enter') syncText(value);
    onTextChange?.(value);
    updateSize(value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    syncText(value);
    setLockedHeight(null);
  };

  const handleMouseDown = (e: React.MouseEvent, handle: typeof activeHandle.current) => {
    isResizing.current = true;
    activeHandle.current = handle;
    setIsManuallyResized(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    initialSizeRef.current = {
      width: manualSizeRef.current?.width ?? size.width,
      height: manualSizeRef.current?.height ?? size.height,
    };
    initialFontSizeRef.current = dynamicFontSize;
  
    // ✅ Set session cap
    sessionMinWidthRef.current = initialSizeRef.current.width;
  
    e.preventDefault();
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !canvasRef.current || !template || !activeHandle.current) return;
  
    const dx = e.clientX - startPos.current.x;
    const direction = activeHandle.current;
  
    const baseWidth = initialSizeRef.current.width;
    const baseFontSize = initialFontSizeRef.current;
    const sessionMinWidth = sessionMinWidthRef.current;
  
    let newWidth = baseWidth;
  
    if (direction === 'left' || direction === 'top-left' || direction === 'bottom-left') {
      newWidth = Math.max(sessionMinWidth, baseWidth - dx);
    } else if (direction === 'right' || direction === 'top-right' || direction === 'bottom-right') {
      newWidth = Math.min(maxTextWidth, baseWidth + dx);
    }
  
    const widthRatio = newWidth / baseWidth;
    const widthScale = 1 + 0.7 * (widthRatio - 1);
    const newFontSize = Math.round(Math.max(8, Math.min(96, baseFontSize * widthScale)));
  
    const measured = measureText({
      text: editingText ?? '',
      fontSize: newFontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      lineHeight,
      template,
      canvas: canvasRef.current,
    });
  
    const newHeight = measured.height;
  
    if (Math.abs(newFontSize - dynamicFontSize) > 0.5) {
      setDynamicFontSize(newFontSize);
      onFontSizeChange?.(newFontSize);
    }
  
    manualSizeRef.current = { width: newWidth, height: newHeight };
  
    if (
      konvaText &&
      (konvaText.width() !== newWidth ||
       konvaText.height() !== newHeight ||
       konvaText.fontSize() !== newFontSize)
    ) {
      konvaText.width(newWidth);
      konvaText.height(newHeight);
      konvaText.fontSize(newFontSize);
      konvaText.text(editingText ?? '');
      konvaText.getLayer()?.batchDraw();
    }
  
    requestAnimationFrame(() => setResizeTick(t => t + 1));
  };
  
  

  const handleMouseUp = () => {
    if (manualSizeRef.current) {
      setSize(manualSizeRef.current);
      sessionMinWidthRef.current = manualSizeRef.current.width; // ✅ Update cap
      if (konvaText) {
        konvaText.width(manualSizeRef.current.width);
        konvaText.height(manualSizeRef.current.height);
        konvaText.getLayer()?.batchDraw();
      }
    }
    setIsManuallyResized(false);
    isResizing.current = false;
  };
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [size]);

  const renderWidth = manualSizeRef.current?.width ?? size.width;
  const renderHeight = lockedHeight ?? manualSizeRef.current?.height ?? size.height;

  return (
    <div
      ref={toolbarRef}
      id="text-overlay"
      style={{
        position: 'absolute',
        top: inputPosition?.y,
        left: inputPosition?.x,
        width: `${renderWidth}px`,
        height: `${renderHeight}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        transition: 'height 120ms ease-in-out, box-shadow 0.2s ease, border 0.2s ease',
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
          width: `${renderWidth}px`,
          height: `${renderHeight}px`,
          fontFamily,
          fontSize: dynamicFontSize,
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
          background: 'transparent',
          border: borderStyle,
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.2s ease, border 0.2s ease, height 120ms ease-in-out',
        }}
      />


<ResizeHandle position="top-left" style={{ ...handleStyle, top: -6, left: -6 }} toneColor={toneColor} onMouseDown={handleMouseDown} />
<ResizeHandle position="top-right" style={{ ...handleStyle, top: -6, right: -6 }} toneColor={toneColor} onMouseDown={handleMouseDown} />
<ResizeHandle position="bottom-left" style={{ ...handleStyle, bottom: -6, left: -6 }} toneColor={toneColor} onMouseDown={handleMouseDown} />
<ResizeHandle position="bottom-right" style={{ ...handleStyle, bottom: -6, right: -6 }} toneColor={toneColor} onMouseDown={handleMouseDown} />
<ResizeHandle position="left" style={{ ...rectHandleStyle, top: '50%', left: -8, transform: 'translateY(-50%) rotate(90deg)' }} toneColor={toneColor} onMouseDown={handleMouseDown} />
<ResizeHandle position="right" style={{ ...rectHandleStyle, top: '50%', right: -8, transform: 'translateY(-50%) rotate(90deg)' }} toneColor={toneColor} onMouseDown={handleMouseDown} />


      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default TextOverlayInput;
