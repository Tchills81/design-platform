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
       // console.log(`Entry  image: ${entry.type} ${entry.image.slice(entry.image.length-100, entry.image.length)}`);
        //let image=entry.image.slice(entry.image.length-100, entry.image.length);
        //entry.image = image;
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

    //console.log("acc", acc);

    return acc;
  }, {} as Record<string, GroupedSnapshot>);
}
