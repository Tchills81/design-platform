import { ELEMENT_LIBRARY } from '@/lib/elements';
import { DesignElement } from '../types/DesignElement';
import { JSX } from 'react';
import {
  Type,
  Shapes,
  Image as ImageIcon,
  Star,
  ArrowUpRight,
  Hexagon,
  CircleDot,
  LineChart,
  Square
} from 'lucide-react';
import { ToneButton } from './ToneButton';
import { tone } from '../types/tone';

export interface ElementPanelProps {
  tone:tone;
  onSelect: (element: DesignElement) => void;
}

// Icon mapping based on type or shapeType
const iconMap: Record<string, JSX.Element> = {
  text: <Type />,
  image: <ImageIcon />,
  rectangle: <Square />,
  circle: <CircleDot />,
  line: <LineChart />,
  star: <Star />,
  arrow: <ArrowUpRight />,
  regularPolygon: <Hexagon />,
  ring: <CircleDot />,
  shape: <Shapes /> // fallback for generic shapes
};

export default function ElementPanel({ onSelect, tone }: ElementPanelProps) {
  const grouped = ELEMENT_LIBRARY.reduce((acc, el) => {
    const key = el.type;
    acc[key] = acc[key] || [];
    acc[key].push(el);
    return acc;
  }, {} as Record<string, DesignElement[]>);

  return (
    <div className="overflow-y-auto max-h-full px-3 py-4 space-y-6">
      {Object.entries(grouped).map(([type, elements]) => (
        <div key={type}>
          <h3 className="text-sm font-medium mb-2 capitalize text-muted-foreground">
            {type}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {elements.map((el) => {
              const icon = iconMap[el.shapeType ?? el.type] ?? iconMap[type] ?? <Shapes />;
              return (
                <ToneButton
                  key={el.id}
                  icon={icon}
                  label={el.label}
                  onClick={() => onSelect(el)}
                  tone={tone}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
