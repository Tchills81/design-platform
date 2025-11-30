'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Text, Group } from 'react-konva';
import Konva from 'konva';
import { DualTemplate } from '../types/template';
import { getZoomAwareDragBoundFunc } from '../utils/getZoomAwareDragBoundFunc';
import { useSelectedElementLock } from '../canvas/hooks/useElementLock';
import { LockType } from '../types/access';
import { KonvaEventObject } from 'konva/lib/Node';
import { BoundsRect } from '../canvas/store/useContextStore';

interface TextElementProps {
  id: string;
  templateId: string;
  template: DualTemplate;
  currentLock?: LockType;
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
  grouped?:boolean;
  isIsolationMode?:boolean;
  transformModeActive?: boolean;
  cardBounds: { x: number; y: number; width: number; height: number } | BoundsRect;
  onUpdate: (updated: { id: string; text: string; position: { x: number; y: number } }) => void;
  onEdit: (text: string, position: { x: number; y: number }, align: 'left' | 'center' | 'right') => void;
  setGhostLines?: (lines: { x?: number; y?: number }) => void;
  index: number;
  onClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  setKonvaText: (k: Konva.Text | null) => void;
  konvaText: Konva.Text | null;
  zoom: number;
  selectedIds?: string[];
 
  // Selection context
  selectedTextId?: string | null;
  selectedImageId?: string | null;
  side: 'front' | 'back';
}

const TextElement: React.FC<TextElementProps> = ({
  id,
  template,
  text,
  position,
  fontFamily,
  textAlign,
  fontStyle,
  size,
  color,
  selected,
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
  selectedTextId,
  selectedImageId,
  side,
  currentLock,
  selectedIds,
  grouped,
  isIsolationMode,
}) => {
  const textRef = useRef<Konva.Text>(null);
  const padding = 2;

  // ✅ Live lock state from hook
  const {
    currentLock: liveCurrentLock,
    isPositionLocked,
    isFullyLocked,
    isReplaceOnly,
    isStyleLocked,
  } = useSelectedElementLock({
    selectedImageId,
    selectedTextId: id,
    template,
    side,
  });

  // ✅ Effective lock (prop override or hook)
  const effectiveLock = currentLock ?? liveCurrentLock;

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isFullyLocked) return; // 🚫 block clicks if fully locked
    if (isReplaceOnly) {
      // ✅ allow editing text content only
      //onEdit(text, position, textAlign);
      return;
    }
    const absPos = textRef.current?.getAbsolutePosition();
    if (absPos) {
     // onEdit(text, position, textAlign);
    }
    //if (onClick) onClick(e);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {

    console.log('handleDragEnd... beeing called ')
    if (isPositionLocked || isFullyLocked || isReplaceOnly) return; // 🚫 enforce lock
  
    const node = e.target;
  
    // Position is already clamped by dragBoundFunc
    const clampedX = node.x();
    const clampedY = node.y();
  
    node.getLayer()?.batchDraw();
  
    onUpdate({ id, text, position: { x: clampedX, y: clampedY } });
  
    if (setGhostLines) {
      setGhostLines({});
    }
  };
  
  const dragBoundFunc = useMemo(() => {
    const width = textRef.current?.width() ?? 0;
    const height = textRef.current?.height() ?? 0;
  
    return getZoomAwareDragBoundFunc(cardBounds, { width, height }, zoom, 2, isIsolationMode);
  }, [cardBounds, zoom, textRef.current?.width(), textRef.current?.height()]);
  

  useEffect(() => {
    if (
      selected &&
      textRef.current instanceof Konva.Text &&
      textRef.current !== konvaText
    ) {
      const node = textRef.current;

      // ✅ Hydrate attributes
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


  //const isSelected = selectedIds.includes(id);

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
        draggable={!isPositionLocked && !isFullyLocked && !isReplaceOnly}
        onClick={handleClick}
        onDragEnd={handleDragEnd}
        dragBoundFunc={dragBoundFunc}
        cursor={selected && !isFullyLocked ? 'move' : 'default'}
        wrap={isMultiline ? 'word' : 'none'}
        width={isMultiline ? textWidth ?? 240 : undefined}
        height={isMultiline ? textHeight ?? undefined : undefined}
        lineHeight={isMultiline ? lineHeight ?? 1 : undefined}
        textDecoration={isUnderline ? 'underline' : undefined}
        listening={(!grouped || isIsolationMode)}
      />
    </Group>
  );
};

export default TextElement;
