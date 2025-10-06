import React from 'react';
import { Group, Rect } from 'react-konva';
import { CanvasMode } from '../types/CanvasMode';

interface GridRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  cols: number;
  rows: number;
  gridColors: string[];
  cornerRadius?: number;
  mode?: CanvasMode;
  brushColor?: string;
  onPaint?: (col: number, row: number) => void;
  showDynamicBackground?: boolean;
  dynamicColor?: string;
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
  onPaint,
  showDynamicBackground = false,
  dynamicColor
}) => {
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  return (
    <Group x={x} y={y}>
      {showDynamicBackground ? (
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={dynamicColor || '#f3f4f6'}
          cornerRadius={cornerRadius}
          listening={false}
        />
      ) : (
        Array.from({ length: rows }).flatMap((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const index = row * cols + col;
            const fill = gridColors[index] || '#ffffff';

            return (
              <Rect
                key={`cell-${col}-${row}`}
                x={col * cellWidth}
                y={row * cellHeight}
                width={cellWidth}
                height={cellHeight}
                fill={fill}
                stroke={fill}
                cornerRadius={0}
                listening={true}
                onClick={() => {
                  if (mode === 'painting' && onPaint) {
                    onPaint(col, row);
                  }
                }}
              />
            );
          })
        )
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
