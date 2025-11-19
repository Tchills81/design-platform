import { ToneButton } from '@/src/components/ToneButton';
import { tone } from '@/src/types/tone';
import Konva from 'konva';
import { Lock, Unlock, Copy, Trash2, LockOpenIcon, LockIcon } from 'lucide-react';
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
  tone?:tone
}

export const TextOverlayControls = ({
  elementId,
  position,
  locked,
  onToggleLock,
  onDuplicate,
  onDelete,
  textControlsRef,
  tone
}: TextOverlayControlsProps) => {


    console.log('Rendering TextOverlayControls at position:', position, 'for elementId:', elementId, 'locked:', locked);
  return (
    <div ref={textControlsRef}
      className="absolute z-50 flex gap-2 p-1 rounded-md bg-white/80 shadow-lg backdrop-blur-sm"
      style={{ top: position.y-48, left: position.x }}
    >
      <ToneButton
         
         icon={locked ? <LockIcon size={24} /> : <LockOpenIcon size={24}/>}
         tone={tone as tone || 'primary'}
         title={locked ? 'Unlock text element' : 'Lock text element'}
         isActive={locked}
         onClick={() => elementId && onToggleLock(elementId)}
        
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
