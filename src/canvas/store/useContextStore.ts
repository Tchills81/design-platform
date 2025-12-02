import Konva from 'konva';
import { SidebarTab } from '@/src/types/Tab';
import { SidebarAsset } from "@/public/assets/types"; 
import { StateCreator } from 'zustand';
import { TemplateElement } from '@/src/types/template';

export type MarqueeRect = { x: number; y: number; w: number; h: number };
export type BoundsRect= { x: number; y: number; width: number; height: number };

export interface ContextSlice {
  konvaText: Konva.Text | null;
  setKonvaText: (
    k: Konva.Text | null | ((prev: Konva.Text | null) => Konva.Text | null)
  ) => void;

  isIsolationMode: boolean;
  setIsolationMode: (b: boolean | ((prev: boolean) => boolean)) => void;

  isDragOverCard: boolean;
  setIsDragOverCard: (b: boolean | ((prev: boolean) => boolean)) => void;

  elementInserted: boolean;
  setElementInserted: (b: boolean | ((prev: boolean) => boolean)) => void;

  activeTab: SidebarTab | null;
  setActiveTab: (
    tab: SidebarTab | null | ((prev: SidebarTab | null) => SidebarTab | null)
  ) => void;

  // ✅ Selected asset tracking
  selectedAsset: SidebarAsset | null;
  setSelectedAsset: (
    asset: SidebarAsset | null | ((prev: SidebarAsset | null) => SidebarAsset | null)
  ) => void;

  isCollapsed: boolean;
  setIsCollapsed: (b: boolean | ((prev: boolean) => boolean)) => void;

  elementsGrouped: boolean;
  setElementsGrouped: (b: boolean | ((prev: boolean) => boolean)) => void;

  activeIndex: number | null;
  setActiveIndex: (
    i: number | null | ((prev: number | null) => number | null)
  ) => void;

  isTransitioningTemplate: boolean;
  setIsTransitioningTemplate: (b: boolean | ((prev: boolean) => boolean)) => void;

  transformMode: 'move' | 'resize' | 'rotate' | null;
  setTransformMode: (
    mode:
      | 'move'
      | 'resize'
      | 'rotate'
      | null
      | ((prev: 'move' | 'resize' | 'rotate' | null) => 'move' | 'resize' | 'rotate' | null)
  ) => void;

  // ✅ Multi-selection
  selectedIds: string[];
  setSelectedIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  clearSelection: () => void;
  selectOnly: (id: string) => void;
  toggleSelection: (id: string) => void;
  addSelection: (id: string) => void;
  removeSelection: (id: string) => void;
  selectWithShift: (id: string) => void;


  //bounds rect
  boundsRect: BoundsRect | null;
  setBoundsRect: (
    rect: BoundsRect | null | ((prev: BoundsRect | null) => BoundsRect | null)
  ) => void;


  // ✅ Marquee selection
  isMarqueeActive: boolean;
  marqueeRect: MarqueeRect | null;
  setMarqueeActive: (b: boolean | ((prev: boolean) => boolean)) => void;
  setMarqueeRect: (
    rect: MarqueeRect | null | ((prev: MarqueeRect | null) => MarqueeRect | null)
  ) => void;

  startMarquee: (pos: { x: number; y: number }) => void;
  updateMarquee: (pos: { x: number; y: number }) => void;
  finalizeMarquee: (elements: TemplateElement[], stage: Konva.Stage) => void;

  // ✅ Group element tracking
  groupElement: TemplateElement | null;
  setGroupElement: (
    g: TemplateElement | null | ((prev: TemplateElement | null) => TemplateElement | null)
  ) => void;
  onGroupUpdate: (updated: TemplateElement) => void;

  // ✅ Selected group tracking
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
}

