/**
 * Render a <canvas> element positioned behind your Konva stage

Fill each cell using the gridColors array

Match the card’s dimensions and grid layout

Be visually consistent with your CardGridBackground, but without stroke lines


Why This Works
It visually echoes your grid logic without interaction layers

It’s lightweight and modular—ready for animation, masking, or blending

It honors authored tone with pixel-level precision
 */

'use client';

import React, { useRef, useEffect } from 'react';

interface CardGridFillProps {
  width: number;
  height: number;
  x?: number;
  y?: number;
  cols: number;
  rows: number;
  gridColors: string[];
  style?: React.CSSProperties;
}

const CardGridFill: React.FC<CardGridFillProps> = ({
  width,
  height,
  x = 0,
  y = 0,
  cols,
  rows,
  gridColors,
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

    const cellWidth = width / cols;
    const cellHeight = height / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        const color = gridColors[index] || '#ffffff';

        ctx.fillStyle = color;
        ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
      }
    }
  }, [width, height, cols, rows, gridColors]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        pointerEvents: 'none',
        ...style
      }}
    />
  );
};

export default CardGridFill;
