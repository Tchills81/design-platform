import { DualTemplate } from '../types/template';
import { TemplateDocument } from '../types/template';

import { transformDualTemplateToDocument } from './transformDualTemplate';
import { TemplateSize } from '../enumarations/TemplateSize';
import { TemplateGeometry } from '../enumarations/TemplateGeometry';
import { TemplateSizeLabel } from '../enumarations/TemplateSizeLabel';
import { UnifiedTemplate } from '../types/template';


export async function loadUnifiedTemplates(path: string): Promise<UnifiedTemplate[]> {
  try {
    const res = await fetch(path);
    const data = await res.json();

    const parsedTemplates: UnifiedTemplate[] = data
      .map((entry: any) => {
        try {
          const parsed = JSON.parse(entry.data);
          const sizeKey = entry.size as TemplateSize;
          const geometry = TemplateGeometry[sizeKey];
          const sizeLabel = TemplateSizeLabel[sizeKey];

          const dualTemplate: DualTemplate = {
            id: String(entry.id),
            name: entry.name,
            author: entry.author,
            tone: parsed.tone ?? 'neutral',
            size: sizeKey,
            sizeLabel: sizeLabel ?? 'Custom',
            width: geometry?.width ?? 0,
            height: geometry?.height ?? 0,
            thumbnailUrl: entry.thumbnailUrl,
            faces: ['front', 'back', 'insideFront', 'insideBack'],
            type: parsed.type,
            theme: parsed.theme,
            tokens: parsed.tokens,
            previewMode: parsed.previewMode,
            meta: parsed.meta,
            front: parsed.front,
            back: parsed.back,
            inside: parsed.inside
          };

          const document = transformDualTemplateToDocument(dualTemplate);

          return {
            kind: 'document',
            dual: dualTemplate,
            document
          };
        } catch (err) {
          console.warn(`🛑 Failed to parse template ${entry.id}:`, err);
          return null;
        }
      })
      .filter(Boolean) as UnifiedTemplate[];

    return parsedTemplates;
  } catch (err) {
    console.error('Failed to load unified templates:', err);
    return [];
  }
}
