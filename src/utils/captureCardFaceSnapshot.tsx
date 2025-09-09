import Konva from "konva";

interface SnapshotOptions {
  stageRef: React.RefObject<Konva.Stage>;
  bounds: { x: number; y: number; width: number; height: number };
  pixelRatio?: number;
  bleed?: number; // bleed in pixels (e.g. 36px for 3mm at 300 PPI)
}

export const captureCardFaceSnapshot = ({
  stageRef,
  bounds,
  pixelRatio = 2,
  bleed = 36
}: SnapshotOptions): string | null => {
  const stage = stageRef.current;
  if (!stage) return null;

  const originalScale = stage.scaleX();
  const originalPosition = stage.position();

  // Reset transform
  stage.scale({ x: 1, y: 1 });
  stage.position({ x: 0, y: 0 });
  stage.batchDraw();

  // Expand bounds to include bleed
  const bleedBounds = {
    x: bounds.x - bleed,
    y: bounds.y - bleed,
    width: bounds.width + bleed * 2,
    height: bounds.height + bleed * 2
  };

  // Capture snapshot with bleed
  const dataUrl = stage.toDataURL({
    pixelRatio,
    ...bleedBounds
  });

  // Restore transform
  stage.scale({ x: originalScale, y: originalScale });
  stage.position(originalPosition);
  stage.batchDraw();

  return dataUrl;
};
