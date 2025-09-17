import React, { useRef, useEffect } from 'react';
import { Rect, Transformer, Circle } from 'react-konva';
import Konva from 'konva';

type CropRegion = { x: number; y: number; width: number; height: number };

type CropBoxProps = {
  cropRegion: CropRegion;
  onUpdate: (region: CropRegion) => void;
  isLocked?: boolean;
  imageNode?: Konva.Image | null;
};

export const CropBoxOverlay: React.FC<CropBoxProps> = ({
  cropRegion,
  onUpdate,
  isLocked,
  imageNode,
}) => {
  const rectRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const handleRef = useRef<Konva.Circle>(null);
  const [isHandleHovered, setIsHandleHovered] = React.useState(false);


  const handleTransformLive = () => {
    const node = rectRef.current;
    const handle = handleRef.current;
    if (!node || !handle) return;
  
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
  
    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;
    const newX = node.x();
    const newY = node.y();
  
    handle.x(newX + newWidth / 2);
    handle.y(newY - 10);
    handle.getLayer()?.batchDraw();
  };
  


  // Sync crop box to image position
  useEffect(() => {
    if (imageNode) {
      const box = imageNode.getClientRect();
      onUpdate({
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      });
    }
  }, [imageNode]);

  // Attach transformer to crop box
  useEffect(() => {
    if (transformerRef.current && rectRef.current) {
      transformerRef.current.nodes([rectRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [cropRegion]);

  const handleTransformEnd = () => {
    const node = rectRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;

    node.scaleX(1);
    node.scaleY(1);

    onUpdate({
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
    });
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const dx = e.target.x() - cropRegion.x - cropRegion.width / 2;
    const dy = e.target.y() - cropRegion.y - 10;

    onUpdate({
      ...cropRegion,
      x: cropRegion.x + dx,
      y: cropRegion.y + dy,
    });
  };

  return (
    <>
    <Rect
  ref={rectRef}
  x={cropRegion.x}
  y={cropRegion.y}
  width={cropRegion.width}
  height={cropRegion.height}
  stroke="#8B5CF6"
  strokeWidth={2}
  dash={[6, 4]}
  draggable={false}
  onTransform={handleTransformLive}
  onTransformEnd={handleTransformEnd}
/>
      <Transformer
        ref={transformerRef}
        boundBoxFunc={(oldBox, newBox) => {
          if (isLocked) {
            const aspect = oldBox.width / oldBox.height;
            return {
              ...newBox,
              height: newBox.width / aspect,
            };
          }
          return newBox;
        }}
        rotateEnabled={false}
        anchorSize={8}
      />
   <Circle
  ref={handleRef}
  x={cropRegion.x + cropRegion.width / 2}
  y={cropRegion.y - 10}
  radius={10}
  fill="#8B5CF6"
  stroke="#fff"
  strokeWidth={1}
  draggable
  onMouseEnter={() => setIsHandleHovered(true)}
  onMouseLeave={() => setIsHandleHovered(false)}
  onDragMove={(e) => {
    const dx = e.target.x() - (cropRegion.x + cropRegion.width / 2);
    const dy = e.target.y() - (cropRegion.y - 10);

    onUpdate({
      ...cropRegion,
      x: cropRegion.x + dx,
      y: cropRegion.y + dy,
    });
  }}
  dragBoundFunc={(pos) => ({ x: pos.x, y: pos.y })}
/>


    </>
  );
};
