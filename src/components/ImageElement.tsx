import React, { useRef, useEffect } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import { KonvaEventObject } from 'konva/lib/Node';
import { Rect } from 'react-konva';
import SelectionFrame from './SelectionFrame';
import Konva from 'konva';
interface ImageElementProps {
  id: string;
  templateId: string;
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zoom:number;
  tone?: string;
  isSelected: boolean;
  showTransformer?: boolean;
  transformModeActive?:boolean;
  selectedImageId?:string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<any>;
  canvasBounds: { x: number; y: number; width: number; height: number };
  handleImageUpdate: (e: KonvaEventObject<Event>, id: string) => void;
  setGhostLines?: (lines: { x?: number; y?: number }) => void;
  onSelect: () => void;
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
}) => {
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<any>(null);
  const [image] = useImage(src);
  const padding = 2;
  const gridSpacing = 50;

  useEffect(() => {
    if (isSelected && showTransformer && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, showTransformer]);
  

  const snapToGrid = (value: number, spacing = gridSpacing) =>
    Math.round(value / spacing) * spacing;

  const handleTransformEnd = () => {
    const node = imageRef.current;
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


    console.log("ImageDrag", node.x(), node.y())

    node.x(newX);
    node.y(newY);


    const snappedX = Math.round(newX / 50) * 50;
    const snappedY = Math.round(newY / 50) * 50;

    if(setGhostLines)
      setGhostLines({ x: snappedX, y: snappedY });

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
  

  return (
    <>
    <SelectionFrame
      x={position.x}
      y={position.y}
      width={size.width}
      height={size.height}
      selected={isSelected}
    />

  
    <Image
      ref={imageRef}
      image={image}
      x={position.x}
      y={position.y}
      width={size.width}
      height={size.height}
      onClick={onSelect}
      draggable={zoom === 1}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      cursor={isSelected ? 'move' : 'default'}
      stroke={showTransformer && isSelected? '#00f0ff' : undefined}
      strokeWidth={showTransformer ? 2 : 0}
      shadowColor={showTransformer ? '#00f0ff' : undefined}
      shadowBlur={showTransformer ? 10 : 0}
/>
  
  {isSelected && showTransformer && <Transformer ref={transformerRef} />}
  </>
  
  );
};

export default ImageElement;
