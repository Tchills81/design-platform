import { DualTemplate } from '../types/template';
import { TemplateSize } from '../enumarations/TemplateSize';
import { TemplateGeometry } from '../enumarations/TemplateGeometry';
import { TemplateSizeLabel } from '../enumarations/TemplateSizeLabel';


export async function loadDesigns(path: string): Promise<DualTemplate[]> {
  try {
    const res = await fetch(path);
    const data = await res.json();

    const parsedDesigns: DualTemplate[] = data
      .map((entry: any) => {
        try {
          const parsed = JSON.parse(entry.data);
          const size = entry.size as TemplateSize;
          const geometry = TemplateGeometry[size];
          const sizeLabel = TemplateSizeLabel[size];

          return {
            id: String(entry.id),
            name: entry.name,
            author: entry.author,
            savedAt: entry.savedAt,
            tone: parsed.tone ?? 'neutral',
            mode: parsed.mode ?? 'card',
            size:size,
            sizeLabel:sizeLabel,
            width: geometry?.width,
            height: geometry?.height,
            front: parsed.front,
            back: parsed.back,
          };
        } catch (err) {
          console.warn(`🛑 Failed to parse design ${entry.id}:`, err);
          return null;
        }
      })
      .filter(Boolean);

    return parsedDesigns;
  } catch (err) {
    console.error('Failed to load design:', err);
    return [];
  }
}
