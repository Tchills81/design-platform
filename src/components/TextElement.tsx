'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Text, Group } from 'react-konva';
import Konva from 'konva';
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
  textHeight?: number;
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
  setKonvaText: (k: Konva.Text | null) => void;
  konvaText: Konva.Text | null;
  zoom: number;
  locked?: boolean;
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
  textHeight,
  lineHeight,
  setKonvaText,
  konvaText,
  zoom,
  locked,
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

  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (
      selected &&
      textRef.current instanceof Konva.Text &&
      textRef.current !== konvaText
    ) {
      const node = textRef.current;
  
      // ✅ Manually hydrate expected attributes
      node.setAttrs({
        align: node.attrs.align ?? 'left',
        lineHeight: node.attrs.lineHeight ?? 1.2,
        fontSize: node.attrs.fontSize ?? 16,
        fontFamily: node.attrs.fontFamily ?? 'Arial',
        text: node.attrs.text ?? '',
        width: node.attrs.width ?? 200,
        height: node.attrs.height ?? 100,
      });
  
      setKonvaText(node);
    }
  }, [selected, konvaText]);
  


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

        draggable={!locked}
        onClick={handleClick}
        onDragEnd={locked ? undefined : handleDragEnd}

        dragBoundFunc={dragBoundFunc}
       
        cursor={selected ? 'move' : 'default'}
        wrap={isMultiline ? 'word' : 'none'}
        width={isMultiline ? textWidth ?? 240 : undefined}
        height={isMultiline ? textHeight ?? undefined : undefined}
        lineHeight={isMultiline ? lineHeight ?? 1 : undefined}
        textDecoration={isUnderline ? 'underline' : undefined}
      />
    </Group>
  );
};

export default TextElement;
