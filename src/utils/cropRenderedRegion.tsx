import Konva from "konva";

type CropRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function cropRenderedRegion(
  layer: Konva.Layer | Konva.Stage,
  cropRegion: CropRegion
): string | null {
  if (!layer) return null;

  try {
    return layer.toDataURL({
      x: cropRegion.x,
      y: cropRegion.y,
      width: cropRegion.width,
      height: cropRegion.height,
      mimeType: "image/png",
      pixelRatio: 1, // You can bump this for higher resolution
    });
  } catch (err) {
    console.warn("Failed to crop rendered region:", err);
    return null;
  }
}
