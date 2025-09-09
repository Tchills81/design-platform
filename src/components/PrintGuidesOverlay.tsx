import { Rect } from "react-konva";

interface PrintGuidesOverlayProps {
  cardX: number;
  cardY: number;
  cardWidth: number;
  cardHeight: number;
  bleed?: number;
  safeZone?: number;
  visible?: boolean;
}

export const PrintGuidesOverlay: React.FC<PrintGuidesOverlayProps> = ({
  cardX,
  cardY,
  cardWidth,
  cardHeight,
  bleed = 36,
  safeZone = 24,
  visible = true
}) => {
  if (!visible) return null;

  return (
    <>
      {/* Bleed Boundary */}
      <Rect
        x={cardX - bleed}
        y={cardY - bleed}
        width={cardWidth + bleed * 2}
        height={cardHeight + bleed * 2}
        stroke="blue"
        strokeWidth={1}
        dash={[4, 4]}
        listening={false}
      />

      {/* Trim Line */}
      <Rect
        x={cardX}
        y={cardY}
        width={cardWidth}
        height={cardHeight}
        stroke="red"
        strokeWidth={1}
        dash={[6, 4]}
        listening={false}
      />

      {/* Safe Zone */}
      <Rect
        x={cardX + safeZone}
        y={cardY + safeZone}
        width={cardWidth - safeZone * 2}
        height={cardHeight - safeZone * 2}
        stroke="green"
        strokeWidth={1}
        dash={[2, 2]}
        listening={false}
      />
    </>
  );
};
