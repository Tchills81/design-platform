import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreApi, UseBoundStore } from 'zustand';

import { createTemplateSlice, TemplateSlice } from './useTemplateStore';
import { createModeSlice, ModeSlice } from './useModeStore';
import { createTextSlice, TextSlice } from './useTextStore';
import { createImageSlice, ImageSlice } from './useImageStore';
import { createLayoutSlice, LayoutSlice } from './useLayoutStore';
import { createOverlaySlice, OverlaySlice } from './useOverlayStore';
import { createSnapshotSlice, SnapshotSlice } from './useSnapshotStore';
import { createContextSlice, ContextSlice } from './useContextStore';

type CanvasStore = TemplateSlice &
  ModeSlice &
  TextSlice &
  ImageSlice &
  LayoutSlice &
  OverlaySlice &
  SnapshotSlice &
  ContextSlice;

export const useCanvasStore: UseBoundStore<StoreApi<CanvasStore>> = create<CanvasStore>()(
  persist(
    (set, get, store) => ({
      ...createTemplateSlice(set, get, store),
      ...createModeSlice(set, get, store),
      ...createTextSlice(set, get, store),
      ...createImageSlice(set, get, store),
      ...createLayoutSlice(set, get, store),
      ...createOverlaySlice(set, get, store),
      ...createSnapshotSlice(set, get, store),
      ...createContextSlice(set, get, store),
    }),
    {
      name: 'canvas-storage',
      partialize: (state) => ({
        // 🎨 Template
        template: state.template,
        lastSavedTemplate: state.lastSavedTemplate,
        templateDocuments: state.templateDocuments,
        dualFaces: state.dualFaces,
        history: state.history,
        future: state.future,
        hasChanged: state.hasChanged,
        maxPageCount: state.maxPageCount,
        templateReady: state.templateReady,
        templateSelected: state.templateSelected,
        templateRendering: state.templateRendering,

        // 🧭 Modes
        mode: state.mode,
        side: state.side,
        accessLevel: state.accessLevel,
        modes: state.modes,
        faceMode: state.faceMode,
        viewMode: state.viewMode,
        designInside: state.designInside,
        designComplete: state.designComplete,
        prepareForPrint: state.prepareForPrint,
        animatedCells: state.animatedCells,

        // 🖋️ Text
        selectedTextId: state.selectedTextId,
        selectedFont: state.selectedFont,
        selectedFontSize: state.selectedFontSize,
        textAlign: state.textAlign,
        isMultiline: state.isMultiline,
        isUnderline: state.isUnderline,
        editingText: state.editingText,
        editingTextId: state.editingTextId,
        pendingStyle: state.pendingStyle,
        showOverlayInput: state.showOverlayInput,

        // 🖼️ Image
        selectedImageId: state.selectedImageId,
        cropRegion: state.cropRegion,
        cropModeActive: state.cropModeActive,
        brushSize: state.brushSize,
        brushColor: state.brushColor,
        selectedColor: state.selectedColor,
        previewSrc: state.previewSrc,
        previewRole: state.previewRole,

        // 📐 Layout
        zoom: state.zoom,
        initialZoomedOutValue: state.initialZoomedOutValue,
        hasInitializedZoom: state.hasInitializedZoom,
        stageSize: state.stageSize,
        canvasBounds: state.canvasBounds,
        cellSize: state.cellSize,
        position: state.position,
        ghostLines: state.ghostLines,
        ghostOpacity: state.ghostOpacity,
        gridPosition: state.gridPosition,
        scrollPosition: state.scrollPosition,
        thumbValue: state.thumbValue,
        verticalOffset: state.verticalOffset,
        showRulers: state.showRulers,
        showBleeds: state.showBleeds,
        showGrids: state.showGrids,
        bleedToggleDisabled: state.bleedToggleDisabled,
        dynamicBackground: state.dynamicBackground,
        showBackground: state.showBackground,
        lastFaceHash: state.lastFaceHash,
        activeTimestamp: state.activeTimestamp,
        pageAdded: state.pageAdded,
        stripHeight: state.stripHeight,
        largeContainerSize: state.largeContainerSize,
        canvasSize: state.canvasSize,
        hasInitialized: state.hasInitialized,
        designElements: state.designElements,
        designElement: state.designElement,
        initialPosition: state.initialPosition,
        fadeTimeout: state.fadeTimeout,

        // 🧰 Overlays
        showGuides: state.showGuides,
        showToolbar: state.showToolbar,
        isImageToolbar: state.isImageToolbar,
        portalTarget: state.portalTarget,
        showReflectionModal: state.showReflectionModal,
        showCommentModal: state.showCommentModal,
        showShareModal: state.showShareModal,
        overlayStyle: state.overlayStyle,
        overlayProps: state.overlayProps,
        reflections: state.reflections,

        // 📸 Snapshots
        snapshots: state.snapshots,
        snapshotArchive: state.snapshotArchive,
        canvasReady: state.canvasReady,
        showGallery: state.showGallery,
        showExportModal: state.showExportModal,
        showPages: state.showPages,
        insideMessage: state.insideMessage,
        previewEntry: state.previewEntry,
        isPreviewing: state.isPreviewing,

        // 🧠 Context
        konvaText: state.konvaText,
        activeTab: state.activeTab,
        isCollapsed: state.isCollapsed,
        activeIndex: state.activeIndex,
        isTransitioningTemplate: state.isTransitioningTemplate,
        transformMode: state.transformMode,
      }),
    }
  )
);
