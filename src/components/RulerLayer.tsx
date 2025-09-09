import { Line, Text } from 'react-konva';

type Props = {
  width: number;
  height: number;
  spacing?: number;
  tone?: string;
  zoom: number;
};

export default function RulerLayer({ width=window.innerWidth, height=window.innerHeight, spacing = 50, tone = 'neutral', zoom = 1 }: Props) {
  const baseSpacing = spacing;
  const scaledSpacing = baseSpacing * zoom;

  const horizontalTicks = Array.from(
    { length: Math.ceil(width / scaledSpacing) + 1 },
    (_, i) => i * scaledSpacing
  );

  const verticalTicks = Array.from(
    { length: Math.ceil(height / scaledSpacing) + 1 },
    (_, i) => i * scaledSpacing
  );

  const toneColors: Record<string, string> = {
    warm: '#b8860b',
    reflective: '#4682b4',
    minimal: '#999999',
    neutral: '#666666'
  };

  const strokeColor = toneColors[tone] ?? '#666666';

  return (
    <>
      {/* Horizontal ruler */}
      {horizontalTicks.map((x) => (
        <Line key={`h-${x}`} points={[x, 0, x, 10]} stroke={strokeColor} />
      ))}
      {horizontalTicks.map((x) => (
        <Text
          key={`ht-${x}`}
          x={x + 2}
          y={12}
          text={`${Math.round(x / zoom)}`}
          fontSize={10}
          fill={strokeColor}
        />
      ))}

      {/* Vertical ruler */}
      {verticalTicks.map((y) => (
        <Line key={`v-${y}`} points={[0, y, 10, y]} stroke={strokeColor} />
      ))}
      {verticalTicks.map((y) => (
        <Text
          key={`vt-${y}`}
          x={12}
          y={y + 2}
          text={`${Math.round(y / zoom)}`}
          fontSize={10}
          fill={strokeColor}
        />
      ))}
    </>
  );
}
