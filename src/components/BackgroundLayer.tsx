import React from 'react';
import { Rect } from 'react-konva';

type BackgroundLayerProps = {
  width: number;
  height: number;
  background: string;
  dynamic?: boolean;
  dynamicColor?: string;
};

export default function BackgroundLayer({
  width,
  height,
  background,
  dynamic = false,
  dynamicColor
}: BackgroundLayerProps) {
  const fillColor = dynamic && dynamicColor ? dynamicColor : background;

  return (
    <Rect
      x={0}
      y={0}
      width={width}
      height={height}
      fill={fillColor}
      cornerRadius={12}
      listening={false} // ensures it doesn't intercept pointer events
    />
  );
}
