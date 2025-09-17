import { SnapshotEntry } from '../types/SnapshotEntry';
import { DualTemplate } from '../types/template';

export interface GroupedSnapshot {
  front: SnapshotEntry | null;
  back: SnapshotEntry | null;
  insideFront: SnapshotEntry | null;
  insideBack: SnapshotEntry | null;
  template: DualTemplate;
}

export function groupSnapshotsByTemplate(
  archive: SnapshotEntry[]
): Record<string, GroupedSnapshot> {
  return archive.reduce((acc, entry) => {
    const id = entry.templateId;


    archive.forEach(entry => {
        console.log(`Entry type: ${entry.type}, side: ${entry.side}, templateId: ${entry.templateId}`);
      });
      

    if (!acc[id]) {
      acc[id] = {
        front: null,
        back: null,
        insideFront: null,
        insideBack: null,
        template: entry.template,
      };
    }

    switch (entry.type) {
      case 'front':
        acc[id].front = entry;
        break;
      case 'back':
        acc[id].back = entry;
        break;
      case 'insideFront':
        acc[id].insideFront = entry;
        break;
      case 'insideBack':
        acc[id].insideBack = entry;
        break;
    }

    return acc;
  }, {} as Record<string, GroupedSnapshot>);
}
