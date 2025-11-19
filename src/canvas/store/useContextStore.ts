import Konva from 'konva';
import { SidebarTab } from '@/src/types/Tab';
import { StateCreator } from 'zustand';

export interface ContextSlice {
  konvaText: Konva.Text | null;
  setKonvaText: (
    k: Konva.Text | null | ((prev: Konva.Text | null) => Konva.Text | null)
  ) => void;

  elementInserted: boolean;
  setElementInserted: (
    b: boolean | ((prev: boolean) => boolean)
  ) => void;

  activeTab: SidebarTab | null;
  setActiveTab: (
    tab: SidebarTab | null | ((prev: SidebarTab | null) => SidebarTab | null)
  ) => void;

  isCollapsed: boolean;
  setIsCollapsed: (b: boolean | ((prev: boolean) => boolean)) => void;

  activeIndex: number | null;
  setActiveIndex: (
    i: number | null | ((prev: number | null) => number | null)
  ) => void;

  isTransitioningTemplate: boolean;
  setIsTransitioningTemplate: (
    b: boolean | ((prev: boolean) => boolean)
  ) => void;

  transformMode: 'move' | 'resize' | 'rotate' | null;
  setTransformMode: (
    mode:
      | 'move'
      | 'resize'
      | 'rotate'
      | null
      | ((prev: 'move' | 'resize' | 'rotate' | null) => 'move' | 'resize' | 'rotate' | null)
  ) => void;
}

export const createContextSlice: StateCreator<ContextSlice> = (set) => ({
  konvaText: null,
  setKonvaText: (k) =>
    set((state) => ({
      konvaText: typeof k === 'function' ? k(state.konvaText) : k,
    })),

  activeTab: null,
  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: typeof tab === 'function' ? tab(state.activeTab) : tab,
    })),

  isCollapsed: true,
  setIsCollapsed: (b) =>
    set((state) => ({
      isCollapsed: typeof b === 'function' ? b(state.isCollapsed) : b,
    })),

  activeIndex: null,
  setActiveIndex: (i) =>
    set((state) => ({
      activeIndex: typeof i === 'function' ? i(state.activeIndex) : i,
    })),

  isTransitioningTemplate: false,
  setIsTransitioningTemplate: (b) =>
    set((state) => ({
      isTransitioningTemplate: typeof b === 'function' ? b(state.isTransitioningTemplate) : b,
    })),

    elementInserted: false,
  setElementInserted: (b) =>
    set((state) => ({
      elementInserted: typeof b === 'function' ? b(state.elementInserted) : b,
    })),

  transformMode: null,
  setTransformMode: (mode) =>
    set((state) => ({
      transformMode: typeof mode === 'function' ? mode(state.transformMode) : mode,
    })),
});
