import React from 'react';
import { tone } from '../types/tone';

interface TextTransformFrameProps {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
  tone?: tone;
  onResizeStart?: () => void;
  onResize?: (newWidth: number, newHeight: number) => void;
  onResizeEnd?: () => void;
}

const TextTransformFrame: React.FC<TextTransformFrameProps> = ({
  x,
  y,
  width,
  height,
  zoom,
  tone = 'neutral',
  onResizeStart,
  onResize,
  onResizeEnd
}) => {
  const scaledX = x * zoom;
  const scaledY = y * zoom;
  const scaledWidth = width * zoom;
  const scaledHeight = height * zoom;

  const borderColor = {
    festive: '#b91c1c',
    neutral: '#6b7280',
    primary: '#2563eb',
    accent: '#f43f5e',
    ceremonial: '#78350f',
    reflective: '#1e3a8a',
    elegant: '#4f46e5',
    minimal: '#d1d5db'
  }[tone];

  return (
    <div
      style={{
        position: 'absolute',
        top: scaledY,
        left: scaledX,
        width: scaledWidth,
        height: scaledHeight,
        border: `1.5px dashed ${borderColor}`,
        borderRadius: 4,
        boxSizing: 'border-box',
        zIndex: 1001,
        pointerEvents: 'none'
      }}
    >
      {/* Resize handles (corners only for now) */}
      {['nw', 'ne', 'sw', 'se'].map((dir) => (
        <div
          key={dir}
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            background: borderColor,
            borderRadius: 2,
            cursor: `${dir}-resize`,
            pointerEvents: 'auto',
            ...(dir === 'nw' && { top: -5, left: -5 }),
            ...(dir === 'ne' && { top: -5, right: -5 }),
            ...(dir === 'sw' && { bottom: -5, left: -5 }),
            ...(dir === 'se' && { bottom: -5, right: -5 })
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart?.();
            // You can wire up drag logic here
          }}
        />
      ))}
    </div>
  );
};

export default TextTransformFrame;
