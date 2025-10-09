'use client';

import React from 'react';
import { Shape } from 'react-konva';
import Konva from 'konva';

interface FlowerProps extends Konva.ShapeConfig {
  petals?: number;
  radius?: number;
  petalWidth?: number;
  isSelected?: boolean;
}

export const Flower = ({
  x,
  y,
  petals = 6,
  radius = 30,
  petalWidth = 12,
  fill = '#E63946',
  stroke = '#D62828',
  strokeWidth = 2,
  isSelected = false,
  draggable = true,
  name = 'Flower',
  hitStrokeWidth = 12,
  onClick,
  ...props
}: FlowerProps) => {
  const flowerSceneFunc: (ctx: Konva.Context, shape: Konva.Shape) => void = (
    ctx,
    shape
  ) => {
    const angleStep = (2 * Math.PI) / petals;

    ctx.beginPath();
    for (let i = 0; i < petals; i++) {
      const angle = i * angleStep;
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;

      const controlAngle = angle + angleStep / 2;
      const controlX = Math.cos(controlAngle) * (radius + petalWidth);
      const controlY = Math.sin(controlAngle) * (radius + petalWidth);

      const x2 = Math.cos(angle + angleStep) * radius;
      const y2 = Math.sin(angle + angleStep) * radius;

      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(controlX, controlY, x2, y2);
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
      sceneFunc={flowerSceneFunc}
      {...props}
    />
  );
};
