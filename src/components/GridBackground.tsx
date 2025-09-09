'use client';

import React, { useRef, useEffect } from 'react';

interface GridBackgroundProps {
  width: number;
  height: number;
  cellSize?: number;
  stroke?: string;
  lineWidth?: number;
  style?: React.CSSProperties;
}

const GridBackground: React.FC<GridBackgroundProps> = ({
  width,
  height,
  cellSize = 20,
  stroke = '#e0e0e0',
  lineWidth = 1,
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;

    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [width, height, cellSize, stroke, lineWidth]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        ...style
      }}
    />
  );
};

export default GridBackground;
