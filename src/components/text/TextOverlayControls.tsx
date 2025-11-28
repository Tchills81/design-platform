import { ToneButton } from '@/src/components/ToneButton';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';
import { getLockVisual, LockType } from '@/src/types/access';
import { tone } from '@/src/types/tone';
import Konva from 'konva';
import {  Copy, Trash2,MessageCircleIcon,  GroupIcon, UngroupIcon } from 'lucide-react';
import { RefObject } from 'react';

interface TextOverlayControlsProps {
  elementId: string | null;
  position: { x: number; y: number } 
  currentLock:LockType   // <-- updated
  onChangeLockType?: (type: LockType) => void; // new
  onToggleLock: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  textControlsRef: RefObject<HTMLDivElement | null>;
  konvaText?:Konva.Text | null;
  isMarqueeActive: boolean;
  elementsGrouped?:boolean;
  groupSelectedElements?: () => void;
  setElementsGrouped?: (b: boolean ) => void;
  setIsolationMode?: (b: boolean ) => void;
  selectedGroupId?:string | null;
  isIsolationMode?: boolean;
  id?:string | null;
  length?:number;
  tone?:tone
}

export const TextOverlayControls = ({
  elementId,
  position,
  currentLock,
  onToggleLock,
  onChangeLockType,
  onDuplicate,
  onDelete,
  textControlsRef,
  isMarqueeActive,
  groupSelectedElements,
  setElementsGrouped,
  setIsolationMode,
  elementsGrouped,
  length=0,
  selectedGroupId,
  isIsolationMode,
  id,
  tone,
}: TextOverlayControlsProps) => {
  const { icon, title } = getLockVisual(currentLock);

 /*console.log(
    "Rendering TextOverlayControls at position:",
    position,
    "for elementId:",
    elementId,
    "lockType:",
    currentLock
  );*/

  const { backgroundClass } = useSeasonalTone();

  const showGroupButton = (!!selectedGroupId || length > 1);

  console.log('selectedGroupId', showGroupButton && !isIsolationMode, 'length', length, 'isIsolationMode',isIsolationMode)

  return (
    <div
      ref={textControlsRef}
      className={`absolute z-50 flex gap-1 p-1  rounded-4xl bg-white/20 shadow-lg backdrop-blur-sm ${backgroundClass}`}
      style={{ top: position.y - 48, left: position.x }}
    >

      {(isMarqueeActive || showGroupButton && !isIsolationMode)  && (
        <>
          {/* Quick toggle button */}
          <ToneButton
          icon={!elementsGrouped ? <GroupIcon /> : <UngroupIcon />}   // 🔑 toggle icon
          tone={tone as tone || "primary"}
          label={!elementsGrouped ? "Group" : "UnGroup"}              // 🔑 toggle label
          onClick={() => {
    if (groupSelectedElements && setElementsGrouped) {
      if (!elementsGrouped) {
        groupSelectedElements();   // perform grouping
        setElementsGrouped(true);
      } else {
        setElementsGrouped(false); // perform ungrouping
      }
    }
  }}
/>
        </>
      )}


      {(isIsolationMode && (elementId != selectedGroupId)) && (
        <>
          {/* Quick toggle button */}
      <ToneButton
        icon={<UngroupIcon />}
        tone={tone as tone || "primary"}
        label='Exit' // need toggling Group/ UnGroup
        onClick={() => {
          if(setIsolationMode)
            setIsolationMode(false);
        }}
      />
        </>
      )}
      {/* Quick toggle button */}
      <ToneButton
        icon={icon}
        tone={tone as tone || "primary"}
        title={title}
        isActive={currentLock !== "none"}
        onClick={() => elementId && onToggleLock(elementId)}
      />

      {/* Dropdown for explicit lock type */}
      <select
        value={currentLock}
        onChange={(e) =>{
          if(onChangeLockType && elementId){
            onChangeLockType(e.target.value as LockType);
        }}
         
        }
        className={`text-sm px-2 py-1 rounded border border-gray-300 bg-white w-28 ${backgroundClass}`}
      >
        <option value="none">Unlocked</option>
        <option value="position">Position</option>
        <option value="full">Full</option>
        <option value="replace">Replace</option>
        <option value="style">Style</option>
        <option value="hierarchical">Hierarchical</option>
      </select>

      <ToneButton
        icon={<Copy />}
        tone={tone as tone || "primary"}
        onClick={() => elementId && onDuplicate(elementId)}
      />
      <ToneButton
        icon={<Trash2 />}
        tone={tone as tone || "primary"}
        onClick={() => elementId && onDelete(elementId)}
        title="Delete text element"
      />

       <ToneButton
        icon={<MessageCircleIcon/>}
        tone={tone as tone || "primary"}
        onClick={() => elementId && onDelete(elementId)}
        title="Delete text element"
      />
    </div>
  );
};