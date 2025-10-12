

export const getZoomAwareDragBoundFunc = (
    canvasBounds: { x: number; y: number; width: number; height: number },
    elementSize: { width: number; height: number },
    zoom: number,
    padding = 24
  ) => {
    return (pos: { x: number; y: number }) => {
      const scaledWidth = elementSize.width * zoom;
      const scaledHeight = elementSize.height * zoom;
  
      const minX = canvasBounds.x + padding;
      const maxX = canvasBounds.x + canvasBounds.width - scaledWidth - padding;
      const minY = canvasBounds.y + padding;
      const maxY = canvasBounds.y + canvasBounds.height - scaledHeight - padding;
  
      return {
        x: Math.max(minX, Math.min(pos.x, maxX)),
        y: Math.max(minY, Math.min(pos.y, maxY))
      };
    };
  };
  