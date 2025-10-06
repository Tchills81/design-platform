'use client';

import React from 'react';
import { Shape } from 'react-konva';
import Konva from 'konva';

// Define the interface for the Heart component, extending Konva.ShapeConfig
interface HeartProps extends Konva.ShapeConfig {
  isSelected?: boolean;
}

/**
 * A declarative Heart shape using Konva's sceneFunc.
 * Responsive to width and height changes for proper transformer alignment.
 */
export const Heart = ({
  x,
  y,
  width = 120,
  height = 105,
  fill = '#f43f5e',
  stroke = '#be123c',
  strokeWidth = 2,
  draggable = true,
  onClick,
  isSelected = false,
  name = 'Shape',
  hitStrokeWidth = 12,
  ...props
}: HeartProps) => {
  // Responsive drawing logic based on shape dimensions
  const heartSceneFunc: (ctx: Konva.Context, shape: Konva.Shape) => void = (
    ctx,
    shape
  ) => {
    const w = shape.width();
  const h = shape.height();

  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.bezierCurveTo(w * 0.85, h * -0.3, w, h * 0.6, w / 2, h);
  ctx.bezierCurveTo(0, h * 0.6, w * 0.15, h * -0.3, w / 2, 0);
  ctx.closePath();
  ctx.fillStrokeShape(shape);
  };

  return (
    <Shape
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      stroke={stroke}
      strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
      hitStrokeWidth={hitStrokeWidth}
      draggable={draggable}
      name={name}
      onClick={onClick}
      sceneFunc={heartSceneFunc}
      {...props}
    />
  );
};
