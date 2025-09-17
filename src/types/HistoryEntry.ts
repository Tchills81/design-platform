import { type CardState } from "./CardState";

export type HistoryEntry = {
    mode: 'painting' | 'card' | 'preview' | 'insideFace'
    
    cardState: CardState;
  };
  