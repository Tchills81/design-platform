'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CardGridBackgroundProps {
  width: number;
  height: number;
  cellSize?: number;
  x?: number;
  y?: number;
  stroke?: string;
  getCellColor?: (col: number, row: number) => string;
  onAverageColorChange?: (color: string) => void;
  onCellPaint?: (col: number, row: number) => void;
  style?: React.CSSProperties;
  cols?: number;
  rows?: number;
  previewColor?: string;
  side?:string;
}

const CardGridBackground: React.FC<CardGridBackgroundProps> = ({
  width,
  height,
  cellSize = 32,
  x = 0,
  y = 0,
  stroke = '#ccc',
  getCellColor = () => '#f0f0f0',
  onAverageColorChange,
  onCellPaint,
  style,
  cols = 10,
  rows = 6,
  side,
  previewColor = 'rgba(0, 0, 0, 0.1)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const paintedCellsRef = useRef(new Set<string>());
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null);
  const [animatedCells, setAnimatedCells] = React.useState<Set<string>>(new Set());
  const [pulseMap, setPulseMap] = React.useState<Map<string, number>>(new Map());
  const [brushTrail, setBrushTrail] = React.useState<string[]>([]);




  // 🎨 Interaction: Click + Drag to Paint
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onCellPaint) return;

    const cellSizeX = width / cols;
    const cellSizeY = height / rows;

    const getCellFromEvent = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const xClick = e.clientX - rect.left;
      const yClick = e.clientY - rect.top;
      const col = Math.floor(xClick / cellSizeX);
      const row = Math.floor(yClick / cellSizeY);
      return { col, row };
    };

    const paintCell = (col: number, row: number) => {
          const now = Date.now();
          setPulseMap((prev) => {
          const next = new Map(prev);
          next.set(`${col},${row}`, now);
          return next;
          });

      const key = `${col},${row}`;
      if (!paintedCellsRef.current.has(key)) {
        paintedCellsRef.current.add(key);
        onCellPaint(col, row);
      
  // 🎉 Trigger animation
          setAnimatedCells((prev) => new Set(prev).add(key));
          setTimeout(() => {
          setAnimatedCells((prev) => {
         const next = new Set(prev);
         next.delete(key);
         return next;
         });
          }, 300); // duration of pulse
    }

    setBrushTrail((prev) => [...prev.slice(-9), key]); // keep last 10

    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      paintedCellsRef.current.clear();
      const { col, row } = getCellFromEvent(e);
      console.log("painting", col, row);
      paintCell(col, row);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      paintedCellsRef.current.clear();
    };

    const handleMouseMove = (e: MouseEvent) => {
        const { col, row } = getCellFromEvent(e);
      
        // 🎨 Hover preview (always active)
        setHoveredCell({ col, row });
      
        // 🖌️ Drag painting (only when mouse is down)
        if (isDraggingRef.current) {
          paintCell(col, row);
        }
      };
      

    const handleMouseLeave = () => {
        setHoveredCell(null);
      }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onCellPaint, width, height, cols, rows]);

  // 🧱 Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const cellSizeX = width / cols;
    const cellSizeY = height / rows;

    const allColors: string[] = [];

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {

        

        const px = col * cellSizeX;
        const py = row * cellSizeY;

        const isHovered = hoveredCell?.col === col && hoveredCell?.row === row;
        const fill = isHovered ? previewColor : getCellColor?.(col, row) ?? '#f0f0f0';
        allColors.push(fill);

        ctx.fillStyle = fill;
        ctx.fillRect(px, py, cellSizeX, cellSizeY);

        ctx.strokeStyle = stroke;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, cellSizeX, cellSizeY);


        const key = `${col},${row}`;
        const isAnimated = animatedCells.has(key);

        // Animation: Simple Highlight

        if (isAnimated) {
           ctx.globalAlpha = 0.6;
          ctx.fillStyle = getCellColor?.(col, row) ?? '#f0f0f0';
          ctx.fillRect(px - 2, py - 2, cellSizeX + 4, cellSizeY + 4); // slight expansion
          ctx.globalAlpha = 1;
        }


        //Easing Curves (Smooth Pulse Transitions)
          const pulseStart = pulseMap.get(key);
          const elapsed = pulseStart ? Date.now() - pulseStart : Infinity;

        if (elapsed < 300) {
           const t = elapsed / 300;
           const eased = 1 - Math.pow(1 - t, 2); // ease-out
           const scale = 1 + 0.1 * eased;
           const offsetX = (cellSizeX * (scale - 1)) / 2;
           const offsetY = (cellSizeY * (scale - 1)) / 2;

           ctx.save();
           ctx.globalAlpha = 0.6 * (1 - t);
           ctx.fillStyle = getCellColor?.(col, row) ?? '#f0f0f0';
           ctx.fillRect(px - offsetX, py - offsetY, cellSizeX * scale, cellSizeY * scale);
           ctx.restore();
        }

      }


      brushTrail.forEach((key, i) => {
        const [col, row] = key.split(',').map(Number);
        const px = col * cellSizeX;
        const py = row * cellSizeY;
        const alpha = 0.1 + (i / brushTrail.length) * 0.3;
      
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = getCellColor?.(col, row) ?? '#f0f0f0';
        ctx.fillRect(px, py, cellSizeX, cellSizeY);
        ctx.restore();
      });
      
    }

    if (onAverageColorChange) {
      const avg = computeAverageColor(allColors);
      onAverageColorChange(avg);
    }
  }, [width, height, cellSize, getCellColor, stroke, onAverageColorChange, cols, rows]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        pointerEvents: 'auto',
        cursor: 'crosshair',
        ...style
      }}
    />
  );
};

// 🎨 Utility: Average Color
function computeAverageColor(colors: string[]): string {
  let r = 0, g = 0, b = 0;

  colors.forEach((hex) => {
    const [cr, cg, cb] = hexToRgb(hex);
    r += cr;
    g += cg;
    b += cb;
  });

  const count = colors.length;
  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  return `rgb(${r}, ${g}, ${b})`;
}

// 🎨 Utility: Hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ];
}

export default CardGridBackground;
