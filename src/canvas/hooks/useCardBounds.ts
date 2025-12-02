import { useMemo } from "react";

import { DualTemplate } from "@/src/types/template";
import { SidebarTab } from "@/src/types/Tab";

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
  
}

/**
 * Computes safe card bounds for drag logic.
 * - Uses raw template/card dimensions (unscaled).
 * - Applies zoom only when subtracting element size in dragBoundFunc.
 * - Guarantees non-zero bounds even if template is not hydrated yet.
 */
export function useCardBounds(
  template: DualTemplate | null | undefined,
  card: { width: number; height: number },
  zoom: number,
  position:{x:number, y: number},
  activeTab:SidebarTab
  
): Bounds {
  return useMemo(() => {
    const safeZoom = zoom || 1;

    const rawWidth = template?.width ?? card.width;
    const rawHeight = template?.height ?? card.height;
    console.log('position', position)

    return {
      x: position.x,
      y: position.y,
      width: rawWidth,   // keep raw units
      height: rawHeight, // keep raw units
    };
  }, [template?.width, template?.height, card.width, card.height, zoom, position.x, position.y, activeTab]);
}

