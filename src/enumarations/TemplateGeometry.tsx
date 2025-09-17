
import { TemplateSize } from "./TemplateSize";
export const TemplateGeometry: Record<TemplateSize, { width: number; height: number; defaultCellSize: number }> = {
    [TemplateSize.POSTCARD]: { width: 700, height: 400, defaultCellSize: 64 },
    [TemplateSize.GIFT_CARD_SMALL]: { width: 400, height: 250, defaultCellSize: 20 },
    [TemplateSize.POSTER_WIDE]: { width: 1000, height: 600, defaultCellSize: 80 },
  };


  export function inferCellSize(size: TemplateSize, gridColorsLength: number): number {
    const geometry = TemplateGeometry[size];
    if (!geometry) {
      console.warn(`⚠️ Unknown template size: ${size}`);
      return 32; // fallback default
    }
    const { width, height } = geometry;
    const estimated = Math.sqrt((width * height) / gridColorsLength);
    return Math.max(8, Math.floor(estimated));
  }

  
  export function getGeometry(size: TemplateSize) {
    return TemplateGeometry[size] ?? { width: 600, height: 400, defaultCellSize: 32 };
  }
  