export const createContextSlice: StateCreator<ContextSlice> = (set, get) => ({
  konvaText: null,
  setKonvaText: (k) =>
    set((state) => ({
      konvaText: typeof k === 'function' ? k(state.konvaText) : k,
    })),


    onGroupUpdate: (updated) => {
      if (updated.type === 'group') {
        set(() => ({ groupElement: updated }));
        console.log('[onGroupUpdate]', updated);
      }
    },
  
    selectedGroupId: null,
    setSelectedGroupId: (id) => {
      set(() => ({ selectedGroupId: id }));
      console.log('[setSelectedGroupId]...', id);
      
    },

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


    elementsGrouped: false,
    setElementsGrouped: (b) =>
      set((state) => ({
        elementsGrouped: typeof b === 'function' ? b(state.elementsGrouped) : b,
      })),

  activeIndex: null,
  setActiveIndex: (i) =>
    set((state) => ({
      activeIndex: typeof i === 'function' ? i(state.activeIndex) : i,
    })),




  // ✅ Selected asset tracking
  selectedAsset: null,
  setSelectedAsset: (asset) =>
    set((state) => ({
      selectedAsset: typeof asset === "function" ? asset(state.selectedAsset) : asset,
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

    isIsolationMode: false,
    setIsolationMode: (b) =>
      set((state) => ({
        isIsolationMode: typeof b === 'function' ? b(state.isIsolationMode) : b,
      })),


      isDragOverCard: false,
      setIsDragOverCard: (b) =>
        set((state) => ({
          isDragOverCard: typeof b === 'function' ? b(state.isDragOverCard) : b,
        })),
  

      
  transformMode: null,
  setTransformMode: (mode) =>
    set((state) => ({
      transformMode: typeof mode === 'function' ? mode(state.transformMode) : mode,
    })),

  // ✅ Multi-selection
  selectedIds: [],
  setSelectedIds: (ids) =>
    set((state) => ({
      selectedIds: typeof ids === 'function' ? ids(state.selectedIds) : ids,
    })),
  clearSelection: () => set({ selectedIds: [] }),
  selectOnly: (id: string) => set({ selectedIds: [id] }),
  toggleSelection: (id: string) =>
    set((state) => {
      const next = state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id];
      return { selectedIds: next };
    }),
  addSelection: (id: string) =>
    set((state) => {
      const alreadySelected = state.selectedIds.includes(id);
      const next = alreadySelected ? state.selectedIds : [...state.selectedIds, id];
      return { selectedIds: next };
    }),
  removeSelection: (id: string) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((x) => x !== id),
    })),
  selectWithShift: (id: string) =>
    set((state) => {
      if (state.selectedIds.includes(id)) {
        return { selectedIds: state.selectedIds.filter((x) => x !== id) };
      }
      return { selectedIds: [...state.selectedIds, id] };
    }),

  // ✅ Marquee selection
  isMarqueeActive: false,
  marqueeRect: null,
  setMarqueeActive: (b) =>
    set((state) => ({
      isMarqueeActive: typeof b === 'function' ? b(state.isMarqueeActive) : b,
    })),
  setMarqueeRect: (rect) =>
    set((state) => ({
      marqueeRect: typeof rect === 'function' ? rect(state.marqueeRect) : rect,
    })),


    boundsRect:null,
    setBoundsRect: (rect) =>
      set((state) => ({
        boundsRect: typeof rect === 'function' ? rect(state.boundsRect) : rect,
      })),

  startMarquee: (pos) =>
    set({
      isMarqueeActive: true,
      marqueeRect: { x: pos.x, y: pos.y, w: 0, h: 0 },
    }),

  updateMarquee: (pos) =>
    set((state) => {
      const r = state.marqueeRect;
      if (!state.isMarqueeActive || !r) return {};
      return { marqueeRect: { ...r, w: pos.x - r.x, h: pos.y - r.y } };
    }),

  finalizeMarquee: (elements: TemplateElement[], stage: Konva.Stage) => {
    const { isMarqueeActive, marqueeRect } = get();
    if (!isMarqueeActive || !marqueeRect) {
      set({ isMarqueeActive: false, marqueeRect: null });
      return;
    }

    const rx = Math.min(marqueeRect.x, marqueeRect.x + marqueeRect.w);
    const ry = Math.min(marqueeRect.y, marqueeRect.y + marqueeRect.h);
    const rw = Math.abs(marqueeRect.w);
    const rh = Math.abs(marqueeRect.h);

    const intersects = (el: TemplateElement) => {
      const node = stage.findOne(`#${el.id}`);
      if (!node) return false;

      const box = node.getClientRect();
      const xOverlap = box.x < rx + rw && box.x + box.width > rx;
      const yOverlap = box.y < ry + rh && box.y + box.height > ry;
      return xOverlap && yOverlap;
    };

    const ids = elements.filter(intersects).map((el) => el.id);

    set({
      selectedIds: ids,
      isMarqueeActive: false,
      marqueeRect: null,
    });
  },

  // ✅ Group element tracking
  groupElement: null,
  setGroupElement: (g) =>
    set((state) => ({
      groupElement: typeof g === 'function' ? g(state.groupElement) : g,
    })),

});
