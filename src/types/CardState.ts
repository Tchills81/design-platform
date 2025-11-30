import { ImageElement } from "../components/elements/shapes/ImageElement";
import { TextElement } from "../components/text/TextElement";
import { CanvasMode } from "./CanvasMode";
import { DualTemplate, TemplateElement } from "./template";

export type CardState = {
  width: number;
  height: number;
  background: string;
  backgroundImage?: string;
  gridColors?: string[];
  textElements?: TextElement[];
  imageElements?: ImageElement[];
  elements?: TemplateElement[];
};

export interface EditorHistoryEntry {
  // Document snapshot
  cardState: CardState;
  template: DualTemplate | null;

  // UI state
  selectedTextId: string | null;
  selectedGroupId: string | null;
  selectedImageId: string | null;
  isIsolationMode: boolean;
  elementsGrouped: boolean;
  mode:CanvasMode;
  pendingStyle: Record<string, any>;
  // Add more UI flags as needed (toolbar visibility, input position, etc.)
}
