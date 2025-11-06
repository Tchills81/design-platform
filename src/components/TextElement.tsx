'use client';

import React, { useRef, useMemo } from 'react';
import { Text, Group } from 'react-konva';
import Konva from 'konva';
import SelectionFrame from './SelectionFrame';
import { TemplateElement } from '../types/template';
import { getZoomAwareDragBoundFunc } from '../utils/getZoomAwareDragBoundFunc';

interface TextElementProps {
  id: string;
  templateId: string;
  el?: TemplateElement;
  text: string;
  position: { x: number; y: number };
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  isMultiline: boolean;
  isUnderline: boolean;
  textWidth?: number;
  lineHeight?: number;
  fontStyle?: 'normal' | 'bold' | 'italic' | 'italic bold';
  fontWeight?: 'normal' | 'bold';
  size: number;
  color: string;
  selected?: boolean;
  transformModeActive?: boolean;
  cardBounds: { x: number; y: number; width: number; height: number };
  onUpdate: (updated: { id: string; text: string; position: { x: number; y: number } }) => void;
  onEdit: (text: string, position: { x: number; y: number }, align: 'left' | 'center' | 'right') => void;
  setGhostLines?: (lines: { x?: number; y?: number }) => void;
  index: number;
  onClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  zoom: number;
}

const TextElement: React.FC<TextElementProps> = ({
  id,
  templateId,
  text,
  position,
  fontFamily,
  textAlign,
  fontStyle,
  fontWeight,
  size,
  color,
  selected,
  transformModeActive,
  cardBounds,
  onUpdate,
  onEdit,
  onClick,
  setGhostLines,
  isMultiline,
  isUnderline,
  textWidth,
  lineHeight,
  zoom
}) => {
  const textRef = useRef<Konva.Text>(null);
  const padding = 2;

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const absPos = textRef.current?.getAbsolutePosition();
    if (absPos) {
      onEdit(text, position, textAlign);
    }
    if (onClick) onClick(e);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const width = node.width();
    const height = node.height();

    const minX = cardBounds.x + padding;
    const maxX = cardBounds.x + cardBounds.width - width - padding;
    const minY = cardBounds.y + padding;
    const maxY = cardBounds.y + cardBounds.height - height - padding;

    const clampedX = Math.max(minX, Math.min(node.x(), maxX));
    const clampedY = Math.max(minY, Math.min(node.y(), maxY));

    node.position({ x: clampedX, y: clampedY });
    node.getLayer()?.batchDraw();

    onUpdate({ id, text, position: { x: clampedX, y: clampedY } });

    if (setGhostLines) {
      setGhostLines({});
    }
  };

  const dragBoundFunc = useMemo(() => {
    const width = textRef.current?.width() ?? 0;
    const height = textRef.current?.height() ?? 0;

    return getZoomAwareDragBoundFunc(
      cardBounds,
      { width, height },
      zoom
    );
  }, [cardBounds, zoom, textRef.current?.width(), textRef.current?.height()]);

  return (
    <Group>
     
      <Text
        id={id}
        ref={textRef}
        text={text}
        x={position.x}
        y={position.y}
        fontSize={size}
        fontFamily={fontFamily}
        align={textAlign}
        fontStyle={fontStyle}
        fill={color}
        draggable
        onClick={handleClick}
        dragBoundFunc={dragBoundFunc}
        onDragEnd={handleDragEnd}
        cursor={selected ? 'move' : 'default'}
        wrap={isMultiline ? 'word' : undefined}
        width={isMultiline ? textWidth ?? 240 : undefined}
        lineHeight={isMultiline ? lineHeight ?? 1.4 : undefined}
        textDecoration={isUnderline ? 'underline' : undefined}
      />
    </Group>
  );
};

export default TextElement;
