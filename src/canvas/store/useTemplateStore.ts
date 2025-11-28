import { DualTemplate, TemplateDocument, TemplateElement } from '@/src/types/template';
import { HistoryEntry } from '@/src/types/HistoryEntry';
import { StateCreator } from 'zustand';

export interface TemplateSlice {
  activePageId: string;
  setActivePageId: (id: string | ((prev: string) => string)) => void;

  templateDocuments: TemplateDocument[];
  setDocumentTemplates: (
    docs: TemplateDocument[] | ((prev: TemplateDocument[]) => TemplateDocument[])
  ) => void;

  dualFaces: DualTemplate[];
  setDualFaces: (
    faces: DualTemplate[] | ((prev: DualTemplate[]) => DualTemplate[])
  ) => void;

  lastSavedTemplate: DualTemplate | null;
  setLastSavedTemplate: (
    t: DualTemplate | null | ((prev: DualTemplate | null) => DualTemplate | null)
  ) => void;

  hasChanged: boolean;
  setHasChanged: (b: boolean | ((prev: boolean) => boolean)) => void;

  maxPageCount: number;
  setMaxPageCount: (count: number | ((prev: number) => number)) => void;

  templateReady: boolean;
  setTemplateReady: (b: boolean | ((prev: boolean) => boolean)) => void;

  templateSelected: boolean;
  setTemplateSelected: (b: boolean | ((prev: boolean) => boolean)) => void;

  templateRendering: boolean;
  setTemplateRendering: (b: boolean | ((prev: boolean) => boolean)) => void;

  history: HistoryEntry[];
  setHistory: (
    h: HistoryEntry[] | ((prev: HistoryEntry[]) => HistoryEntry[])
  ) => void;

  future: HistoryEntry[];
  setFuture: (
    f: HistoryEntry[] | ((prev: HistoryEntry[]) => HistoryEntry[])
  ) => void;

  template: DualTemplate | null;
  setTemplate: (
    t: DualTemplate | null | ((prev: DualTemplate | null) => DualTemplate | null)
  ) => void;



  templateElement: TemplateElement | null;
  setTemplateElement: (
    t: TemplateElement | null | ((prev: TemplateElement | null) => TemplateElement | null)
  ) => void;

  selectedDualTemplate: DualTemplate | null;
  setSelectedDualTemplate: (
    t: DualTemplate | null | ((prev: DualTemplate | null) => DualTemplate | null)
  ) => void;
}

export const createTemplateSlice: StateCreator<TemplateSlice> = (set) => ({
  activePageId: 'front',
  setActivePageId: (id) =>
    set((state) => ({
      activePageId: typeof id === 'function' ? id(state.activePageId) : id,
    })),

  templateDocuments: [],
  setDocumentTemplates: (docs) =>
    set((state) => ({
      templateDocuments:
        typeof docs === 'function' ? docs(state.templateDocuments) : docs,
    })),

  dualFaces: [],
  setDualFaces: (faces) =>
    set((state) => ({
      dualFaces: typeof faces === 'function' ? faces(state.dualFaces) : faces,
    })),

  lastSavedTemplate: null,
  setLastSavedTemplate: (t) =>
    set((state) => ({
      lastSavedTemplate:
        typeof t === 'function' ? t(state.lastSavedTemplate) : t,
    })),

  hasChanged: false,
  setHasChanged: (b) =>
    set((state) => ({
      hasChanged: typeof b === 'function' ? b(state.hasChanged) : b,
    })),

  maxPageCount: 2,
  setMaxPageCount: (count) =>
    set((state) => ({
      maxPageCount: typeof count === 'function' ? count(state.maxPageCount) : count,
    })),

  templateReady: false,
  setTemplateReady: (b) =>
    set((state) => ({
      templateReady: typeof b === 'function' ? b(state.templateReady) : b,
    })),

  templateSelected: false,
  setTemplateSelected: (b) =>
    set((state) => ({
      templateSelected: typeof b === 'function' ? b(state.templateSelected) : b,
    })),

  templateRendering: false,
  setTemplateRendering: (b) =>
    set((state) => ({
      templateRendering: typeof b === 'function' ? b(state.templateRendering) : b,
    })),

  history: [],
  setHistory: (h) =>
    set((state) => ({
      history: typeof h === 'function' ? h(state.history) : h,
    })),

  future: [],
  setFuture: (f) =>
    set((state) => ({
      future: typeof f === 'function' ? f(state.future) : f,
    })),

  template: null,
  setTemplate: (t) =>
    set((state) => ({
      template: typeof t === 'function' ? t(state.template) : t,
    })),


    templateElement: null,
    setTemplateElement: (t) =>
      set((state) => ({
        templateElement: typeof t === 'function' ? t(state.templateElement) : t,
      })),
  


    selectedDualTemplate: null,
    setSelectedDualTemplate: (t) =>
      set((state) => ({
        selectedDualTemplate: typeof t === 'function' ? t(state.selectedDualTemplate) : t,
      })),
});
