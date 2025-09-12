import Konva from 'konva';

export const getVisualBounds = (node: Konva.Node) => {
  if (!node) return null;

  const stage = node.getStage();
  const rect = stage
    ? node.getClientRect({ relativeTo: stage })
    : node.getClientRect(); // fallback to local space

  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  };
};



export const getLogicalState = (node: Konva.Node) => {
    if (!node) return null;
  
    return {
      x: node.x(),
      y: node.y(),
      width: node.width(),
      height: node.height(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation()
    };
  };
  