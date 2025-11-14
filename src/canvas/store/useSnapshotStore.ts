import { SnapshotEntry } from '@/src/types/SnapshotEntry';
import { StateCreator } from 'zustand';

export interface SnapshotSlice {
  snapshots: { front: string | null; back: string | null };
  setSnapshots: (
    s:
      | { front: string | null; back: string | null }
      | ((prev: { front: string | null; back: string | null }) => { front: string | null; back: string | null })
  ) => void;

  canvasReady: boolean;
  setCanvasReady: (b: boolean | ((prev: boolean) => boolean)) => void;

  showGallery: boolean;
  setShowGallery: (b: boolean | ((prev: boolean) => boolean)) => void;

  showExportModal: boolean;
  setShowExportModal: (b: boolean | ((prev: boolean) => boolean)) => void;

  showPages: boolean;
  setShowPages: (b: boolean | ((prev: boolean) => boolean)) => void;

  insideMessage: string | null;
  setInsideMessage: (m: string | null | ((prev: string | null) => string | null)) => void;

  previewEntry: SnapshotEntry | null;
  setPreviewEntry: (entry: SnapshotEntry | null | ((prev: SnapshotEntry | null) => SnapshotEntry | null)) => void;

  snapshotArchive: SnapshotEntry[];
  setSnapshotArchive: (
    updater: SnapshotEntry[] | ((prev: SnapshotEntry[]) => SnapshotEntry[])
  ) => void;

  isPreviewing: boolean;
  setIsPreviewing: (b: boolean | ((prev: boolean) => boolean)) => void;
}

export const createSnapshotSlice: StateCreator<SnapshotSlice> = (set) => ({
  snapshots: { front: null, back: null },
  setSnapshots: (s) =>
    set((state) => ({
      snapshots: typeof s === 'function' ? s(state.snapshots) : s,
    })),

  canvasReady: false,
  setCanvasReady: (b) =>
    set((state) => ({
      canvasReady: typeof b === 'function' ? b(state.canvasReady) : b,
    })),

  showGallery: false,
  setShowGallery: (b) =>
    set((state) => ({
      showGallery: typeof b === 'function' ? b(state.showGallery) : b,
    })),

  showExportModal: false,
  setShowExportModal: (b) =>
    set((state) => ({
      showExportModal: typeof b === 'function' ? b(state.showExportModal) : b,
    })),

  showPages: false,
  setShowPages: (b) =>
    set((state) => ({
      showPages: typeof b === 'function' ? b(state.showPages) : b,
    })),

  insideMessage: null,
  setInsideMessage: (m) =>
    set((state) => ({
      insideMessage: typeof m === 'function' ? m(state.insideMessage) : m,
    })),

  previewEntry: null,
  setPreviewEntry: (entry) =>
    set((state) => ({
      previewEntry: typeof entry === 'function' ? entry(state.previewEntry) : entry,
    })),

  snapshotArchive: [],
  setSnapshotArchive: (updater) =>
    set((state) => ({
      snapshotArchive: typeof updater === 'function' ? updater(state.snapshotArchive) : updater,
    })),

  isPreviewing: false,
  setIsPreviewing: (b) =>
    set((state) => ({
      isPreviewing: typeof b === 'function' ? b(state.isPreviewing) : b,
    })),
});
