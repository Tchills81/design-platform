import { CanvasMode } from '@/src/types/CanvasMode';
import { AccessLevel } from '@/src/types/access';
import { StateCreator } from 'zustand';

export interface ModeSlice {
  mode: CanvasMode;
  setMode: (m: CanvasMode | ((prev: CanvasMode) => CanvasMode)) => void;

  side: 'front' | 'back';
  setSide: (
    s: 'front' | 'back' | ((prev: 'front' | 'back') => 'front' | 'back')
  ) => void;

  accessLevel: AccessLevel;
  setAccessLevel: (level: AccessLevel | ((prev: AccessLevel) => AccessLevel)) => void;

  modes: CanvasMode[];
  setModes: (modes: CanvasMode[] | ((prev: CanvasMode[]) => CanvasMode[])) => void;

  faceMode: CanvasMode;
  setFaceMode: (updater: CanvasMode | ((prev: CanvasMode) => CanvasMode)) => void;

  viewMode: 'default' | 'spread';
  setViewMode: (
    v: 'default' | 'spread' | ((prev: 'default' | 'spread') => 'default' | 'spread')
  ) => void;

  designInside: boolean;
  setDesignInside: (b: boolean | ((prev: boolean) => boolean)) => void;

  designComplete: boolean;
  setDesignComplete: (b: boolean | ((prev: boolean) => boolean)) => void;

  prepareForPrint: boolean;
  setPrepareForPrint: (b: boolean | ((prev: boolean) => boolean)) => void;

  animatedCells: Set<string>;
  setAnimatedCells: (cells: Set<string> | ((prev: Set<string>) => Set<string>)) => void;

  isPreviewMode: boolean;
  setIsPreviewMode: (b: boolean | ((prev: boolean) => boolean)) => void;
}


export const createModeSlice: StateCreator<ModeSlice> = (set) => ({
  mode: 'card',
  setMode: (m) =>
    set((state) => ({
      mode: typeof m === 'function' ? m(state.mode) : m,
    })),

  side: 'front',
  setSide: (s) =>
    set((state) => ({
      side: typeof s === 'function' ? s(state.side) : s,
    })),

  accessLevel: 'view',
  setAccessLevel: (level) =>
    set((state) => ({
      accessLevel: typeof level === 'function' ? level(state.accessLevel) : level,
    })),

  modes: ['front', 'back'],
  setModes: (modes) =>
    set((state) => ({
      modes: typeof modes === 'function' ? modes(state.modes) : modes,
    })),

  faceMode: 'front',
  setFaceMode: (updater) =>
    set((state) => ({
      faceMode: typeof updater === 'function' ? updater(state.faceMode) : updater,
    })),

  viewMode: 'default',
  setViewMode: (v) =>
    set((state) => ({
      viewMode: typeof v === 'function' ? v(state.viewMode) : v,
    })),

  designInside: false,
  setDesignInside: (b) =>
    set((state) => ({
      designInside: typeof b === 'function' ? b(state.designInside) : b,
    })),

  designComplete: false,
  setDesignComplete: (b) =>
    set((state) => ({
      designComplete: typeof b === 'function' ? b(state.designComplete) : b,
    })),

  prepareForPrint: false,
  setPrepareForPrint: (b) =>
    set((state) => ({
      prepareForPrint: typeof b === 'function' ? b(state.prepareForPrint) : b,
    })),

  animatedCells: new Set<string>(),
  setAnimatedCells: (cells) =>
    set((state) => ({
      animatedCells: typeof cells === 'function' ? cells(state.animatedCells) : cells,
    })),

  isPreviewMode: false,
  setIsPreviewMode: (b) =>
    set((state) => ({
      isPreviewMode: typeof b === 'function' ? b(state.isPreviewMode) : b,
    })),
});
