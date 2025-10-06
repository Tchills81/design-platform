import { Rect } from 'react-konva';
import Konva from 'konva';
import { supportedShapes } from './elements/shapeRegistry';

interface SelectionFrameProps {
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
  shapeType?: string;
  refNode?: Konva.Node | null;
  padding?: number;
  stroke?: string;
  dash?: number[];
  cornerRadius?: number;
}

const SelectionFrame: React.FC<SelectionFrameProps> = ({
  x,
  y,
  width,
  height,
  selected,
  padding = 4,
  stroke = '#0078FF',
  dash = [4, 2],
  cornerRadius = 4,
  shapeType,
  refNode
}) => {
  if (!selected) return null;

  let offset = { x: 0, y: 0 };

  const shapeMeta = shapeType && supportedShapes[shapeType];
  if (
    shapeMeta &&
    typeof shapeMeta.getAnchorOffset === 'function' &&
    refNode
  ) {
    offset = shapeMeta.getAnchorOffset(refNode);
  }

  return (
    <Rect
      x={x + offset.x - padding}
      y={y + offset.y - padding}
      width={width + padding * 2}
      height={height + padding * 2}
      stroke={stroke}
      strokeWidth={1}
      dash={dash}
      cornerRadius={cornerRadius}
      listening={false}
    />
  );
};

export default SelectionFrame;
