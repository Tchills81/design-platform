import React, { useState, useRef } from 'react';
import { Rect } from 'react-konva';

type CropDragOverlayProps = {
  isActive: boolean;
  tone?: string;
  onComplete: (region: { x: number; y: number; width: number; height: number }) => void;
};

export  const CropDragOverlay: React.FC<CropDragOverlayProps> = ({ isActive, onComplete }) => {
  const [region, setRegion] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: any) => {
    if (!isActive) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    startPoint.current = { x, y };
    setRegion({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: any) => {
    if (!isActive || !startPoint.current) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    const dx = x - startPoint.current.x;
    const dy = y - startPoint.current.y;

    setRegion({
      x: dx < 0 ? x : startPoint.current.x,
      y: dy < 0 ? y : startPoint.current.y,
      width: Math.abs(dx),
      height: Math.abs(dy),
    });
  };

  const handleMouseUp = () => {
    if (region) onComplete(region);
    startPoint.current = null;
  };

  return (
    <>
      {region && (
        <Rect
          {...region}
          stroke="#8B5CF6"
          strokeWidth={2}
          dash={[6, 4]}
          listening={false}
        />
      )}
    </>
  );
};
