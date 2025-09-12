import { Rect } from 'react-konva';

interface SelectionFrameProps {
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
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
  cornerRadius = 4
}) => {
  if (!selected) return null;

  return (
    <Rect
      x={x - padding}
      y={y - padding}
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

