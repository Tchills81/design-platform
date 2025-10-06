import {
  Brush,
  RotateCcw,
  Save,
  Palette,
  ArrowLeft,
  CreditCard,
  Sparkles,
  Paintbrush
} from 'lucide-react';
import { ToneButton } from './ToneButton';
import { tone } from '@/src/types/tone';

interface PaintingClusterProps {
  tone: tone;
  brushSize: number;
  onBrushSizeIncrease: () => void;
  onResetGrid: () => void;
  onSave: () => void;
  onOpenPalette: () => void;
  onBack: () => void;
  onToggleBackground: () => void; // Toggle dynamic background
  onExitCanvas: () => void;       // Return to template selection
}

export default function PaintingCluster({
  tone,
  brushSize,
  onBrushSizeIncrease,
  onResetGrid,
  onSave,
  onOpenPalette,
  onBack,
  onToggleBackground,
  onExitCanvas
}: PaintingClusterProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end animate-fadeIn">
      <ToneButton
        icon={<ArrowLeft />}
        label=""
        tone={tone}
        onClick={onExitCanvas}
      />
      <ToneButton
        icon={<Paintbrush/>}
        label={` +${brushSize}`}
        tone={tone}
        onClick={onBrushSizeIncrease}
      />
      <ToneButton
        icon={<Palette />}
        label=""
        tone={tone}
        onClick={onOpenPalette}
      />
      <ToneButton
        icon={<RotateCcw />}
        label=""
        tone={tone}
        onClick={onResetGrid}
      />
      <ToneButton
        icon={<Save />}
        label=""
        tone={tone}
        onClick={onSave}
      />
      <ToneButton
        icon={<CreditCard />}
        label=""
        tone={tone}
        onClick={onBack}
      />
      <ToneButton
        icon={<Sparkles />}
        label=""
        tone={tone}
        onClick={onToggleBackground}
      />
    </div>
  );
}
