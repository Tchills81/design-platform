import React, { useRef, useEffect } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { KonvaEventObject } from 'konva/lib/Node';
import SelectionFrame from './SelectionFrame';
import Konva from 'konva';
import { DualTemplate, TemplateElement } from '../types/template';
import { supportedShapes } from './elements/shapeRegistry';
import { tone } from '../types/tone';
import { getZoomAwareDragBoundFunc } from '../utils/getZoomAwareDragBoundFunc';
import { useSelectedElementLock } from '../canvas/hooks/useElementLock';

interface ImageElementProps {
  id: string;
  templateId: string;
  template:DualTemplate | null;
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zoom: number;
  tone: tone;
  side: 'front' | 'back';
  isSelected: boolean;
  showTransformer?: boolean;
  isIsolationMode?:boolean;
  transformModeActive?: boolean;
  selectedImageId?: string;
  grouped?:boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<any>;
  element: TemplateElement;
  canvasBounds: { x: number; y: number; width: number; height: number };
  handleImageUpdate: (e: KonvaEventObject<Event>, id: string) => void;
  setGhostLines?: (lines: { x?: number; y?: number }) => void;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  forwardedRef?: React.RefObject<Konva.Image | null>;
  setSelectedRef?: (ref: Konva.Image | null) => void;
}

const ImageElement: React.FC<ImageElementProps> = ({
  id,
  src,
  position,
  size,
  zoom,
  isSelected,
  containerRef,
  stageRef,
  canvasBounds,
  onSelect,
  handleImageUpdate,
  setGhostLines,
  showTransformer = false,
  transformModeActive,
  selectedImageId,
  forwardedRef,
  setSelectedRef,
  grouped,
  isIsolationMode,
  element,
  template,
  side,
  tone,
}) => {
  const internalRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<any>(null);
  const [image] = useImage(src);
  const padding = 2;
  const gridSpacing = 50;

  // ✅ Lock state
  const {
    isPositionLocked,
    isFullyLocked,
    isReplaceOnly,
    isStyleLocked,
  } = useSelectedElementLock({
    selectedImageId: id,
    selectedTextId: '',
    template: template,
    side: side,
  });

  // ✅ Track last snapped ghost line values
  const lastSnapped = useRef<{ x?: number; y?: number }>({});

  useEffect(() => {
    if (isSelected && forwardedRef) {
      forwardedRef.current = internalRef.current;
    }
  }, [isSelected, forwardedRef]);

  useEffect(() => {
    if (isSelected && showTransformer && transformerRef.current && internalRef.current) {
      transformerRef.current.nodes([internalRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, showTransformer]);

  const handleOnSelect = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isFullyLocked) return; // 🚫 block selection if fully locked
    if (setSelectedRef) setSelectedRef(internalRef.current);
    onSelect(e);
  };

  const handleTransformEnd = () => {
    if (isFullyLocked || isReplaceOnly || isStyleLocked) return; // 🚫 block transform if locked
    const node = internalRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const originalWidth = node.width();
    const originalHeight = node.height();

    node.scaleX(1);
    node.scaleY(1);
    node.width(originalWidth * scaleX);
    node.height(originalHeight * scaleY);

    handleImageUpdate({
      target: {
        x: () => node.x(),
        y: () => node.y(),
        width: () => node.width(),
        height: () => node.height(),
      },
    } as KonvaEventObject<Event>, id);
  };

  const handleDragMove = (e: any) => {
    if (isPositionLocked || isFullyLocked || isReplaceOnly) return; // 🚫 enforce lock
    const node = e.target;
  
    // Position is already clamped by dragBoundFunc
    const newX = node.x();
    const newY = node.y();
  
    // Snap to grid
    const snappedX = Math.round(newX / gridSpacing) * gridSpacing;
    const snappedY = Math.round(newY / gridSpacing) * gridSpacing;
  
    if (
      setGhostLines &&
      (snappedX !== lastSnapped.current.x || snappedY !== lastSnapped.current.y)
    ) {
      lastSnapped.current = { x: snappedX, y: snappedY };
      setGhostLines({ x: snappedX, y: snappedY });
    }
  };
  
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (isPositionLocked || isFullyLocked || isReplaceOnly) return; // 🚫 enforce lock
    const node = e.target;
  
    // Position is already clamped by dragBoundFunc
    const clampedX = node.x();
    const clampedY = node.y();
  
    node.getLayer()?.batchDraw();
  
    if (setGhostLines) setGhostLines({});
  
    handleImageUpdate({
      target: {
        x: () => clampedX,
        y: () => clampedY,
        width: () => node.width(),
        height: () => node.height(),
      },
    } as KonvaEventObject<Event>, id);
  };


  
  const dragBoundFunc = getZoomAwareDragBoundFunc(canvasBounds, size, zoom, 2, isIsolationMode);
  

  // ✅ Shared props with lock booleans applied
  const sharedProps = {
    ref: internalRef,
    onClick: handleOnSelect,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    cursor: isSelected && !isFullyLocked ? 'move' : 'default',
    isSelected,
    zoom,
    fillColor: element.type === 'shape' ? element.fill : '#ffffff',
    showTransformer,
    dragBoundFunc,
    draggable: !isPositionLocked && !isFullyLocked && !isReplaceOnly, // ✅ lock-aware
  };

  const shapeMeta = element.type === 'shape' ? supportedShapes[element.shapeType] : null;

  return (
    <>
    <SelectionFrame
    x={position.x}
    y={position.y}
    width={size.width}
    height={size.height}
    selected={isSelected}
     />
 
      {element.type === 'shape' &&
      element.shapeType &&
      shapeMeta ? (
        shapeMeta.render(
          {
            ...element,
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height,
          },
          sharedProps
        )
      ) : (
        <KonvaImage
          id={id}
          ref={internalRef}
          image={image}
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          onClick={handleOnSelect}
          draggable={!isPositionLocked && !isFullyLocked && !isReplaceOnly}
          dragBoundFunc={dragBoundFunc}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          cursor={isSelected && !isFullyLocked ? 'move' : 'default'}
          stroke={showTransformer && isSelected ? '#00f0ff' : undefined}
          strokeWidth={showTransformer ? 2 : 0}
          shadowColor={showTransformer ? '#00f0ff' : undefined}
          shadowBlur={showTransformer ? 10 : 0}
        />
      )}

      {isSelected && showTransformer && !grouped &&  <Transformer ref={transformerRef} />}
      {isSelected && isIsolationMode && grouped &&  <Transformer ref={transformerRef} />}
    </>
  );
};

export default ImageElement;
