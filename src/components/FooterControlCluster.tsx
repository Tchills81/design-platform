'use client';

import { useState } from 'react';
import { ArrowLeft, Copy, Fullscreen, LogOutIcon, NotepadTextDashed, ScalingIcon, Share2Icon, ZoomIn, ZoomOut } from 'lucide-react';
import { ArrowRight } from 'react-feather';
import { IconButton } from './IconButton';
import { ToggleCheckbox } from './ToggleCheckbox';
import { ToneButton } from './ToneButton';
import { ThumbnailStrip } from './ThumbnailStrip';
import { normalizeDualTemplate } from '../utils/normalizeDualTemplate';
import { renderToCanvas } from '../utils/renderToCanvas';
import { DualTemplate } from '../types/template';
import { SnapshotEntry } from '../types/SnapshotEntry';
import { CanvasMode } from '../types/CanvasMode';
import { tone } from '@/src/types/tone';

interface FooterControlClusterProps {
  template: DualTemplate | null;
  snapshots: { front: string | null; back: string | null };
  snapshotArchive: SnapshotEntry[];
  setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>;
  setSnapshotArchive: React.Dispatch<React.SetStateAction<SnapshotEntry[]>>;
  setPageAdded: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPages: React.Dispatch<React.SetStateAction<boolean>>;
  setShowShareModal:React.Dispatch<React.SetStateAction<boolean>>;
  setIsFullScreen:React.Dispatch<React.SetStateAction<boolean>>;
  toggleFullScreen:()=>void;
  setIsPreviewMode:(mode:boolean)=>void;
  setIsCollapsed:React.Dispatch<React.SetStateAction<boolean>>;
  showPages:boolean;
  side: 'front' | 'back';
  stageSize: { width: number; height: number };
  setSide: React.Dispatch<React.SetStateAction<'front' | 'back'>>;
  tone: tone;
  zoomIn: () => void;
  zoomOut: () => void;
  showRulers: boolean;
  toggleRulers: () => void;
  showBleeds: boolean;
  toggleBleeds: () => void;
  showGrids: boolean;
  toggleGrids: () => void;
  bleedToggleDisabled?: boolean;
  zoom: number;
  initialZoomedOutValue:number;
  setZoom: (newZoom: number) => void;
  setMode: () => void;
  duplicatePage: () => void;
  mode: CanvasMode;
  activeTimestamp: string | null;
  hasChanged: boolean;
  isPreviewMode:boolean;
  isCollapsed:boolean;
  setActiveTimestamp: React.Dispatch<React.SetStateAction<string | null>>;
  setCavansReady: React.Dispatch<React.SetStateAction<boolean>>;
  setHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
  captureFrontAndBack(): Promise<{ front: string; back: string }>;
  createPageTemplate: (page: number) => void;
}

export default function FooterControlCluster({
  stageSize,
  template,
  snapshots,
  snapshotArchive,
  setSnapshotArchive,
  duplicatePage,
  tone,
  zoomIn,
  zoomOut,
  showRulers,
  toggleRulers,
  showBleeds,
  toggleBleeds,
  showGrids,
  toggleGrids,
  bleedToggleDisabled,
  zoom,
  initialZoomedOutValue,
  setTemplate,
  setZoom,
  setMode,
  setSide,
  createPageTemplate,
  activeTimestamp,
  setActiveTimestamp,
  setCavansReady,
  captureFrontAndBack,
  setHasChanged,
  hasChanged,
  setPageAdded,
  setShowPages,
  setIsFullScreen,
  showPages,
  mode,
  isPreviewMode,
  setIsPreviewMode,
  setIsCollapsed,
  isCollapsed,
  setShowShareModal,
  toggleFullScreen,
  side
}: FooterControlClusterProps) {
  

  
  

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsCollapsed(prev => !prev);

         // isCollapsed?setShowPages(isCollapsed):setShowPages(false);
          //setShowPages(prev => !prev);

        }
        }
        style={{
          position: 'fixed',
          bottom: isCollapsed ? 8 : 110,
          right: 12,
          zIndex: 40,
          background: '#0284c7',
          color: '#fff',
          borderRadius: 6,
          padding: '0.4rem 0.6rem',
          fontSize: '0.75rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          transition: 'bottom 0.3s ease'
        }}
      >
        {isCollapsed ? 'Show Controls' : 'Hide Controls'}
      </button>

      {/* Footer Cluster */}
      {!isCollapsed && (
        <div
          className="fixed bottom-1  right-0 z-30 flex items-center gap-4 bg-white/80 backdrop-blur-sm px-1 py-1 rounded-md shadow-sm"
          style={{
            width: 'auto',
            maxWidth: stageSize.width,
            justifyContent: 'space-between',
            overflowX: 'auto'
          }}
        >

             <ToneButton
              icon={<NotepadTextDashed/>}
              label={showPages ? "Hide" : "Show"}
              tone={tone}
              onClick={()=>setShowPages(prev => !prev)}
            />



           <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.25}
              max={isPreviewMode ? 1: 1.5}
              step={0.01}
              value={zoom}
              onChange={handleSliderChange}
              className="w-32 h-2 rounded-full accent-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {Math.round(zoom * 100)}%
            </span>
          </div>
         

         {isPreviewMode &&(

          <>
          <ToneButton
          icon={<Share2Icon/>}
          label="Share"
          tone={tone}
          onClick={() => {setShowShareModal(true)}}
          />

           
            <ToneButton
              icon={<Fullscreen/>}
              label=''
              tone={tone}
              onClick={()=>{
                //setIsFullScreen(prev => !prev);
                //setZoom(0.5)
                toggleFullScreen();
              }}
            />

          <ToneButton
              icon={<LogOutIcon/>}
              label=''
              tone={tone}
              onClick={()=>{
                setZoom(initialZoomedOutValue);
                setIsPreviewMode(false);
              }
              }
            />
          </>


           
         )}
          
      
        
         

          {!isPreviewMode && (

<>

             

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

 

{mode === 'painting' && (
  <ToneButton
    icon={<ArrowRight />}
    label="Exit Paint Mode"
    tone={tone}
    onClick={setMode}
  />
)}
</>

          )}

          

         
        </div>
      )}
    </>
  );
}
