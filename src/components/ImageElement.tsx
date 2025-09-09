import React, { useRef, useEffect } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import { KonvaEventObject } from 'konva/lib/Node';

interface ImageElementProps {
  id: string;
  templateId: string;
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  tone?: string;
  isSelected: boolean;
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
  isSelected,
  containerRef,
  stageRef,
  canvasBounds,
  onSelect,
  handleImageUpdate,
  setGhostLines
}) => {
  const imageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [image] = useImage(src);
  const padding = 2;
  const gridSpacing = 50;

  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

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

    const snappedX = snapToGrid(node.x());
    const snappedY = snapToGrid(node.y());

    const clampedX = Math.max(box.x + padding, Math.min(snappedX, box.x + box.width - node.width() - padding));
    const clampedY = Math.max(box.y + padding, Math.min(snappedY, box.y + box.height - node.height() - padding));

    node.position({ x: clampedX, y: clampedY });
    node.getLayer()?.batchDraw();

    if(setGhostLines)
      setGhostLines({});

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
      <Image
        ref={imageRef}
        image={image}
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        onClick={onSelect}
        draggable
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && <Transformer ref={transformerRef} />}
    </>
  );
};

export default ImageElement;
