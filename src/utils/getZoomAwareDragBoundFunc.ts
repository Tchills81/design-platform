export const getZoomAwareDragBoundFunc = (
  canvasBounds: { x: number; y: number; width: number; height: number },
  elementSize: { width: number; height: number },
  zoom: number,
  padding = 24,
  isIsolationMode = false
) => {
  return (pos: { x: number; y: number }) => {
    // Always scale the element size by zoom
    const scaledWidth = elementSize.width * zoom;
    const scaledHeight = elementSize.height * zoom;

    // Bounds width/height: scale only if not in isolation mode
    const boundsWidth = isIsolationMode ? canvasBounds.width : canvasBounds.width * zoom;
    const boundsHeight = isIsolationMode ? canvasBounds.height : canvasBounds.height * zoom;

    const minX = canvasBounds.x + padding;
    const maxX = canvasBounds.x + (boundsWidth - scaledWidth - padding);
    const minY = canvasBounds.y + padding;
    const maxY = canvasBounds.y + boundsHeight - scaledHeight - padding;

    return {
      x: Math.max(minX, Math.min(pos.x, maxX)),
      y: Math.max(minY, Math.min(pos.y, maxY)),
    };
  };
};
