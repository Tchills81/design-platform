'use client';

import { ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { IconButton } from './IconButton';
import { ToggleCheckbox } from './ToggleCheckbox';
import { tone } from '@/src/types/tone';
import { ToneButton } from './ToneButton';
import { CardSim } from 'lucide-react';
import { ArrowRight } from 'react-feather';
import { CanvasMode } from '../types/CanvasMode';

interface FooterControlClusterProps {
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
  mode:CanvasMode;

  
}

export default function FooterControlCluster({
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
  setZoom,
  setMode,
  mode
}: FooterControlClusterProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
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
  );
}
