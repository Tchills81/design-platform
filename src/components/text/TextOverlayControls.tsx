import { ToneButton } from '@/src/components/ToneButton';
import Konva from 'konva';
import { Lock, Unlock, Copy, Trash2 } from 'lucide-react';
import { RefObject } from 'react';

interface TextOverlayControlsProps {
  elementId: string | null;
  position: { x: number; y: number } 
  locked: boolean;
  onToggleLock: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  textControlsRef: RefObject<HTMLDivElement | null>;
  konvaText?:Konva.Text | null;
}

export const TextOverlayControls = ({
  elementId,
  position,
  locked,
  onToggleLock,
  onDuplicate,
  onDelete,
  textControlsRef,
  konvaText
}: TextOverlayControlsProps) => {


    
  return (
    <div ref={textControlsRef}
      className="absolute z-50 flex gap-2 p-1 rounded-md bg-white/80 shadow-lg backdrop-blur-sm"
      style={{ top: position.y-48, left: position.x }}
    >
      <ToneButton
        icon={locked ? <Unlock /> : <Lock />}
        tone={locked ? 'suggestion' : 'concern'}
        onClick={() => elementId && onToggleLock(elementId)}
        title={locked ? 'Unlock text element' : 'Lock text element'}
      />
      <ToneButton
        icon={<Copy />}
        tone="playful"
        onClick={() => elementId && onDuplicate(elementId)}
        
      />
      <ToneButton
        icon={<Trash2 />}
        tone="concern"
        onClick={() => elementId && onDelete(elementId)}
        title="Delete text element"
      />
    </div>
  );
};
