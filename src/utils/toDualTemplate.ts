import { DualTemplate, TemplateDocument } from '../types/template';

export function toDualTemplate(doc: TemplateDocument): DualTemplate {
  const front = doc.pages.find(p => p.role === 'front');
  const back = doc.pages.find(p => p.role === 'back');
  const inside = doc.pages.find(p => p.role === 'inside');

  return {
    id: doc.id,
    name: doc.name,
    author: doc.author,
    tone: doc.tone,
    size: doc.size,
    sizeLabel: doc.sizeLabel,
    width: doc.width,
    height: doc.height,
    thumbnailUrl: doc.thumbnailUrl ?? '',
    faces: ['front', 'back', 'insideFront', 'insideBack'],
    type: doc.type as 'gift-card' | 'business-card' | 'seasonal' | 'enterprise' | undefined,
    theme: doc.theme && ['christmas', 'new_year', 'valentine', 'generic'].includes(doc.theme)
      ? doc.theme as 'christmas' | 'new_year' | 'valentine' | 'generic'
      : undefined,
    tokens: doc.tokens,
    previewMode: doc.previewMode,
    meta: doc.meta,
    front: front
      ? {
          card: {
            width: front.card.width,
            height: front.card.height,
            background: front.card.background,
            backgroundImage: front.card.backgroundImage,
            gridColors: front.card.gridColors,
            cellSize: front.card.cellSize ?? 20 // ✅ Guarded fallback
          },
          elements: front.elements
        }
      : undefined,
    back: back
      ? {
          card: {
            width: back.card.width,
            height: back.card.height,
            background: back.card.background,
            backgroundImage: back.card.backgroundImage,
            gridColors: back.card.gridColors,
            cellSize: back.card.cellSize ?? 20
          },
          elements: back.elements
        }
      : undefined,
    inside: inside
      ? {
          card: {
            width: inside.card.width,
            height: inside.card.height,
            background: inside.card.background,
            backgroundImage: inside.card.backgroundImage,
            gridColors: inside.card.gridColors,
            cellSize: inside.card.cellSize ?? 20
          },
          elements: inside.elements
        }
      : undefined
  };
}
