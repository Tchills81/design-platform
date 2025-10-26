'use client';

import React, { useEffect, useState, useRef } from 'react';

interface CanvasScrollbarsProps {
  scrollPosition: { x: number; y: number };
  setScrollPosition: (pos: { x: number; y: number }) => void;
  canvasSize: { width: number; height: number };
  viewportSize: { width: number; height: number };
  tone: string;
}

export default function CanvasScrollbars({
  scrollPosition,
  setScrollPosition,
  canvasSize,
  viewportSize,
  tone,
}: CanvasScrollbarsProps) {
  const maxX = Math.max(0, canvasSize.width - viewportSize.width);
  const maxY = Math.max(0, canvasSize.height - viewportSize.height);

  const [visible, setVisible] = useState(true);
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null);

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max));

  const triggerFade = () => {
    setVisible(true);
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    fadeTimeout.current = setTimeout(() => setVisible(false), 2000);
  };

  const handleHorizontalScroll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseInt(e.target.value);
    const ratio = rawValue / maxX;
    const scaledX = ratio * (canvasSize.width - viewportSize.width);
    const x = clamp(scaledX, 0, maxX);
    setScrollPosition({ x, y: scrollPosition.y });
    triggerFade();
  };

  const handleVerticalScroll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseInt(e.target.value);
    const ratio = rawValue / maxY;
    const scaledY = ratio * (canvasSize.height - viewportSize.height);
    const y = clamp(scaledY, 0, maxY);
    setScrollPosition({ x: scrollPosition.x, y });
    triggerFade();
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const newX = clamp(scrollPosition.x + e.deltaX, 0, maxX);
      const newY = clamp(scrollPosition.y + e.deltaY, 0, maxY);

      // Only update scroll if it actually changes
      if (newX !== scrollPosition.x || newY !== scrollPosition.y) {
        setScrollPosition({ x: newX, y: newY });
        triggerFade();
      }

      // Prevent default horizontal scroll from affecting layout
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollPosition, maxX, maxY]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 60,
        '--tone': tone,
      } as React.CSSProperties}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Horizontal scrollbar */}
      {maxX > 0 && (
        <input
          type="range"
          min={0}
          max={maxX}
          value={scrollPosition?.x ?? 0}
          onChange={handleHorizontalScroll}
          step={1}
          className="canvas-scrollbar horizontal"
          style={{
            zIndex: 60,
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            pointerEvents: 'auto',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Vertical scrollbar */}
      {maxY > 0 && (
        <input
          type="range"
          min={0}
          max={maxY}
          value={scrollPosition?.y ?? 0}
          onChange={handleVerticalScroll}
          step={1}
          className="canvas-scrollbar vertical"
          style={{
            zIndex: 60,
            position: 'absolute',
            top: 0,
            right: 0,
            width: '12px',
            height: '100%',
            writingMode: 'vertical-lr',
            pointerEvents: 'auto',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </div>
  );
}
