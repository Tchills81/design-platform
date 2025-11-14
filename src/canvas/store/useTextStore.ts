import { TextToolbarOverlayProps } from '@/src/canvas/overlays/TextToolbarOverlay';
import { StateCreator } from 'zustand';

export interface TextSlice {
  editingTextId: string | null;
  setEditingTextId: (id: string | null | ((prev: string | null) => string | null)) => void;

  editingText: string;
  setEditingText: (text: string | ((prev: string) => string)) => void;

  selectedTextId: string | null;
  setSelectedTextId: (id: string | null | ((prev: string | null) => string | null)) => void;

  selectedFont: string;
  setSelectedFont: (font: string | ((prev: string) => string)) => void;

  selectedFontSize: number;
  setSelectedFontSize: (size: number | ((prev: number) => number)) => void;

  inputPosition: { x: number; y: number } | null;
  setInputPosition: (
    pos: { x: number; y: number } | null | ((prev: { x: number; y: number } | null) => { x: number; y: number } | null)
  ) => void;

  textAlign: 'left' | 'center' | 'right';
  setTextAlign: (
    align: 'left' | 'center' | 'right' | ((prev: 'left' | 'center' | 'right') => 'left' | 'center' | 'right')
  ) => void;

  isMultiline: boolean;
  setIsMultline: (b: boolean | ((prev: boolean) => boolean)) => void;

  isUnderline: boolean;
  setIsUnderline: (b: boolean | ((prev: boolean) => boolean)) => void;

  isBold: boolean;
  setIsBold: (b: boolean | ((prev: boolean) => boolean)) => void;

  isItalic: boolean;
  setIsItalic: (b: boolean | ((prev: boolean) => boolean)) => void;

  showOverlayInput: boolean;
  setShowOverlayInput: (b: boolean | ((prev: boolean) => boolean)) => void;

  overlayProps: Partial<TextToolbarOverlayProps> | null;
  setOverlayProps: (
    props: Partial<TextToolbarOverlayProps> | null | ((prev: Partial<TextToolbarOverlayProps> | null) => Partial<TextToolbarOverlayProps> | null)
  ) => void;

  pendingStyle: { isBold?: boolean; isItalic?: boolean };
  setPendingStyle: (
    updater:
      | { isBold?: boolean; isItalic?: boolean }
      | ((prev: { isBold?: boolean; isItalic?: boolean }) => { isBold?: boolean; isItalic?: boolean })
  ) => void;
}

export const createTextSlice: StateCreator<TextSlice> = (set) => ({
  editingTextId: null,
  setEditingTextId: (id) =>
    set((state) => ({
      editingTextId: typeof id === 'function' ? id(state.editingTextId) : id,
    })),

  editingText: '',
  setEditingText: (text) =>
    set((state) => ({
      editingText: typeof text === 'function' ? text(state.editingText) : text,
    })),

  selectedTextId: null,
  setSelectedTextId: (id) =>
    set((state) => ({
      selectedTextId: typeof id === 'function' ? id(state.selectedTextId) : id,
    })),

  selectedFont: '--font-inter',
  setSelectedFont: (font) =>
    set((state) => ({
      selectedFont: typeof font === 'function' ? font(state.selectedFont) : font,
    })),

  selectedFontSize: 8,
  setSelectedFontSize: (size) =>
    set((state) => ({
      selectedFontSize: typeof size === 'function' ? size(state.selectedFontSize) : size,
    })),

  inputPosition: null,
  setInputPosition: (pos) =>
    set((state) => ({
      inputPosition: typeof pos === 'function' ? pos(state.inputPosition) : pos,
    })),

  textAlign: 'left',
  setTextAlign: (align) =>
    set((state) => ({
      textAlign: typeof align === 'function' ? align(state.textAlign) : align,
    })),

  isMultiline: false,
  setIsMultline: (b) =>
    set((state) => ({
      isMultiline: typeof b === 'function' ? b(state.isMultiline) : b,
    })),

  isUnderline: false,
  setIsUnderline: (b) =>
    set((state) => ({
      isUnderline: typeof b === 'function' ? b(state.isUnderline) : b,
    })),

  isBold: false,
  setIsBold: (b) =>
    set((state) => ({
      isBold: typeof b === 'function' ? b(state.isBold) : b,
    })),

  isItalic: false,
  setIsItalic: (b) =>
    set((state) => ({
      isItalic: typeof b === 'function' ? b(state.isItalic) : b,
    })),

  showOverlayInput: false,
  setShowOverlayInput: (b) =>
    set((state) => ({
      showOverlayInput: typeof b === 'function' ? b(state.showOverlayInput) : b,
    })),

  overlayProps: null,
  setOverlayProps: (props) =>
    set((state) => ({
      overlayProps: typeof props === 'function' ? props(state.overlayProps) : props,
    })),

  pendingStyle: {},
  setPendingStyle: (updater) =>
    set((state) => ({
      pendingStyle: typeof updater === 'function' ? updater(state.pendingStyle) : updater,
    })),
});
