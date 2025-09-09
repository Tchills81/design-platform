/**
 * Why This Works
Modular serializeFace() keeps logic clean and reusable

Handles optional back face gracefully

Ensures every field is present and normalized

Prepares a single JSON blob for insertion into your new table
 */

import { DualTemplate } from '../types/template';

export const serializeDualTemplate = (
  template: DualTemplate,
  mode: string
) => {
  const serializeFace = (
    face: { card: DualTemplate['front']['card']; elements: DualTemplate['front']['elements'] }
  ) => ({
    card: {
      width: face.card?.width,
      height: face.card?.height,
      background: face.card?.background,
      backgroundImage: face.card?.backgroundImage,
      gridColors: face.card?.gridColors
    },
    elements: face.elements.map((el) => {
      const base = {
        id: el.id,
        type: el.type,
        position: el.position,
        size: el.type === 'image' ? el.size : undefined
      };

      if (el.type === 'image') {
        return {
          ...base,
          src: el.src,
          tone: el.tone
        };
      }

      if (el.type === 'text') {
        return {
          ...base,
          text: el.text ?? el.label,
          tone: el.tone,
          font: el.font,
          color: el.color,
          isBold: el.isBold,
          isItalic: el.isItalic,
          label: el.label,
          size: el.size

        };
      }

      return base;
    })
  });

  return JSON.stringify({
    templateId: template.id,
    tone: template.tone,
    mode,
    front: serializeFace(template.front),
    back: template.back ? serializeFace(template.back) : null
  });
};
