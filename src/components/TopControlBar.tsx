// src/components/TopControlBar.tsx

import { ZoomIn, ZoomOut, Undo, Redo, Share2, MessageCircle, LogOutIcon } from 'lucide-react';
import { IconButton } from './IconButton';
import { ToggleCheckbox } from './ToggleCheckbox';
import { tone } from '@/src/types/tone';
import { ToneButton } from './ToneButton';
import { HistoryEntry } from '../types/HistoryEntry';
import { CanvasMode } from '../types/CanvasMode';
import { toneColorMap } from '@/src/types/tone';
import AvatarDropdown from './AvatarDropdown';
import { signOut } from 'next-auth/react';


interface TopControlBarProps {
  tone: tone;
  history: HistoryEntry[];
  future: HistoryEntry[];
  activeMode: CanvasMode;

  zoomIn: () => void;
  zoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
  showRulers: boolean;
  toggleRulers: () => void;
  showBleeds: boolean;
  toggleBleeds: () => void;
  toggleReflectionsModal:()=>void;
  showGrids: boolean;
  toggleGrids: () => void;
  bleedToggleDisabled?: boolean;
}

export default function TopControlBar({
  tone,
  zoomIn,
  zoomOut,
  showRulers,
  toggleRulers,
  showBleeds,
  toggleBleeds,
  showGrids,
  toggleGrids,
  toggleReflectionsModal,
  bleedToggleDisabled,
  history,
  future,
  onUndo,
  onRedo,
  activeMode,
}: TopControlBarProps) {
  
  const isInside = activeMode === "insideFront" || activeMode === "insideBack";
  const isFront = activeMode === "front" || activeMode === "insideFront";
  const isBack = activeMode === "back" || activeMode === "insideBack";
  
  const currentFaceLabel = isInside
  ? `Inside ${isFront ? "Front" : "Back"}`
  : `Face ${isFront ? "Front" : "Back"}`;


  const toneTextClass = toneColorMap[tone] ?? 'text-neutral-700';



  return (
    <div className="absolute top-6 right-4 z-20 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
     
     




     <ToneButton
        icon={<Undo />}
        label=""
        tone={tone}
        onClick={onUndo}
        disabled={history?.length === 0}
      />

      <ToneButton
        icon={<Redo />}
        label=""
        tone={tone}
        onClick={onRedo}
        disabled={future?.length === 0}
      />

<ToneButton
  icon={<Share2 />}
  label="Share"
  tone={tone}
  onClick={() => {
    console.log("Share action triggered");
    // You can scaffold share modal logic here
  }}
/>

<ToneButton
  icon={<MessageCircle />}
  label=""
  tone={tone}
  onClick={toggleReflectionsModal}
/>
     
     <div className="flex items-center gap-2 pr-2 border-r border-neutral-300 font-inter">
     <span className={`text-sm font-medium ${toneTextClass}`}>
          Active: {currentFaceLabel} 
        </span>
      </div>


      <IconButton icon={<ZoomIn size={20} />} tone={tone} onClick={zoomIn} />
      <IconButton icon={<ZoomOut size={20} />} tone={tone} onClick={zoomOut} />

      <ToggleCheckbox
        label="Show Rulers"
        checked={showRulers}
        onToggle={toggleRulers}
        tone={tone}
      />
      <ToggleCheckbox
        label="Show Bleeds"
        checked={showBleeds}
        onToggle={toggleBleeds}
        tone={tone}
        disabled={bleedToggleDisabled}
      />
      <ToggleCheckbox
        label="Show Grid"
        checked={showGrids}
        onToggle={toggleGrids}
        tone={tone}
      />

<AvatarDropdown/>

<ToneButton
  icon={<LogOutIcon />}
  label=""
  tone={tone}
  onClick={() => {
    signOut({ callbackUrl: '/' })
    console.log("Add Comment triggered");
    // You can scaffold comment logic here
  }}
/>
    </div>
  );
}
