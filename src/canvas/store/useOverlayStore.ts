import { TextToolbarOverlayProps } from '@/src/canvas/overlays/TextToolbarOverlay';
import { StateCreator } from 'zustand';

export interface OverlaySlice {
  showGuides: boolean;
  setShowGuides: (b: boolean | ((prev: boolean) => boolean)) => void;

  showToolbar: boolean;
  setShowToolbar: (b: boolean | ((prev: boolean) => boolean)) => void;

  isImageToolbar: boolean;
  setIsImageToolbar: (b: boolean | ((prev: boolean) => boolean)) => void;

  portalTarget: HTMLElement | null;
  setPortalTarget: (el: HTMLElement | null | ((prev: HTMLElement | null) => HTMLElement | null)) => void;

  showReflectionModal: boolean;
  setShowReflectionModal: (b: boolean | ((prev: boolean) => boolean)) => void;

  showCommentModal: boolean;
  setShowCommentModal: (b: boolean | ((prev: boolean) => boolean)) => void;

  showShareModal: boolean;
  setShowShareModal: (b: boolean | ((prev: boolean) => boolean)) => void;

  overlayStyle: React.CSSProperties;
  setOverlayStyle: (
    style: React.CSSProperties | ((prev: React.CSSProperties) => React.CSSProperties)
  ) => void;

  overlayProps: Partial<TextToolbarOverlayProps> | null;
  setOverlayProps: (
    props: Partial<TextToolbarOverlayProps> | null | ((prev: Partial<TextToolbarOverlayProps> | null) => Partial<TextToolbarOverlayProps> | null)
  ) => void;

  reflections: any[];
  setReflections: (r: any[] | ((prev: any[]) => any[])) => void;
}

export const createOverlaySlice: StateCreator<OverlaySlice> = (set) => ({
  showGuides: true,
  setShowGuides: (b) =>
    set((state) => ({
      showGuides: typeof b === 'function' ? b(state.showGuides) : b,
    })),

  showToolbar: false,
  setShowToolbar: (b) =>
    set((state) => ({
      showToolbar: typeof b === 'function' ? b(state.showToolbar) : b,
    })),

  isImageToolbar: false,
  setIsImageToolbar: (b) =>
    set((state) => ({
      isImageToolbar: typeof b === 'function' ? b(state.isImageToolbar) : b,
    })),

  portalTarget: null,
  setPortalTarget: (el) =>
    set((state) => ({
      portalTarget: typeof el === 'function' ? el(state.portalTarget) : el,
    })),

  showReflectionModal: false,
  setShowReflectionModal: (b) =>
    set((state) => ({
      showReflectionModal: typeof b === 'function' ? b(state.showReflectionModal) : b,
    })),

  showCommentModal: false,
  setShowCommentModal: (b) =>
    set((state) => ({
      showCommentModal: typeof b === 'function' ? b(state.showCommentModal) : b,
    })),

  showShareModal: false,
  setShowShareModal: (b) =>
    set((state) => ({
      showShareModal: typeof b === 'function' ? b(state.showShareModal) : b,
    })),

  overlayStyle: {},
  setOverlayStyle: (style) =>
    set((state) => ({
      overlayStyle: typeof style === 'function' ? style(state.overlayStyle) : style,
    })),

  overlayProps: null,
  setOverlayProps: (props) =>
    set((state) => ({
      overlayProps: typeof props === 'function' ? props(state.overlayProps) : props,
    })),

  reflections: [],
  setReflections: (r) =>
    set((state) => ({
      reflections: typeof r === 'function' ? r(state.reflections) : r,
    })),
});
