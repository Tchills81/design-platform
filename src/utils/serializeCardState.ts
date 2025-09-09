import { Template } from '../types/template';

export const serializeCardState = (
  template: Template,
  mode: string,
  templateId: string
) => {
  return {
    templateId,
    mode,
    card: {
      width: template.card?.width,
      height: template.card?.height,
      background: template.card?.background,
      backgroundImage: template.card?.backgroundImage,
      gridColors: template.card?.gridColors
    },
    elements: template.elements.map((el) => {
      const base = {
        id: el.id,
        type: el.type,
        position: el.position,
        size: el.size
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
          text: el.text ?? el.label, // fallback to label if text is undefined
          tone: el.tone,
          font: el.font,
          color: el.color,
          isBold: el.isBold,
          isItalic: el.isItalic,
          label: el.label
        };
      }

      return base; // fallback for unknown types
    })
  };
};
