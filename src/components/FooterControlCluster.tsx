'use client';

import { ZoomIn, ZoomOut } from 'lucide-react';
import { IconButton } from './IconButton';
import { ToggleCheckbox } from './ToggleCheckbox';
import { tone } from '@/src/types/tone';

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
}: FooterControlClusterProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
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
    </div>
  );
}
