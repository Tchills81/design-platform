// src/store/useLayoutStore.ts

import { StateCreator } from 'zustand';

export interface LayoutSlice {
  showRulers: boolean;
  setShowRulers: (show: boolean) => void;

  showBleeds: boolean;
  setShowBleeds: (show: boolean) => void;

  showGrids: boolean;
  setShowGrids: (show: boolean) => void;

  bleedToggleDisabled: boolean;
  setBleedToggleDisabled: (disabled: boolean) => void;

  dynamicBackground: string;
  setDynamicBackground: (color: string) => void;

  showBackground: boolean;
  setShowBackground: (show: boolean) => void;
}

export const createLayoutSlice: StateCreator<LayoutSlice> = (set) => ({
  showRulers: false,
  setShowRulers: (show) => set({ showRulers: show }),

  showBleeds: false,
  setShowBleeds: (show) => set({ showBleeds: show }),

  showGrids: false,
  setShowGrids: (show) => set({ showGrids: show }),

  bleedToggleDisabled: false,
  setBleedToggleDisabled: (disabled) => set({ bleedToggleDisabled: disabled }),

  dynamicBackground: '#ffffff',
  setDynamicBackground: (color) => set({ dynamicBackground: color }),

  showBackground: false,
  setShowBackground: (show) => set({ showBackground: show }),
});
