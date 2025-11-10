// src/components/TopControlBar.tsx

import { ZoomIn, ZoomOut, Undo, Redo, Share2, MessageCircle, LogOutIcon, Eye, FlipHorizontal2Icon as reflection, FlipHorizontal2Icon, PlusIcon, ListPlus} from 'lucide-react';
import { IconButton } from './IconButton';
import { ToggleCheckbox } from './ToggleCheckbox';
import { tone } from '@/src/types/tone';
import { ToneButton } from './ToneButton';
import { HistoryEntry } from '../types/HistoryEntry';
import { CanvasMode } from '../types/CanvasMode';
import { toneColorMap } from '@/src/types/tone';
import AvatarDropdown from './AvatarDropdown';
import { signOut } from 'next-auth/react';
import FooterControlCluster from '@/src/components/FooterControlCluster';
import { DualTemplate } from '../types/template';
import { RefObject } from 'react';



interface TopControlBarProps {
  tone: tone;
  history: HistoryEntry[];
  future: HistoryEntry[];
  template?:DualTemplate;
  activeMode: CanvasMode;
  onPreview: () => void;
  zoom:number;
  zoomIn: () => void;
  zoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
  showRulers: boolean;
  toggleRulers: () => void;
  showBleeds: boolean;
  toggleBleeds: () => void;
  toggleReflectionsModal:()=>void;
  toggleShareModal:()=>void;
  setZoom: (newZoom:number)=>void;
  toggleCommentModal:()=>void;
  showGrids: boolean;
  toggleGrids: () => void;
  bleedToggleDisabled?: boolean;
  topBarRef: RefObject<HTMLDivElement | null>
}

export default function TopControlBar({
  template,
  tone,
  zoom,
  setZoom,
  zoomIn,
  zoomOut,
  showRulers,
  toggleRulers,
  showBleeds,
  toggleBleeds,
  showGrids,
  onPreview,
  toggleGrids,
  toggleReflectionsModal,
  toggleCommentModal,
  toggleShareModal,
  bleedToggleDisabled,
  history,
  future,
  onUndo,
  onRedo,
  activeMode,
  topBarRef
}: TopControlBarProps) {
  
  const isInside = activeMode === "insideFront" || activeMode === "insideBack";
  const isFront = activeMode === "front" || activeMode === "insideFront";
  const isBack = activeMode === "back" || activeMode === "insideBack";
  
  const currentFaceLabel = isInside
  ? `Inside ${isFront ? "Front" : "Back"}`
  : `Face ${isFront ? "Front" : "Back"}`;


  const toneTextClass = toneColorMap[tone] ?? 'text-neutral-700';



  return (
    <>
    <div ref={topBarRef} id='top-bar' className="absolute top-0 right-4 z-20 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
     

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


<div className="flex items-center gap-3 pr-3 border-r border-neutral-300 font-inter min-w-[180px]">
  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-white via-neutral-100 to-white shadow-sm w-full">
    <span className={`text-xs uppercase tracking-wide text-neutral-500 ${toneTextClass}`}>{template?.name} {template?.sizeLabel} ({template?.width}×{template?.height})</span>
    <span className={`text-sm font-semibold ${toneTextClass}`}>
      
    </span>
  </div>
</div>


     <ToneButton
        icon={<Eye />}
        label="Preview"
        tone={tone}
        onClick={onPreview}
      />

<ToneButton
  icon={<FlipHorizontal2Icon />}
  label="Reflections"
  tone={tone}
  onClick={toggleReflectionsModal}
/>

<ToneButton
  icon={<ListPlus/>}
  label="Comment"
  tone={tone}
  onClick={toggleCommentModal}
/>

<ToneButton
  icon={<Share2 />}
  label="Share"
  tone={tone}
  onClick={toggleShareModal}
/>


     




     

<AvatarDropdown/>

<ToneButton
  icon={<LogOutIcon />}
  label="Log Out"
  tone={tone}
  onClick={() => {
    signOut({ callbackUrl: '/' })
    console.log("Add Comment triggered");
    // You can scaffold comment logic here
  }}
/>



    </div>
 
</>

  );
}
