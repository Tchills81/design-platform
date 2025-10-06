import { CanvasMode } from "./CanvasMode";
import { type CardState } from "./CardState";

export type HistoryEntry = {
    mode: CanvasMode
    
    cardState: CardState;
  };
  