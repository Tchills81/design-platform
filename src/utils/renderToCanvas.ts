export const renderToCanvas = (
  design: any, // expected to be DualTemplate
  setTemplate: (updater: (prev: any) => any) => void,
  setMode: (mode: 'card' | 'painting') => void,
  side: 'front' | 'back' = 'front'
) => {
  const face = design?.[side];

  if (!face || !face.card) {
    console.warn(`🛑 renderToCanvas: missing "${side}" face or card`);
    return;
  }

  const { mode } = design;
  const { card, elements } = face;

  setTemplate((prev) => {
    const safePrev = prev ?? { front: {}, back: {} };

    return {
      ...safePrev,
      [side]: {
        card: {
          width: card.width,
          height: card.height,
          background: card.background,
          backgroundImage: card.backgroundImage,
          gridColors: card.gridColors ?? []
        },
        elements: elements.map((el: any) => {
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
              tone: el.tone,
              role: el.role,
              label: el.label
            };
          }

          if (el.type === 'text') {
            return {
              ...base,
              text: el.text,
              label: el.label,
              font: el.font,
              color: el.color,
              isBold: el.isBold === true || el.isBold === 'true',
              isItalic: el.isItalic === true || el.isItalic === 'true',
              tone: el.tone,
              role: el.role
            };
          }

          if (el.type === 'shape') {
            return {
              ...base,
              shapeType: el.shapeType, // ✅ required, no fallback
              fill: el.fill,
              stroke: el.stroke,
              strokeWidth: el.strokeWidth,
              tone: el.tone,
              role: el.role,
              label: el.label
            };
          }

          return base;
        })
      }
    };
  });
};
