import { CanvasMode } from "./CanvasMode";
import { DualTemplate } from "./template";
export interface SnapshotEntry {
    image: string;
    side: 'front' | 'back';
    timestamp: string;
    templateId: string;
    tone: string;
    type:CanvasMode;
    template:DualTemplate;
  }
  