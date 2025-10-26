import { DualTemplate, TemplateDocument, FacePage } from '../types/template';

export function transformDualTemplateToDocument(dual: DualTemplate): TemplateDocument {
  const pages: FacePage[] = [];

  const buildFace = (role: 'front' | 'back' | 'inside', faceData: any): FacePage => ({
    id: role,
    label: role.charAt(0).toUpperCase() + role.slice(1),
    role,
    card: {
      width: faceData.card.width,
      height: faceData.card.height,
      background: faceData.card.background,
      backgroundImage: faceData.card.backgroundImage ?? '',
      gridColors: faceData.card.gridColors ?? [],
      cellSize: faceData.card.cellSize ?? 20
    },
    elements: faceData.elements
  });

  if (dual.front) pages.push(buildFace('front', dual.front));
  if (dual.back) pages.push(buildFace('back', dual.back));
  if (dual.inside) pages.push(buildFace('inside', dual.inside));

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
    subtype: dual.subtype ?? undefined, // ✅ Added subtype support
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
