import { DesignElement } from '@/src/types/DesignElement';
import { StateCreator } from 'zustand';

export interface LayoutSlice {
  isFullScreen: boolean;
  setIsFullScreen: (b: boolean | ((prev: boolean) => boolean)) => void;

  initialZoomedOutValue: number;
  setInitialZoomedOutValue: (v: number | ((prev: number) => number)) => void;

  hasInitializedZoom: boolean;
  setHasInitializedZoom: (b: boolean | ((prev: boolean) => boolean)) => void;

 stageSize: {
  width: number;
  height: number;
};
setStageSize: (
  size:
    | { width: number; height: number }
    | ((prev: { width: number; height: number }) => { width: number; height: number })
) => void;


  canvasBounds: { x: number; y: number; width: number; height: number };
  setCanvasBounds: (
    bounds:
      | { x: number; y: number; width: number; height: number }
      | ((prev: { x: number; y: number; width: number; height: number }) => { x: number; y: number; width: number; height: number })
  ) => void;

  cellSize: number;
  setCellSize: (size: number | ((prev: number) => number)) => void;

  ghostLines: { x?: number; y?: number };
  setGhostLines: (
    lines:
      | { x?: number; y?: number }
      | ((prev: { x?: number; y?: number }) => { x?: number; y?: number })
  ) => void;

  ghostOpacity: number;
  setGhostOpacity: (opacity: number | ((prev: number) => number)) => void;

  gridPosition: { x: number; y: number; width: number; height: number } | null;
  setGridPosition: (
    pos:
      | { x: number; y: number; width: number; height: number }
      | null
      | ((prev: { x: number; y: number; width: number; height: number } | null) => { x: number; y: number; width: number; height: number } | null)
  ) => void;

  viewportSize: { width: number; height: number };
  setViewportSize: (
    size:
      | { width: number; height: number }
      | ((prev: { width: number; height: number }) => { width: number; height: number })
  ) => void;

  visible: boolean;
  setVisible: (b: boolean | ((prev: boolean) => boolean)) => void;

  thumbValue: number;
  setThumbValue: (v: number | ((prev: number) => number)) => void;

  verticalOffset: number;
  setVerticalOffset: (v: number | ((prev: number) => number)) => void;

  showRulers: boolean;
  setShowRulers: (show: boolean | ((prev: boolean) => boolean)) => void;

  showBleeds: boolean;
  setShowBleeds: (show: boolean | ((prev: boolean) => boolean)) => void;

  showGrids: boolean;
  setShowGrids: (show: boolean | ((prev: boolean) => boolean)) => void;

  bleedToggleDisabled: boolean;
  setBleedToggleDisabled: (disabled: boolean | ((prev: boolean) => boolean)) => void;

  dynamicBackground: string;
  setDynamicBackground: (color: string | ((prev: string) => string)) => void;

  showBackground: boolean;
  setShowBackground: (show: boolean | ((prev: boolean) => boolean)) => void;

  lastFaceHash: string;
  setLastFaceHash: (hash: string | ((prev: string) => string)) => void;

  activeTimestamp: string;
  setActiveTimestamp: (ts: string | ((prev: string) => string)) => void;

  pageAdded: boolean;
  setPageAdded: (b: boolean | ((prev: boolean) => boolean)) => void;

  stripHeight: number;
  setStripHeight: (h: number | ((prev: number) => number)) => void;

  hasInitialized: boolean;
  setHasInitialized: (b: boolean | ((prev: boolean) => boolean)) => void;

  designElements: DesignElement[];
  setDesignElements: (elements: DesignElement[] | ((prev: DesignElement[]) => DesignElement[])) => void;

  designElement: DesignElement | null;
  setDesignElement: (
    el: DesignElement | null | ((prev: DesignElement | null) => DesignElement | null)
  ) => void;

  fadeTimeout: NodeJS.Timeout | null;
  setFadeTimeout: (
    t: NodeJS.Timeout | null | ((prev: NodeJS.Timeout | null) => NodeJS.Timeout | null)
  ) => void;

  elementId: string;
  setElementId: (id: string | ((prev: string) => string)) => void;

  stageStyle: React.CSSProperties;
  setStageStyle: (
    style: React.CSSProperties | ((prev: React.CSSProperties) => React.CSSProperties)
  ) => void;

  largeContainerSize: { width: number; height: number };
  setLargeContainerSize: (
    size:
      | { width: number; height: number }
      | ((prev: { width: number; height: number }) => { width: number; height: number })
  ) => void;

