'use client';

import { Line, Text } from 'react-konva';

interface GhostLinesProps {
  ghostLines: { x?: number; y?: number };
  canvasWidth: number;
  canvasHeight: number;
  ghostOpacity: number;
  tone: string;
}

export default function GhostLines({
  ghostLines,
  canvasWidth,
  canvasHeight,
  ghostOpacity,
  tone
}: GhostLinesProps) {
  const { x, y } = ghostLines;

  return (
    <>
      {x !== undefined && (
        <Line
          points={[x, 0, x, canvasHeight]}
          stroke="#aaa"
          dash={[4, 4]}
          strokeWidth={1}
          listening={false}
          opacity={ghostOpacity}
        />
      )}
      {y !== undefined && (
        <Line
          points={[0, y, canvasWidth, y]}
          stroke="#aaa"
          dash={[4, 4]}
          strokeWidth={1}
          listening={false}
          opacity={ghostOpacity}
        />
      )}
      {x !== undefined && (
        <Text
          x={x + 4}
          y={12}
          text={`x = ${x}`}
          fontSize={10}
          fill={tone}
          opacity={ghostOpacity}
        />
      )}
      {y !== undefined && (
        <Text
          x={12}
          y={y - 4}
          text={`y = ${y}`}
          fontSize={10}
          fill={tone}
          opacity={ghostOpacity}
        />
      )}
    </>
  );
}
