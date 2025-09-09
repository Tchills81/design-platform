import { type CardState } from "./CardState";

export type HistoryEntry = {
    mode: 'painting' | 'card' | 'preview'
    
    cardState: CardState;
  };
  