  canvasSize: { scaleX: number; scaleY: number; width: number; height: number };
  setCanvasSize: (
    size:
      | { scaleX: number; scaleY: number; width: number; height: number }
      | ((prev: { scaleX: number; scaleY: number; width: number; height: number }) => { scaleX: number; scaleY: number; width: number; height: number })
  ) => void;

  initialPosition: { x: number; y: number };
  setInitialPosition: (
    pos:
      | { x: number; y: number }
      | ((prev: { x: number; y: number }) => { x: number; y: number })
  ) => void;

  scrollOffset: { x: number; y: number };
  setScrollOffset: (
    offset:
      | { x: number; y: number }
      | ((prev: { x: number; y: number }) => { x: number; y: number })
  ) => void;

  scrollPosition: { x: number; y: number };
  setScrollPosition: (
    updater:
      | { x: number; y: number }
      | ((prev: { x: number; y: number }) => { x: number; y: number })
  ) => void;

  position: { x: number; y: number };
  setPosition: (
    updater:
      | { x: number; y: number }
      | ((prev: { x: number; y: number }) => { x: number; y: number })
  ) => void;

  zoom: number;
  setZoom: (z: number | ((prev: number) => number)) => void;

  animatedCells: Set<string>;
  setAnimatedCells: (cells: Set<string> | ((prev: Set<string>) => Set<string>)) => void;

  initailPosition: { x: number; y: number } ;
  setInitailPosition: (
    updater:
      | { x: number; y: number } 
      | ((prev: { x: number; y: number } ) => { x: number; y: number })
  ) => void;
}

