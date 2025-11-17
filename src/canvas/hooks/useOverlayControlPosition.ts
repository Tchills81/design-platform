import Konva from 'konva';

type ControlPositionParams = {
  textNode?: Konva.Text;
  overlayWidth?: number;
  stageRef: React.RefObject<Konva.Stage>;
  zoom: number;
  tabActive: boolean;
  offset?: number;
  verticalOffset?: number;
};

export function computeOverlayControlPosition({
  textNode,
  overlayWidth = 120, // default width of control bar
  stageRef,
  zoom,
  tabActive,
  offset = 0,
  verticalOffset = 48
}: ControlPositionParams): { x: number; y: number } {
  const stage = stageRef.current;
  if (!stage || !textNode || !textNode.getAbsolutePosition) return { x: 0, y: 0 };

  const scale = stage.scaleX(); // assuming uniform scale
  const stagePos = stage.position();
  const nodePos = textNode.getAbsolutePosition();

  const textWidth = textNode.width() * scale;

  let x = nodePos.x * scale + stagePos.x + (textWidth - overlayWidth) / 2;
  let y = nodePos.y * scale + stagePos.y - verticalOffset;

  if (tabActive) {
    x += offset;
  }

  return { x, y };
}
