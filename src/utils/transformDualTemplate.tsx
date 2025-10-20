import { DualTemplate, TemplateDocument, FacePage } from '../types/template';

export function transformDualTemplateToDocument(dual: DualTemplate): TemplateDocument {
  const pages: FacePage[] = [];

  if (dual.front) {
    pages.push({
      id: 'front',
      label: 'Front',
      role: 'front',
      card: {
        width: dual.front.card.width,
        height: dual.front.card.height,
        background: dual.front.card.background,
        backgroundImage: dual.front.card.backgroundImage ?? '',
        gridColors: dual.front.card.gridColors ?? [],
        cellSize: dual.front.card.cellSize ?? 20
        // ❌ cellSize excluded to match Template['card'] type
      },
      elements: dual.front.elements
    });
  }

  if (dual.back) {
    pages.push({
      id: 'back',
      label: 'Back',
      role: 'back',
      card: {
        width: dual.back.card.width,
        height: dual.back.card.height,
        background: dual.back.card.background,
        backgroundImage: dual.back.card.backgroundImage ?? '',
        gridColors: dual.back.card.gridColors ?? []
      },
      elements: dual.back.elements
    });
  }

  if (dual.inside) {
    pages.push({
      id: 'inside',
      label: 'Inside',
      role: 'inside',
      card: {
        width: dual.inside.card.width,
        height: dual.inside.card.height,
        background: dual.inside.card.background,
        backgroundImage: dual.inside.card.backgroundImage ?? '',
        gridColors: dual.inside.card.gridColors ?? []
      },
      elements: dual.inside.elements
    });
  }

  return {
    id: dual.id,
    name: dual.name,
    author: dual.author,
    tone: dual.tone,
    size: dual.size,
    sizeLabel: dual.sizeLabel,
    width: dual.width,
    height: dual.height,
    thumbnailUrl: dual.thumbnailUrl ?? '',
    type: dual.type ?? 'generic',
    theme: dual.theme ?? 'generic',
    tokens: {
      borderStyle: dual.tokens?.borderStyle ?? 'minimal',
      fontFamily: dual.tokens?.fontFamily ?? 'Arial',
      accentColor: dual.tokens?.accentColor ?? '#000000'
    },
    previewMode: dual.previewMode ?? 'flat',
    meta: {
      createdBy: dual.meta?.createdBy ?? '',
      lastEditedBy: dual.meta?.lastEditedBy ?? '',
      approvedBy: dual.meta?.approvedBy ?? '',
      locked: dual.meta?.locked ?? false,
      insideMessage: dual.meta?.insideMessage ?? '',
      sticker: dual.meta?.sticker ?? '',
      motifType: dual.meta?.motifType ?? '',
      gradientStyle: dual.meta?.gradientStyle ?? ''
    },
    pages
  };
}
