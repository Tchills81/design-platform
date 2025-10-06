import { CanvasMode } from "./CanvasMode";
import { DualTemplate } from "./template";
import { tone } from "./tone";
export interface SnapshotEntry {
    image?: string;
    width?:number;
    height?:number;
    side: 'front' | 'back';
    timestamp: string;
    templateId: string;
    tone:tone;
    type:CanvasMode;
    template:DualTemplate;
}