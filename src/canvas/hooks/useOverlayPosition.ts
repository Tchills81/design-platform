import { useCallback } from 'react';
import Konva from 'konva';

type OverlayPositionParams = {
  textNode: Konva.Text;
  stageRef: React.RefObject<Konva.Stage>;
  zoom: number;
  tabActive: boolean;
  offset?: number; // optional per call
};

export function useOverlayPosition() {
  return useCallback(
    ({ textNode, stageRef, zoom, tabActive, offset = 0 }: OverlayPositionParams): { x: number; y: number } => {
      const stage = stageRef.current;
      if (!stage || !textNode || !textNode.getAbsolutePosition) return { x: 0, y: 0 };

      const scale = stage.scaleX(); // assuming uniform scale
      const stagePos = stage.position();
      const nodePos = textNode.getAbsolutePosition();

      let x = nodePos.x * scale + stagePos.x;
      let y = nodePos.y * scale + stagePos.y;

      if (tabActive) {
        x += offset;
      }

      return { x, y };
    },
    []
  );
}
