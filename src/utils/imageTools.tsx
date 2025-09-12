// ImageTool.ts

import { DualTemplate } from '../types/template';

export type TemplateSideKey = 'front' | 'back';

export const ImageTools = {
  generateId(): string {
    return `img-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  },

  resize(
    id: string,
    newSize: { width: number; height: number },
    side: TemplateSideKey,
    setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>,
    recordSnapshot: () => void
  ): void {
    recordSnapshot();

    setTemplate(prev => {
      const currentSide = prev?.[side];
      if (!currentSide || !currentSide.elements) return prev;

      const updatedElements = currentSide.elements.map(el =>
        el.id === id ? { ...el, size: newSize } : el
      );

      return {
        ...prev,
        [side]: {
          ...currentSide,
          elements: updatedElements,
        },
      };
    });
  },

  remove(
    id: string,
    side: TemplateSideKey,
    setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>,
    recordSnapshot: () => void
  ): void {
    recordSnapshot();

    setTemplate(prev => {
      const currentSide = prev?.[side];
      if (!currentSide || !currentSide.elements) return prev;

      const filteredElements = currentSide.elements.filter(el => el.id !== id);

      return {
        ...prev,
        [side]: {
          ...currentSide,
          elements: filteredElements,
        },
      };
    });
  },

  crop(
    id: string,
    cropRegion: { x: number; y: number; width: number; height: number },
    side: TemplateSideKey,
    setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>,
    recordSnapshot: () => void
  ): void {
    recordSnapshot();

    console.log('Crop requested for', id, cropRegion);

    // TODO: Implement canvas-based cropping or masking logic
  },
};
