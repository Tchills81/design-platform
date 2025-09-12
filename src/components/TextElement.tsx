'use client';

import React, { useRef } from 'react';
import { Text } from 'react-konva';
import Konva from 'konva';
import { Group, Rect} from 'react-konva';
import SelectionFrame from './SelectionFrame';


interface TextElementProps {
  id: string;
  templateId: string;
  text: string;
  position: { x: number; y: number };
  fontFamily: string;
  fontStyle?: 'normal' | 'bold' | 'italic' | 'italic bold';
  fontWeight?: 'normal' | 'bold';
  size: number;
  color: string;
  selected?: boolean;
  transformModeActive?:boolean;

  cardBounds: { x: number; y: number; width: number; height: number };
  onUpdate: (updated: { id: string; text: string; position: { x: number; y: number } }) => void;
  onEdit: (text: string, position: { x: number; y: number }) => void;
  setGhostLines?: (lines: { x?: number; y?: number }) => void;
  el: {
    label: string;
    position: { x: number; y: number };
    font: string;
    size: number;
    color: string;
    fontStyle?: string;
    fontWeight?: string;
    isBold?: boolean;
    isItalic?: boolean;
  };
  index: number;
  onClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const TextElement: React.FC<TextElementProps> = ({
  id,
  templateId,
  text,
  position,
  fontFamily,
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
  setGhostLines
}) => {
  const textRef = useRef<Konva.Text>(null);
  const padding = 2;

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = textRef.current;
    if (!node) return pos;

    const textWidth = node.width();
    const textHeight = node.height();
    const safeMargin = 24;

    const minX = cardBounds.x + safeMargin;
    const maxX = cardBounds.x + cardBounds.width - safeMargin - textWidth;
    const minY = cardBounds.y + safeMargin;
    const maxY = cardBounds.y + cardBounds.height - safeMargin - textHeight;

    const clampedX = Math.max(minX, Math.min(pos.x, maxX));
    const clampedY = Math.max(minY, Math.min(pos.y, maxY));

    if (setGhostLines) {
      setGhostLines({ x: clampedX, y: clampedY });
    }

    return { x: clampedX, y: clampedY };
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    
    const absPos = textRef.current?.getAbsolutePosition();
    if (absPos) {
      console.log('Editing:', text, absPos);
      onEdit(text, position)
    }

    if (onClick) {
      console.log('Calling external onClick');
      onClick(e);
    }
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const textWidth = node.width();
    const textHeight = node.height();

    const minX = cardBounds.x + padding;
    const maxX = cardBounds.x + cardBounds.width - textWidth - padding;
    const minY = cardBounds.y + padding;
    const maxY = cardBounds.y + cardBounds.height - textHeight - padding;

    const clampedX = Math.max(minX, Math.min(node.x(), maxX));
    const clampedY = Math.max(minY, Math.min(node.y(), maxY));

    node.position({ x: clampedX, y: clampedY });
    node.getLayer()?.batchDraw();

    onUpdate({ id, text, position: { x: clampedX, y: clampedY } });

    if (setGhostLines) {
      setGhostLines({});
    }
  };

  return (
    <Group>
   <SelectionFrame
    x={position.x}
    y={position.y}
    width={textRef.current?.width() ?? 0}
    height={textRef.current?.height() ?? 0}
    selected={!!selected} // ← this guarantees a boolean
   />

    <Text
      ref={textRef}
      text={text}
      x={position.x}
      y={position.y}
      fontSize={size}
      fontFamily={fontFamily}
      fontStyle={fontStyle}
      fill={color}
      draggable
      onClick={handleClick}
      dragBoundFunc={dragBoundFunc}
      onDragEnd={handleDragEnd}
      cursor={selected ? 'move' : 'default'}
      
    />
  </Group>
  
  
  );
};

export default TextElement;
