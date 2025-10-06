'use client';

import React from 'react';
import { Shape } from 'react-konva';
import Konva from 'konva';

interface StarProps extends Konva.ShapeConfig {
  isSelected?: boolean;
}

export const Star = ({
  x,
  y,
  fill = '#fde047',
  stroke = '#facc15',
  strokeWidth = 2,
  isSelected = false,
  draggable = true,
  name = 'Shape',
  hitStrokeWidth = 12,
  onClick,
  ...props
}: StarProps) => {
  const starSceneFunc: (ctx: Konva.Context, shape: Konva.Shape) => void = (
    ctx,
    shape
  ) => {
    const spikes = 5;
    const outerRadius = 30;
    const innerRadius = 15;
    const step = Math.PI / spikes;

    ctx.beginPath();
    for (let i = 0; i < 2 * spikes; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * step;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fillStrokeShape(shape);
  };

  return (
    <Shape
      x={x}
      y={y}
      fill={fill}
      stroke={stroke}
      strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
      hitStrokeWidth={hitStrokeWidth}
      draggable={draggable}
      name={name}
      onClick={onClick}
      sceneFunc={starSceneFunc}
      {...props}
    />
  );
};
