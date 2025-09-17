import Konva from "konva";

type CropRegion = {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
export function cropImageFromNode(
    imageNode: Konva.Image,
    cropRegion: CropRegion,
    canvasOffset: { x: number; y: number } = { x: 0, y: 0 }
  ): string | null {
    if (!imageNode || !imageNode.image()) return null;
  
    const image = imageNode.image(); // HTMLImageElement or HTMLCanvasElement
  
    // Translate crop region from stage to image-local coordinates
    const imageX = imageNode.x();
    const imageY = imageNode.y();
    const localX = cropRegion.x;
    const localY = cropRegion.y;
  
    const { width, height } = cropRegion;
  
    // Create a temporary canvas
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = width;
    cropCanvas.height = height;
  
    const ctx = cropCanvas.getContext('2d');
    if (!ctx || !image) return null;
  
    // Draw the cropped region
    ctx.drawImage(
      image,
      localX,
      localY,
      width,
      height,
      0,
      0,
      width,
      height
    );
  
    // Return as dataURL (can also return cropCanvas if needed)
    return cropCanvas.toDataURL();
  }
  