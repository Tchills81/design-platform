'use client';

import React from 'react';
import { Group, Rect } from 'react-konva';

interface CardGridLayerProps {
  x: number;
  y: number;
  width: number;
  height: number;
  cols: number;
  rows: number;
  getCellColor?: (col: number, row: number) => string;
  showGridLines?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
}


const CardGridLayer: React.FC<CardGridLayerProps> = ({
  x,
  y,
  width,
  height,
  cols,
  rows,
  getCellColor,
  showGridLines = true,
  strokeColor = '#e0e0e0',
  strokeWidth = 0.5

  
}) => {
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  return (
    <Group x={x} y={y}>
      {Array.from({ length: rows }).flatMap((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const fill = getCellColor?.(col, row) || '#ffffff';

          return (
            <Rect
              key={`cell-${col}-${row}`}
              x={col * cellWidth}
              y={row * cellHeight}
              width={cellWidth}
              height={cellHeight}
              fill={fill}
              stroke={showGridLines ? strokeColor : undefined}
              strokeWidth={showGridLines ? strokeWidth : 0}
              listening={false}
            />
          );
        })
      )}
    </Group>
  );
};

export default CardGridLayer;
