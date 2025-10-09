// src/types/Reflection.ts
export type Reflection = {
    id: number;
    designId: number;
    elementId?: string | null;
    message: string;
    tone: 'celebration' | 'concern' | 'suggestion' | 'question';
    resolved: number;
    createdBy: string;
    createdAt: string;
  };