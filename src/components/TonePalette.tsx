// src/components/TonePalette.tsx
import { tone } from '@/src/types/tone';
import { palettes } from '@/src/types/tone';
interface TonePaletteProps {
  tone: tone;
  selectedColor: string;
  onSelect: (color: string) => void;
}

export default function TonePalette({ tone, selectedColor, onSelect }: TonePaletteProps) {
  
  const colors = palettes[tone] ?? palettes.minimal;

  return (
    <div className=" shadow-lg p-3 rounded  gap-2 animate-fadeIn">
      {colors.map(color => (
        <button
          key={color}
          className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
            selectedColor === color ? 'border-black scale-110' : 'border-transparent'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
}
