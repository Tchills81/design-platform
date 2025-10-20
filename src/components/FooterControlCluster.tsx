'use client';

import { ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { IconButton } from './IconButton';
import { ToggleCheckbox } from './ToggleCheckbox';
import { tone } from '@/src/types/tone';
import { ToneButton } from './ToneButton';
import { CardSim } from 'lucide-react';
import { ArrowRight } from 'react-feather';
import { CanvasMode } from '../types/CanvasMode';
import { ThumbnailStrip } from './ThumbnailStrip';
import { DualTemplate } from '../types/template';
import { SnapshotEntry } from '../types/SnapshotEntry';
import { normalizeDualTemplate } from '../utils/normalizeDualTemplate';
import { renderToCanvas } from '../utils/renderToCanvas';

interface FooterControlClusterProps {
  template:DualTemplate | null;
  snapshots: { front: string | null; back: string | null };
  snapshotArchive:SnapshotEntry[];
  setTemplate:  React.Dispatch<React.SetStateAction<DualTemplate | null>>;
  setSnapshotArchive: React.Dispatch<React.SetStateAction<SnapshotEntry[]>>;
  setPageAdded: React.Dispatch<React.SetStateAction<boolean>>;
  side: 'front' | 'back';
  stageSize:{ width: number; height: number };
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
  setZoom: (newZoom:number)=>void;
  setMode:()=>void;
  duplicatePage:()=>void;
  mode:CanvasMode;
  activeTimestamp:string | null; 
  hasChanged:boolean;
  setActiveTimestamp:React.Dispatch<React.SetStateAction<string | null>>;
  setCavansReady:React.Dispatch<React.SetStateAction<boolean>>;
  setHasChanged:React.Dispatch<React.SetStateAction<boolean>>;
  captureFrontAndBack(): Promise<{ front: string; back: string }>;
 
  createPageTemplate:(page:number)=>void;

  
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
  mode,
  side
}: FooterControlClusterProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
  };

  return (
    <>

<div
  className="fixed bottom-1 left-0 right-0 z-30 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm"
  style={{
    width: '100%',
    maxWidth: stageSize.width,
    justifyContent: 'space-between',
    overflowX: 'auto'
  }}
>      
      {template && snapshots.back!=null && snapshots.front!=null && (
             <ThumbnailStrip 
              activeSide={side}
              activeTimestamp={activeTimestamp}
              template={template}
              snapshots={snapshotArchive}
              onSelect={async (entry: SnapshotEntry) => {
                const { side: page, timestamp, template: snapshotTemplate } = entry;
              
                if (hasChanged) {
                  // 🧩 Step 1: Clone and inject selected face into active template
                  const updatedTemplate = { ...template };
                  updatedTemplate[page] = template[page]; // inject selected face from thumbnail
              
                  // 🧩 Step 2: Capture snapshot of current canvas (active side)
                  const captured = await captureFrontAndBack();
                  const updatedImage = side === 'front' ? captured.front : captured.back;
              
                  // 🧩 Step 3: Update archive entry for current active design
                  setSnapshotArchive(prev =>
                    prev.map(e =>
                      e.timestamp === activeTimestamp && e.side === side
                        ? {
                            ...e,
                            image: updatedImage,
                            template: updatedTemplate
                          }
                        : e
                    )
                  );
                }
              
                // 🧩 Step 4: Normalize and switch to selected thumbnail
                const normalized = normalizeDualTemplate(snapshotTemplate);
                setTemplate(normalized);
                setSide(page);
                setActiveTimestamp(timestamp);
              
                // 🧩 Step 5: Render selected thumbnail if not already active
                if (timestamp !== activeTimestamp || page !== side) {
                  renderToCanvas(normalized, setTemplate, setMode, page, () => {
                    console.log('Rendered updated template with selected face');
                  });
                }
              }}
              
              
              
              
              onAddPage={()=>{
                createPageTemplate(1)}
              }
              onDuplicatePage={()=>{
                setPageAdded(true);
                setCavansReady(true);
              }}/>
           )}
     <IconButton icon={<ZoomOut size={20} />} tone={tone} onClick={zoomOut} />

     {/* Zoom Slider */}
     <div className="flex items-center gap-2">
       <input
         type="range"
         min={0.25}
         max={1}
         step={0.01}
         value={zoom}
         onChange={handleSliderChange}
         className="w-32 h-2 rounded-full accent-blue-500"
       />
       <span className="text-sm font-medium text-gray-700">{Math.round(zoom * 100)}%</span>
     </div>

     <IconButton icon={<ZoomIn size={20} />} tone={tone} onClick={zoomIn} />

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

{ mode=='painting' && (

<ToneButton
icon={<ArrowRight/>}
label="Exit Paint Mode"
tone={tone}
onClick={setMode}

/>
 
)}

   </div>

    </>)
    
}
