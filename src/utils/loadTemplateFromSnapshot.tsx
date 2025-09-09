
import { type SnapshotEntry } from "../types/SnapshotEntry";
import { type DualTemplate } from "../types/template";
import { TemplateElement } from "../types/template";

export const loadTemplateFromSnapshot = (entry: SnapshotEntry): DualTemplate => {
    const defaultCard = {
      width: 600,
      height: 300,
      background: '#ffffff',
      backgroundImage: entry.image,
      gridColors: []
    };
  
    const defaultElements: TemplateElement[] = [];
  
    const front = entry.side === 'front'
      ? { card: defaultCard, elements: defaultElements }
      : { card: { ...defaultCard, backgroundImage: '' }, elements: [] };
  
    const back = entry.side === 'back'
      ? { card: defaultCard, elements: defaultElements }
      : undefined;
  
    return {
      id: entry.templateId,
      tone: entry.tone,
      name: `Restored Design (${entry.timestamp})`,
      author: 'Snapshot Archive',
      thumbnailUrl: entry.image,
      front,
      back
    };
  };
  