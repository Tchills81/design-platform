import React, { useRef, useEffect } from 'react';
import { Image as KonvaImage, Rect, Circle, Line, Transformer } from 'react-konva';
import useImage from 'use-image';
import { KonvaEventObject } from 'konva/lib/Node';
import SelectionFrame from './SelectionFrame';
import { DesignElement } from '../types/DesignElement';
import Konva from 'konva';
import { TemplateElement } from '../types/template';
import { supportedShapes } from './elements/shapeRegistry';
import { tone } from '../types/tone';
import { toneColorMap } from '../types/tone';

interface ImageElementProps {
  id: string;
  templateId: string;
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zoom: number;
  tone: tone;
  isSelected: boolean;
  showTransformer?: boolean;
  transformModeActive?: boolean;
  selectedImageId?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<any>;
  element:TemplateElement;
  
  canvasBounds: { x: number; y: number; width: number; height: number };
  handleImageUpdate: (e: KonvaEventObject<Event>, id: string) => void;
  setGhostLines?: (lines: { x?: number; y?: number }) => void;
  onSelect: () => void;
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
  element,
  tone
}) => {
  const internalRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<any>(null);
  const [image] = useImage(src);
  const padding = 2;
  const gridSpacing = 50;

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

  const handleOnSelect = () => {
    if (setSelectedRef) setSelectedRef(internalRef.current);

    console.log('setSelectedRef', setSelectedRef);
    onSelect();
  };

  const handleTransformEnd = () => {
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
        height: () => node.height()
      }
    } as KonvaEventObject<Event>, id);
  };

  const handleDragMove = (e: any) => {
    const node = e.target;
    const box = canvasBounds;

    const newX = Math.max(box.x + padding, Math.min(node.x(), box.x + box.width - node.width() - padding));
    const newY = Math.max(box.y + padding, Math.min(node.y(), box.y + box.height - node.height() - padding));

    node.x(newX);
    node.y(newY);

    const snappedX = Math.round(newX / gridSpacing) * gridSpacing;
    const snappedY = Math.round(newY / gridSpacing) * gridSpacing;

    if (setGhostLines) setGhostLines({ x: snappedX, y: snappedY });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const box = canvasBounds;

    const imageWidth = node.width();
    const imageHeight = node.height();
    const safeMargin = 24;

    const minX = box.x + safeMargin;
    const maxX = box.x + box.width - safeMargin - imageWidth;
    const minY = box.y + safeMargin;
    const maxY = box.y + box.height - safeMargin - imageHeight;

    const rawX = node.x();
    const rawY = node.y();

    const clampedX = Math.max(minX, Math.min(rawX, maxX));
    const clampedY = Math.max(minY, Math.min(rawY, maxY));

    node.position({ x: clampedX, y: clampedY });
    node.getLayer()?.batchDraw();

    if (setGhostLines) setGhostLines({});

    handleImageUpdate({
      target: {
        x: () => clampedX,
        y: () => clampedY,
        width: () => node.width(),
        height: () => node.height()
      }
    } as KonvaEventObject<Event>, id);
  };



  const sharedProps = {
    ref: internalRef,
    onClick: handleOnSelect,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    cursor: isSelected ? 'move' : 'default',
    isSelected,
    zoom,
    fillColor: element.type=='shape'? element.fill:"#ffffff", // or from color picker state
    showTransformer
  };


  const shapeMeta = element.type === 'shape' ? supportedShapes[element.shapeType] : null;
  const offset = internalRef.current && shapeMeta?.getAnchorOffset
  ? shapeMeta.getAnchorOffset(internalRef.current)
  : { x: 0, y: 0 };

  
  
  

  return (
    <>
    <SelectionFrame
  x={position.x}
  y={position.y}
  width={size.width}
  height={size.height}
  selected={isSelected}
  shapeType={element.type === 'shape' ? element.shapeType : undefined}
  refNode={internalRef.current}
  tone={tone}
/>

      {element.type === 'shape' &&
      element.shapeType &&
      supportedShapes[element.shapeType] ? (
        supportedShapes[element.shapeType].render(
          {
            ...element,
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height
          },
          sharedProps
        )
      ) : (
        <KonvaImage
          ref={internalRef}
          image={image}
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          onClick={handleOnSelect}
          draggable={zoom === 1}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          cursor={isSelected ? 'move' : 'default'}
          stroke={showTransformer && isSelected ? '#00f0ff' : undefined}
          strokeWidth={showTransformer ? 2 : 0}
          shadowColor={showTransformer ? '#00f0ff' : undefined}
          shadowBlur={showTransformer ? 10 : 0}
        />
      )}
  
      {isSelected && showTransformer && <Transformer ref={transformerRef} />}
    </>
  );
  
};

export default ImageElement;
