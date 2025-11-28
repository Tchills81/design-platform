import { useCallback } from "react";
import Konva from "konva";
import { DualTemplate } from "@/src/types/template";
import { useSelectedElement } from "@/src/components/elements/useSelectedElement";

type OverlayDomParams = {
  selectedImageId?: string | null;
  selectedTextId?: string | null; // ignored if element is not text
  selectedGroupId?: string | null;
  template: DualTemplate | null;
  side: "front" | "back";
  stageRef: React.RefObject<Konva.Stage>;
};

export function useOverlayDomPosition() {
  return useCallback(
    ({
      selectedImageId,
      selectedTextId,
      selectedGroupId,
      template,
      side,
      stageRef,
    }: OverlayDomParams) => {
      const { selectedElement } = useSelectedElement({
        selectedImageId: selectedImageId ?? null,
        selectedTextId: selectedTextId ?? null,
        selectedGroupId: selectedGroupId ?? null,
        template,
        side,
      });

      const stage = stageRef.current;
      if (!stage || !selectedElement) {
        return null;
      }

      // Ignore text here; text uses the existing useOverlayPosition hook
      if (selectedElement.type === "text") {
        return null;
      }

      // Find the actual Konva node by id
      const node = stage.findOne(`#${selectedElement.id}`);
      if (!node) return null;

      // Get absolute bounding box in stage coordinates
      const box = node.getClientRect({ relativeTo: stage });
      const containerRect = stage.container().getBoundingClientRect();

      return {
        x: containerRect.left + box.x,
        y: containerRect.top + box.y,
        width: box.width,
        height: box.height,
      };
    },
    []
  );
}
