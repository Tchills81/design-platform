import React, { useEffect, useRef } from "react";
import { Rect } from "react-konva";
import Konva from "konva";

type GlowOverlayProps = {
  cardBounds: { x: number; y: number; width: number; height: number };
  zoom: number;
  isActive: boolean; // whether to show glow
};

export const GlowOverlay: React.FC<GlowOverlayProps> = ({
  cardBounds,
  zoom,
  isActive,
}) => {
  const glowRef = useRef<Konva.Rect>(null);

  // Animate when active
  useEffect(() => {
    if (isActive && glowRef.current) {
      const tween = new Konva.Tween({
        node: glowRef.current,
        duration: 0.8,
        strokeWidth: 6,
        opacity: 0.5,
        easing: Konva.Easings.EaseInOut,
        yoyo: true,
        repeat: Infinity,
      });
      tween.play();

      return () => {
        tween.destroy();
      };
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <Rect
      ref={glowRef}
      x={cardBounds.x}
      y={cardBounds.y}
      width={cardBounds.width * zoom}
      height={cardBounds.height * zoom}
      stroke="dodgerblue"
      strokeWidth={2}
      opacity={1}
      dash={[8, 4]}
      listening={false} // purely visual
    />
  );
};
