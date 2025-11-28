import Konva from 'konva';
import { useMemo } from 'react';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Convert a stage-space bounding box into layer-local coordinates.
 */
function toLayerSpace(layer: Konva.Layer, stageBox: BoundingBox): BoundingBox {
  const inv = layer.getAbsoluteTransform().copy().invert();

  const topLeft = inv.point({ x: stageBox.x, y: stageBox.y });
  const bottomRight = inv.point({
    x: stageBox.x + stageBox.width,
    y: stageBox.y + stageBox.height,
  });

  return {
    x: topLeft.x,
    y: topLeft.y,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y,
  };
}

/**
 * Computes a combined bounding box from the given selectedIds.
 * Returns both stage-space (for marquee) and group-space (for group positioning).
 */
export function useBoundingBox(
  stageRef: React.RefObject<Konva.Stage>,
  selectedIds: string[],
  layerRef?: React.RefObject<Konva.Layer>
): { stage: BoundingBox; group: BoundingBox } | null {
  return useMemo(() => {
    if (!stageRef.current || selectedIds.length < 1) return null;

    // Collect bounding boxes in stage coordinates
    const boxes = selectedIds
      .map((id) => stageRef.current!.findOne(`#${id}`)?.getClientRect())
      .filter(Boolean) as BoundingBox[];

    if (boxes.length === 0) return null;

    // Union of all boxes in stage coordinates
    const stageBox = boxes.reduce(
      (acc, box) => ({
        x: Math.min(acc.x, box.x),
        y: Math.min(acc.y, box.y),
        width:
          Math.max(acc.x + acc.width, box.x + box.width) -
          Math.min(acc.x, box.x),
        height:
          Math.max(acc.y + acc.height, box.y + box.height) -
          Math.min(acc.y, box.y),
      }),
      boxes[0]
    );

    // Transform only for group
    const groupBox =
      layerRef?.current ? toLayerSpace(layerRef.current, stageBox) : stageBox;

    return { stage: stageBox, group: groupBox };
  }, [selectedIds, layerRef]);
}
