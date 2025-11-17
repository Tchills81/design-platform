import Konva from "konva";

type ControlPositionFromDOMParams = {
    toolbarRef: React.RefObject<HTMLDivElement | null>;
    overlayWidth?: number;
    stageRef: React.RefObject<Konva.Stage>;
    zoom: number;
    tabActive: boolean;
    offset?: number;
    verticalOffset?: number;
  };
  
  export function computeOverlayControlPositionFromDOM({
    toolbarRef,
    overlayWidth = 120,
    stageRef,
    zoom,
    tabActive,
    offset = 0,
    verticalOffset = 48
  }: ControlPositionFromDOMParams): { x: number; y: number } {
    const stage = stageRef.current;
    const toolbarEl = toolbarRef.current;
  
    if (!stage || !toolbarEl) return { x: 0, y: 0 };
  
    const stageRect = stage.content.getBoundingClientRect();
    const toolbarRect = toolbarEl.getBoundingClientRect();
  
    const scale = stage.scaleX(); // assuming uniform
    const stagePos = stage.position();
  
    // Compute relative position of toolbar to stage
    const relativeX = (toolbarRect.left - stageRect.left) / window.devicePixelRatio;
    const relativeY = (toolbarRect.top - stageRect.top) / window.devicePixelRatio;
  
    // Convert to canvas space
    let x = relativeX * scale + stagePos.x + (toolbarRect.width - overlayWidth) / 2;
    let y = relativeY * scale + stagePos.y - verticalOffset;
  
    if (tabActive) {
      x += offset;
    }
  
    return { x, y };
  }
  