export const createLayoutSlice: StateCreator<LayoutSlice> = (set) => ({
  isFullScreen: false,
  setIsFullScreen: (b) => set((state) => ({ isFullScreen: typeof b === 'function' ? b(state.isFullScreen) : b })),

  initialZoomedOutValue: 1,
  setInitialZoomedOutValue: (v) => set((state) => ({ initialZoomedOutValue: typeof v === 'function' ? v(state.initialZoomedOutValue) : v })),

  hasInitializedZoom: false,
  setHasInitializedZoom: (b) => set((state) => ({ hasInitializedZoom: typeof b === 'function' ? b(state.hasInitializedZoom) : b })),

  stageSize: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  setStageSize: (size) =>
    set((state) => ({
      stageSize: typeof size === 'function' ? size(state.stageSize) : size,
    })),
  
  canvasBounds: { x: 0, y: 0, width: 0, height: 0 },
  setCanvasBounds: (bounds) => set((state) => ({ canvasBounds: typeof bounds === 'function' ? bounds(state.canvasBounds) : bounds })),

    cellSize: 20,
  setCellSize: (size) =>
    set((state) => ({
      cellSize: typeof size === 'function' ? size(state.cellSize) : size,
    })),

  ghostLines: {},
  setGhostLines: (lines) =>
    set((state) => ({
      ghostLines: typeof lines === 'function' ? lines(state.ghostLines) : lines,
    })),

  ghostOpacity: 0,
  setGhostOpacity: (opacity) =>
    set((state) => ({
      ghostOpacity: typeof opacity === 'function' ? opacity(state.ghostOpacity) : opacity,
    })),

  gridPosition: null,
  setGridPosition: (pos) =>
    set((state) => ({
      gridPosition: typeof pos === 'function' ? pos(state.gridPosition) : pos,
    })),

  viewportSize: { width: 0, height: 0 },
  setViewportSize: (size) =>
    set((state) => ({
      viewportSize: typeof size === 'function' ? size(state.viewportSize) : size,
    })),

  visible: true,
  setVisible: (b) =>
    set((state) => ({
      visible: typeof b === 'function' ? b(state.visible) : b,
    })),

  thumbValue: 0,
  setThumbValue: (v) =>
    set((state) => ({
      thumbValue: typeof v === 'function' ? v(state.thumbValue) : v,
    })),

  verticalOffset: 0,
  setVerticalOffset: (v) =>
    set((state) => ({
      verticalOffset: typeof v === 'function' ? v(state.verticalOffset) : v,
    })),

  showRulers: false,
  setShowRulers: (show) =>
    set((state) => ({
      showRulers: typeof show === 'function' ? show(state.showRulers) : show,
    })),

  showBleeds: false,
  setShowBleeds: (show) =>
    set((state) => ({
      showBleeds: typeof show === 'function' ? show(state.showBleeds) : show,
    })),

  showGrids: false,
  setShowGrids: (show) =>
    set((state) => ({
      showGrids: typeof show === 'function' ? show(state.showGrids) : show,
    })),

  bleedToggleDisabled: false,
  setBleedToggleDisabled: (disabled) =>
    set((state) => ({
      bleedToggleDisabled: typeof disabled === 'function' ? disabled(state.bleedToggleDisabled) : disabled,
    })),

  dynamicBackground: '#ffffff',
  setDynamicBackground: (color) =>
    set((state) => ({
      dynamicBackground: typeof color === 'function' ? color(state.dynamicBackground) : color,
    })),

  showBackground: false,
  setShowBackground: (show) =>
    set((state) => ({
      showBackground: typeof show === 'function' ? show(state.showBackground) : show,
    })),

  lastFaceHash: '',
  setLastFaceHash: (hash) =>
    set((state) => ({
      lastFaceHash: typeof hash === 'function' ? hash(state.lastFaceHash) : hash,
    })),

  activeTimestamp: '',
  setActiveTimestamp: (ts) =>
    set((state) => ({
      activeTimestamp: typeof ts === 'function' ? ts(state.activeTimestamp) : ts,
    })),

  pageAdded: false,
  setPageAdded: (b) =>
    set((state) => ({
      pageAdded: typeof b === 'function' ? b(state.pageAdded) : b,
    })),

  stripHeight: 0,
  setStripHeight: (h) =>
    set((state) => ({
      stripHeight: typeof h === 'function' ? h(state.stripHeight) : h,
    })),

  hasInitialized: false,
  setHasInitialized: (b) =>
    set((state) => ({
      hasInitialized: typeof b === 'function' ? b(state.hasInitialized) : b,
    })),

  designElements: [],
  setDesignElements: (elements) =>
    set((state) => ({
      designElements: typeof elements === 'function' ? elements(state.designElements) : elements,
    })),

  designElement: null,
  setDesignElement: (el) =>
    set((state) => ({
      designElement: typeof el === 'function' ? el(state.designElement) : el,
    })),

  fadeTimeout: null,
  setFadeTimeout: (t) =>
    set((state) => ({
      fadeTimeout: typeof t === 'function' ? t(state.fadeTimeout) : t,
    })),

  elementId: '',
  setElementId: (id) =>
    set((state) => ({
      elementId: typeof id === 'function' ? id(state.elementId) : id,
    })),

  stageStyle: {},
  setStageStyle: (style) =>
    set((state) => ({
      stageStyle: typeof style === 'function' ? style(state.stageStyle) : style,
    })),

  largeContainerSize: { width: 0, height: 0 },
  setLargeContainerSize: (size) =>
    set((state) => ({
      largeContainerSize: typeof size === 'function' ? size(state.largeContainerSize) : size,
    })),

  canvasSize: { scaleX: 0, scaleY: 0, width: 0, height: 0 },
  setCanvasSize: (size) =>
    set((state) => ({
      canvasSize: typeof size === 'function' ? size(state.canvasSize) : size,
    })),

    initialPosition: { x: 0, y: 0 },
    setInitialPosition: (pos) =>
      set((state) => ({
        initialPosition: typeof pos === 'function' ? pos(state.initialPosition) : pos,
      })),
    

  scrollOffset: { x: 0, y: 0 },
  setScrollOffset: (offset) =>
    set((state) => ({
      scrollOffset: typeof offset === 'function' ? offset(state.scrollOffset) : offset,
    })),

  scrollPosition: { x: 0, y: 0 },
  setScrollPosition: (updater) =>
    set((state) => ({
      scrollPosition: typeof updater === 'function' ? updater(state.scrollPosition) : updater,
    })),


    initailPosition: { x: 0, y: 0 },
    setInitailPosition: (updater) =>
      set((state) => ({
        initailPosition: typeof updater === 'function' ? updater(state.initailPosition) : updater,
      })),

  position: { x: 0, y: 0 },
  setPosition: (updater) =>
    set((state) => ({
      position: typeof updater === 'function' ? updater(state.position) : updater,
    })),

  zoom: 1,
  setZoom: (z) =>
    set((state) => ({
      zoom: typeof z === 'function' ? z(state.zoom) : z,
    })),

  animatedCells: new Set(),
  setAnimatedCells: (cells) =>
    set((state) => ({
      animatedCells: typeof cells === 'function' ? cells(state.animatedCells) : cells,
    })),

 
});
