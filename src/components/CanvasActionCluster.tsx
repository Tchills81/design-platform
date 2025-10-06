// src/components/CanvasActionCluster.tsx
import {
  Brush,
  CreditCard,
  RotateCcw,
  RotateCw,
  Undo,
  Redo,
  Save,
  Eye,
} from 'lucide-react';
import { ToneButton } from './ToneButton';
import { tone } from '@/src/types/tone';
import { HistoryEntry } from '../types/HistoryEntry';
import { CanvasMode } from '../types/CanvasMode';

interface CanvasActionClusterProps {
  tone: tone;
  mode: 'card' | 'painting';
  side: 'front' | 'back';
  onToggleMode: () => void;
  onFlipSide: () => void;
  faceMode: CanvasMode;
  history?: HistoryEntry[];
  future?: HistoryEntry[];
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPreview: () => void;
}

export default function CanvasActionCluster({
  tone,
  mode,
  side,
  onToggleMode,
  onFlipSide,
  onUndo,
  onRedo,
  onSave,
  onPreview,
  history,
  future,
  faceMode,
}: CanvasActionClusterProps) {
  const isInside = faceMode.startsWith('inside');
  const isFront = faceMode.endsWith('Front');

  const currentFaceLabel = isInside
    ? `Inside ${isFront ? 'Front' : 'Back'}`
    : `Face ${side.charAt(0).toUpperCase() + side.slice(1)}`;

  const flipTargetLabel = isInside
    ? isFront
      ? 'Inside Back'
      : 'Inside Front'
    : side === 'front'
    ? 'Back'
    : 'Front';

  const flipIcon = isInside
    ? isFront
      ? <RotateCw />
      : <RotateCcw />
    : side === 'front'
    ? <RotateCcw />
    : <RotateCw />;

  return (
    <div className="flex gap-3 flex-wrap justify-center mt-4 animate-fadeIn">
      
        <ToneButton
          icon={flipIcon}
          label={`Flip to ${flipTargetLabel}`}
          tone={tone}
          onClick={onFlipSide}
        />
      

      <ToneButton
        icon={<Brush />}
        label="Paint"
        tone={tone}
        onClick={onToggleMode}
        isActive={mode === 'painting'}
      />
      <ToneButton
        icon={<CreditCard />}
        label="Card"
        tone={tone}
        onClick={onToggleMode}
        isActive={mode === 'card'}
      />
      <ToneButton
        icon={<Undo />}
        label="Undo"
        tone={tone}
        onClick={onUndo}
        disabled={history?.length === 0}
      />
      <ToneButton
        icon={<Redo />}
        label="Redo"
        tone={tone}
        onClick={onRedo}
        disabled={future?.length === 0}
      />
      <ToneButton icon={<Save />} label="Save" tone={tone} onClick={onSave} />
      <ToneButton icon={<Eye />} label="Preview" tone={tone} onClick={onPreview} />
    </div>
  );
}
