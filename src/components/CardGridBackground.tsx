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
  side?: string;
  zoom?: number;
  draggable?: boolean;
  onDrag?: (delta: { x: number; y: number }) => void;
  mode?: string;
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
  previewColor = 'rgba(0, 0, 0, 0.1)',
  zoom = 1,
  draggable = false,
  onDrag,
  mode = 'painting'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const paintedCellsRef = useRef(new Set<string>());
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null);
  const [animatedCells, setAnimatedCells] = useState<Set<string>>(new Set());
  const [pulseMap, setPulseMap] = useState<Map<string, number>>(new Map());
  const [brushTrail, setBrushTrail] = useState<string[]>([]);

  // 🎨 Painting Interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== 'painting') return;

    const cellSizeX = width / cols;
    const cellSizeY = height / rows;

    const getCellFromEvent = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const xClick = (e.clientX - rect.left) / zoom;
      const yClick = (e.clientY - rect.top) / zoom;
      const col = Math.floor(xClick / cellSizeX);
      const row = Math.floor(yClick / cellSizeY);
      return { col, row };
    };

    const paintCell = (col: number, row: number) => {
      const key = `${col},${row}`;
      if (!paintedCellsRef.current.has(key)) {
        paintedCellsRef.current.add(key);
        onCellPaint?.(col, row);

        const now = Date.now();
        setPulseMap((prev) => {
          const next = new Map(prev);
          next.set(key, now);
          return next;
        });

        setAnimatedCells((prev) => new Set(prev).add(key));
        setTimeout(() => {
          setAnimatedCells((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }, 300);

        setBrushTrail((prev) => [...prev.slice(-9), key]);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      paintedCellsRef.current.clear();
      const { col, row } = getCellFromEvent(e);
      paintCell(col, row);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      paintedCellsRef.current.clear();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { col, row } = getCellFromEvent(e);
      setHoveredCell({ col, row });
      if (isDraggingRef.current) paintCell(col, row);
    };

    const handleMouseLeave = () => setHoveredCell(null);

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [onCellPaint, width, height, cols, rows, zoom, mode]);

  // 🖱️ Dragging Interaction (only when not painting)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode === 'painting' || !draggable) return;

    let lastX = 0;
    let lastY = 0;
    let isDragging = false;

    const handleDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      onDrag?.({ x: dx, y: dy });
    };

    const handleUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleUp);
    canvas.addEventListener('mouseleave', handleUp);

    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('mouseleave', handleUp);
    };
  }, [draggable, onDrag, mode]);

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
        const key = `${col},${row}`;
        const isHovered = hoveredCell?.col === col && hoveredCell?.row === row;
        const fill = isHovered ? previewColor : getCellColor(col, row);
        allColors.push(fill);

        ctx.fillStyle = fill;
        ctx.fillRect(px, py, cellSizeX, cellSizeY);

        ctx.strokeStyle = stroke;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, cellSizeX, cellSizeY);

        if (animatedCells.has(key)) {
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = fill;
          ctx.fillRect(px - 2, py - 2, cellSizeX + 4, cellSizeY + 4);
          ctx.globalAlpha = 1;
        }

        const pulseStart = pulseMap.get(key);
        const elapsed = pulseStart ? Date.now() - pulseStart : Infinity;

        if (elapsed < 300) {
          const t = elapsed / 300;
          const eased = 1 - Math.pow(1 - t, 2);
          const scale = 1 + 0.1 * eased;
          const offsetX = (cellSizeX * (scale - 1)) / 2;
          const offsetY = (cellSizeY * (scale - 1)) / 2;

          ctx.save();
          ctx.globalAlpha = 0.6 * (1 - t);
          ctx.fillStyle = fill;
          ctx.fillRect(px - offsetX, py - offsetY, cellSizeX * scale, cellSizeY * scale);
          ctx.restore();
        }
      }
    }

    brushTrail.forEach((key, i) => {
      const [col, row] = key.split(',').map(Number);
      const px = col * cellSizeX;
      const py = row * cellSizeY;
      const alpha = 0.1 + (i / brushTrail.length) * 0.3;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = getCellColor(col, row);
      ctx.fillRect(px, py, cellSizeX, cellSizeY);
      ctx.restore();
    });

    if (onAverageColorChange) {
      const avg = computeAverageColor(allColors);
      onAverageColorChange(avg);
    }
  }, [
    width,
    height,
    cols,
    rows,
    hoveredCell,
    getCellColor,
    stroke,
    animatedCells,
    pulseMap,
    brushTrail,
    onAverageColorChange
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        pointerEvents: 'auto',
        cursor: mode === 'painting' ? 'crosshair' : 'grab',
        ...style
      }}
    />
  );
}

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
  return `rgb(${Math.floor(r / count)}, ${Math.floor(g / count)}, ${Math.floor(b / count)})`;
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
