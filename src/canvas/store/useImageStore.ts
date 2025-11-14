import { StateCreator } from 'zustand';

export interface ImageSlice {

  
  selectedImageId: string | null;
  setSelectedImageId: (
    id: string | null | ((prev: string | null) => string | null)
  ) => void;

  cropModeActive: boolean;
  setCropModeActive: (b: boolean | ((prev: boolean) => boolean)) => void;

  cropRegion: { x: number; y: number; width: number; height: number };
  setCropRegion: (
    r:
      | { x: number; y: number; width: number; height: number }
      | ((prev: { x: number; y: number; width: number; height: number }) => { x: number; y: number; width: number; height: number })
  ) => void;

  brushSize: number;
  setBrushSize: (size: number | ((prev: number) => number)) => void;

  brushColor: string;
  setBrushColor: (color: string | ((prev: string) => string)) => void;

  selectedColor: string;
  setSelectedColor: (color: string | ((prev: string) => string)) => void;

  previewSrc: string | null;
  setPreviewSrc: (
    src: string | null | ((prev: string | null) => string | null)
  ) => void;

  previewRole: 'background' | 'element';
  setPreviewRole: (
    role: 'background' | 'element' | ((prev: 'background' | 'element') => 'background' | 'element')
  ) => void;
}

export const createImageSlice: StateCreator<ImageSlice> = (set) => ({
  selectedImageId: null,
  setSelectedImageId: (id) =>
    set((state) => ({
      selectedImageId: typeof id === 'function' ? id(state.selectedImageId) : id,
    })),

  cropModeActive: false,
  setCropModeActive: (b) =>
    set((state) => ({
      cropModeActive: typeof b === 'function' ? b(state.cropModeActive) : b,
    })),

  cropRegion: { x: 0, y: 0, width: 100, height: 100 },
  setCropRegion: (r) =>
    set((state) => ({
      cropRegion: typeof r === 'function' ? r(state.cropRegion) : r,
    })),

  brushSize: 12,
  setBrushSize: (size) =>
    set((state) => ({
      brushSize: typeof size === 'function' ? size(state.brushSize) : size,
    })),

  brushColor: '#ff0000',
  setBrushColor: (color) =>
    set((state) => ({
      brushColor: typeof color === 'function' ? color(state.brushColor) : color,
    })),

  selectedColor: '#ff595e',
  setSelectedColor: (color) =>
    set((state) => ({
      selectedColor: typeof color === 'function' ? color(state.selectedColor) : color,
    })),

  previewSrc: null,
  setPreviewSrc: (src) =>
    set((state) => ({
      previewSrc: typeof src === 'function' ? src(state.previewSrc) : src,
    })),

  previewRole: 'background',
  setPreviewRole: (role) =>
    set((state) => ({
      previewRole: typeof role === 'function' ? role(state.previewRole) : role,
    })),
});
