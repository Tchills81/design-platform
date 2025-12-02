import { useCallback } from 'react';
import Konva from 'konva';
import { TemplateElement } from '@/src/types/template';
import { SidebarTab } from '@/src/types/Tab';

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


export function useUnifiedOverlayPosition(
  selectedElement: TemplateElement | null,
  domPos?: { x: number; y: number } | null,
  inputPosition?: { x: number; y: number } | null,
  boundingBox?: { stage: { x: number; y: number } } | null,


) {

 
  if (!selectedElement) return { x: 0, y: 0 };

  switch (selectedElement.type) {
    case "image":
      return domPos ?? { x: 0, y: 0 };
    case "text":
      return inputPosition ?? { x: 0, y: 0 };
    case "group":
      return boundingBox?.stage ?? { x: 0, y: 0 };
    default:
      return selectedElement.position ?? { x: 0, y: 0 };
  }
}

