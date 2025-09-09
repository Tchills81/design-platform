import Konva from 'konva';

export function getGlobalPosition(
  localPos: { x: number; y: number },
  stage: Konva.Stage,
  offsetY: number = 0
): { x: number; y: number } {
  const box = stage.container().getBoundingClientRect();
  return {
    x: box.left + localPos.x,
    y: box.top + localPos.y + offsetY
  };
}
