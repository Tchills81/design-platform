'use client';

import React, { useEffect, useState, useRef } from 'react';

interface CanvasScrollbarsProps {
  scrollPosition: { x: number; y: number };
  setScrollPosition: (pos: { x: number; y: number }) => void;
  handleHorizontalScroll:(e: React.ChangeEvent<HTMLInputElement>)=>void;
  handleVerticalScroll:(e: React.ChangeEvent<HTMLInputElement>)=>void;
  canvasSize: { width: number; height: number };
  viewportSize: { width: number; height: number };
  thumbValue:number;
  tone: string;
  zoom:number;
}

export default function CanvasScrollbars({
  scrollPosition,
  setScrollPosition,
  handleHorizontalScroll,
  handleVerticalScroll,
  canvasSize,
  viewportSize,
  thumbValue,
  tone,
  zoom,
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

  

  /*useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const deltaX = e.deltaX;
      const deltaY = e.deltaY;
  
      const nextX = clamp(scrollPosition.x + deltaX, 0, maxX);
      const nextY = clamp(scrollPosition.y + deltaY, 0, maxY);


     
  
      // Lock horizontal scroll if already at edge
      const lockedX =
        (scrollPosition.x === 0 && deltaX < 0) ||
        (scrollPosition.x === maxX && deltaX > 0);
  
      // Lock vertical scroll if already at edge
      const lockedY =
        (scrollPosition.y === 0 && deltaY < 0) ||
        (scrollPosition.y === maxY && deltaY > 0);

        console.log('handleWheel->lockedY...', lockedY)
  
      if (!lockedX || !lockedY) {
        setScrollPosition({
          x: lockedX ? scrollPosition.x : nextX,
          y: lockedY ? scrollPosition.y : nextY,
        });
        triggerFade();
      }
  
      e.preventDefault();
    };
  
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollPosition, maxX, maxY]);*/


  //console.log('CanvasScrollbar, scrollPosition', scrollPosition);


  // Calculate the dynamic step value based on zoom
  const step = Math.max(1, 5 / zoom);
  

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
