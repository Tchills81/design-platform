import React, { useState, useRef } from 'react';
import { Rect } from 'react-konva';

type CropOverlayProps = {
  isActive: boolean;
  onCropRegionChange: (region: { x: number; y: number; width: number; height: number }) => void;
};

const CropOverlay: React.FC<CropOverlayProps> = ({ isActive, onCropRegionChange }) => {
  const [cropRegion, setCropRegion] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const isDragging = useRef(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: any) => {
    if (!isActive) return;
    isDragging.current = true;
    const { x, y } = e.target.getStage().getPointerPosition();
    startPoint.current = { x, y };
    setCropRegion({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging.current || !startPoint.current || !isActive) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    const dx = x - startPoint.current.x;
    const dy = y - startPoint.current.y;

    const region = {
      x: dx < 0 ? x : startPoint.current.x,
      y: dy < 0 ? y : startPoint.current.y,
      width: Math.abs(dx),
      height: Math.abs(dy),
    };

    setCropRegion(region);
    onCropRegionChange(region);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    startPoint.current = null;
  };

  return (
    <>
      {cropRegion && (
        <Rect
          {...cropRegion}
          stroke="blue"
          strokeWidth={2}
          dash={[6, 4]}
          listening={false}
        />
      )}
    </>
  );
};

export default CropOverlay;
