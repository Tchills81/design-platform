
import { type DualTemplate, TemplateElement, Template } from "../types/template";

export const normalizeDualTemplate = (template: DualTemplate): DualTemplate => {
    const defaultGrid = Array(60).fill('#f0f0f0');
  
    const patchFace = (face?: { card: Template['card']; elements: TemplateElement[] }) => {
      if (!face) return undefined;
      return {
        ...face,
        card: {
          ...face.card,
          gridColors: face.card.gridColors ?? defaultGrid
        }
      };
    };
  
    return {
      ...template,
      front: patchFace(template.front)!,
      back: patchFace(template.back)
    };
  };
  