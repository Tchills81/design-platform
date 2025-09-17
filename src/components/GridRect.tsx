import React from 'react';
import { Group, Rect } from 'react-konva';

interface GridRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  cols: number;
  rows: number;
  gridColors: string[];
  cornerRadius?: number;
  mode?: 'card' | 'painting' | 'preview';
  brushColor?: string;
  onPaint?: (col: number, row: number) => void;
}

const GridRect: React.FC<GridRectProps> = ({
  x,
  y,
  width,
  height,
  cols,
  rows,
  gridColors,
  cornerRadius = 8,
  mode,
  brushColor, 
  onPaint
  
}) => {
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  return (
    <Group x={x} y={y}>
      {Array.from({ length: rows }).flatMap((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const index = row * cols + col;
          const fill = gridColors[index] || '#ffffff';

          return (
            <Rect
            stroke={fill}
             key={`cell-${col}-${row}`}
             x={col * cellWidth}
             y={row * cellHeight}
             width={cellWidth}
             height={cellHeight}
             fill={fill}
             cornerRadius={0}
             listening={true} // ✅ Enable interaction
             onClick={() => {
             if (mode === 'painting' && onPaint) {
                onPaint(col, row);
              }
          }}
          />

          );
        })
      )}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        cornerRadius={cornerRadius}
        stroke="transparent"
        listening={false}
      />
    </Group>
  );
};

export default GridRect;
