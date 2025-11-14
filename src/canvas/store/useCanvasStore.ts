import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Konva from 'konva';
import { DualTemplate, TemplateDocument } from '@/src/types/template';
import { DesignElement } from '@/src/types/DesignElement';
import { SnapshotEntry } from '@/src/types/SnapshotEntry';
import { HistoryEntry } from '@/src/types/HistoryEntry';
import { CanvasMode } from '@/src/types/CanvasMode';
import { AccessLevel } from '@/src/types/access';
import { SidebarTab } from '@/src/types/Tab';
import { TextToolbarOverlayProps } from '@/src/canvas/overlays/TextToolbarOverlay';

interface CanvasStore {

template: DualTemplate | null;
setTemplate: (t: DualTemplate | null) => void;

templateDocuments: TemplateDocument[];
setTemplateDocuments: (docs: TemplateDocument[]) => void;

dualFaces: DualTemplate[];
setDualFaces: (faces: DualTemplate[]) => void;

activePageId: string;
setActivePageId: (id: string) => void;

pageAdded: boolean;
setPageAdded: (b: boolean) => void;

lastSavedTemplate: DualTemplate | null;
setLastSavedTemplate: (t: DualTemplate | null) => void;

history: HistoryEntry[];
setHistory: (h: HistoryEntry[]) => void;

future: HistoryEntry[];
setFuture: (f: HistoryEntry[]) => void;

lastFaceHash: string | null;
setLastFaceHash: (hash: string | null) => void;

hasChanged: boolean;
setHasChanged: (b: boolean) => void;

maxPageCount: number;
setMaxPageCount: (count: number) => void;

zoom: number;
setZoom: (z: number) => void;

designElements: DesignElement[];
setDesignElements: (elements: DesignElement[]) => void;

snapshotArchive: SnapshotEntry[];
setSnapshotArchive: (archive: SnapshotEntry[]) => void;

templateReady: boolean;
setTemplateReady: (ready: boolean) => void;

mode: CanvasMode;
setMode: (m: CanvasMode) => void;

side: 'front' | 'back';
setSide: (s: 'front' | 'back') => void;

accessLevel: AccessLevel;
setAccessLevel: (level: AccessLevel) => void;

templateRendering: boolean;
setTemplateRendering: (b: boolean) => void;


modes: CanvasMode[];
setModes: (modes: CanvasMode[]) => void;

faceMode: CanvasMode;
setFaceMode: (m: CanvasMode) => void;

viewMode: 'default' | 'spread';
setViewMode: (v: 'default' | 'spread') => void;

designInside: boolean;
setDesignInside: (b: boolean) => void;

designComplete: boolean;
setDesignComplete: (b: boolean) => void;

prepareForPrint: boolean;
setPrepareForPrint: (b: boolean) => void;

animatedCells: Set<string>;
setAnimatedCells: (cells: Set<string>) => void;


editingTextId: string | null;
setEditingTextId: (id: string | null) => void;

editingText: string;
setEditingText: (text: string) => void;

selectedTextId: string | null;
setSelectedTextId: (id: string | null) => void;

selectedFont: string;
setSelectedFont: (font: string) => void;

selectedFontSize: number;
setSelectedFontSize: (size: number) => void;

inputPosition: { x: number; y: number } | null;
setInputPosition: (pos: { x: number; y: number } | null) => void;

pendingStyle: { isBold?: boolean; isItalic?: boolean };
setPendingStyle: (style: { isBold?: boolean; isItalic?: boolean }) => void;

textAlign: 'left' | 'center' | 'right';
setTextAlign: (align: 'left' | 'center' | 'right') => void;

isMultiline: boolean;
setIsMultline: (b: boolean) => void;

isUnderline: boolean;
setIsUnderline: (b: boolean) => void;

isBold: boolean;
setIsBold: (b: boolean) => void;

isItalic: boolean;
setIsItalic: (b: boolean) => void;

showOverlayInput: boolean;
setShowOverlayInput: (b: boolean) => void;

hasInitializedZoom: boolean;
setHasInitializedZoom: (b: boolean) => void;



selectedImageId: string | null;
setSelectedImageId: (id: string | null) => void;

cropModeActive: boolean;
setCropModeActive: (b: boolean) => void;

cropRegion: { x: number; y: number; width: number; height: number };
setCropRegion: (r: { x: number; y: number; width: number; height: number }) => void;

brushSize: number;
setBrushSize: (size: number) => void;

brushColor: string;
setBrushColor: (color: string) => void;

selectedColor: string;
setSelectedColor: (color: string) => void;

previewSrc: string | null;
setPreviewSrc: (src: string | null) => void;

previewRole: 'background' | 'element';
setPreviewRole: (role: 'background' | 'element') => void;




stageSize: { width: number; height: number };
setStageSize: (size: { width: number; height: number }) => void;

canvasBounds: { x: number; y: number; width: number; height: number };
setCanvasBounds: (bounds: { x: number; y: number; width: number; height: number }) => void;

cellSize: number;
setCellSize: (size: number) => void;

position: { x: number; y: number };
setPosition: (pos: { x: number; y: number }) => void;

ghostLines: { x?: number; y?: number };
setGhostLines: (lines: { x?: number; y?: number }) => void;

ghostOpacity: number;
setGhostOpacity: (opacity: number) => void;

gridPosition: { x: number; y: number; width: number; height: number } | null;
setGridPosition: (pos: { x: number; y: number; width: number; height: number } | null) => void;

viewportSize: { width: number; height: number };
setViewportSize: (size: { width: number; height: number }) => void;

visible: boolean;
setVisible: (b: boolean) => void;

scrollPosition: { x: number; y: number };
setScrollPosition: (pos: { x: number; y: number }) => void;

thumbValue: number;
setThumbValue: (v: number) => void;

verticalOffset: number;
setVerticalOffset: (v: number) => void;


showGuides: boolean;
setShowGuides: (b: boolean) => void;

showToolbar: boolean;
setShowToolbar: (b: boolean) => void;

isImageToolbar: boolean;
setIsImageToolbar: (b: boolean) => void;

portalTarget: HTMLElement | null;
setPortalTarget: (el: HTMLElement | null) => void;

showReflectionModal: boolean;
setShowReflectionModal: (b: boolean) => void;

showCommentModal: boolean;
setShowCommentModal: (b: boolean) => void;

showShareModal: boolean;
setShowShareModal: (b: boolean) => void;

overlayProps: Partial<TextToolbarOverlayProps> | null;
setOverlayProps: (props: Partial<TextToolbarOverlayProps> | null) => void;



snapshots: { front: string | null; back: string | null };
setSnapshots: (s: { front: string | null; back: string | null }) => void;


canvasReady: boolean;
setCanvasReady: (b: boolean) => void;

showGallery: boolean;
setShowGallery: (b: boolean) => void;

showExportModal: boolean;
setShowExportModal: (b: boolean) => void;

showPages: boolean;
setShowPages: (b: boolean) => void;

insideMessage: string | null;
setInsideMessage: (m: string | null) => void;


konvaText: Konva.Text | null;
setKonvaText: (k: Konva.Text | null) => void;

activeTab: SidebarTab | null;
setActiveTab: (tab: SidebarTab | null) => void;

isCollapsed: boolean;
setIsCollapsed: (b: boolean) => void;

activeIndex: number | null;
setActiveIndex: (i: number | null) => void;

isTransitioningTemplate: boolean;
setIsTransitioningTemplate: (b: boolean) => void;

transformMode: 'move' | 'resize' | 'rotate' | null;
setTransformMode: (mode: 'move' | 'resize' | 'rotate' | null) => void;

initialZoomedOutValue: number;
setInitialZoomedOutValue: (v: number) => void;





}


export const useCanvasStore = create<CanvasStore>()(
    persist(
      (set) => ({
        // 🔹 Existing state values and setters
        template: null,
        setTemplate: (t) => set({ template: t }),
  
        // 🔹 Insert the rest of your block here
        templateDocuments: [],
        setTemplateDocuments: (docs) => set({ templateDocuments: docs }),
  
        dualFaces: [],
        setDualFaces: (faces) => set({ dualFaces: faces }),
  
        activePageId: 'front',
        setActivePageId: (id) => set({ activePageId: id }),
  
        pageAdded: false,
        setPageAdded: (b) => set({ pageAdded: b }),
  
        lastSavedTemplate: null,
        setLastSavedTemplate: (t) => set({ lastSavedTemplate: t }),
  
        history: [],
        setHistory: (h) => set({ history: h }),
  
        future: [],
        setFuture: (f) => set({ future: f }),
  
        lastFaceHash: null,
        setLastFaceHash: (hash) => set({ lastFaceHash: hash }),
  
        hasChanged: false,
        setHasChanged: (b) => set({ hasChanged: b }),
  
        maxPageCount: 2,
        setMaxPageCount: (count) => set({ maxPageCount: count }),

        zoom: 1,
setZoom: (z) => set({ zoom: z }),

designElements: [],
setDesignElements: (elements) => set({ designElements: elements }),

snapshotArchive: [],
setSnapshotArchive: (archive) => set({ snapshotArchive: archive }),

templateReady: false,
setTemplateReady: (ready) => set({ templateReady: ready }),

mode: 'card',
setMode: (m) => set({ mode: m }),

side: 'front',
setSide: (s) => set({ side: s }),

accessLevel: 'view',
setAccessLevel: (level) => set({ accessLevel: level }),
templateRendering: false,
setTemplateRendering: (b) => set({ templateRendering: b }),

modes: ['front', 'back'],
setModes: (modes) => set({ modes }),

faceMode: 'front',
setFaceMode: (m) => set({ faceMode: m }),

viewMode: 'default',
setViewMode: (v) => set({ viewMode: v }),

designInside: false,
setDesignInside: (b) => set({ designInside: b }),

designComplete: false,
setDesignComplete: (b) => set({ designComplete: b }),

prepareForPrint: false,
setPrepareForPrint: (b) => set({ prepareForPrint: b }),

animatedCells: new Set<string>(),
setAnimatedCells: (cells) => set({ animatedCells: cells }),

editingTextId: null,
setEditingTextId: (id) => set({ editingTextId: id }),

editingText: '',
setEditingText: (text) => set({ editingText: text }),

selectedTextId: null,
setSelectedTextId: (id) => set({ selectedTextId: id }),

selectedFont: '--font-inter',
setSelectedFont: (font) => set({ selectedFont: font }),

selectedFontSize: 8,
setSelectedFontSize: (size) => set({ selectedFontSize: size }),

inputPosition: null,
setInputPosition: (pos) => set({ inputPosition: pos }),

pendingStyle: {},
setPendingStyle: (style) => set({ pendingStyle: style }),

textAlign: 'left',
setTextAlign: (align) => set({ textAlign: align }),

isMultiline: false,
setIsMultline: (b) => set({ isMultiline: b }),

isUnderline: false,
setIsUnderline: (b) => set({ isUnderline: b }),

isBold: false,
setIsBold: (b) => set({ isBold: b }),

isItalic: false,
setIsItalic: (b) => set({ isItalic: b }),

showOverlayInput: false,
setShowOverlayInput: (b) => set({ showOverlayInput: b }),

selectedImageId: null,
setSelectedImageId: (id) => set({ selectedImageId: id }),

cropModeActive: false,
setCropModeActive: (b) => set({ cropModeActive: b }),

cropRegion: { x: 0, y: 0, width: 100, height: 100 },
setCropRegion: (r) => set({ cropRegion: r }),

brushSize: 12,
setBrushSize: (size) => set({ brushSize: size }),

brushColor: '#ff0000',
setBrushColor: (color) => set({ brushColor: color }),

selectedColor: '#ff595e',
setSelectedColor: (color) => set({ selectedColor: color }),

previewSrc: null,
setPreviewSrc: (src) => set({ previewSrc: src }),

previewRole: 'background',
setPreviewRole: (role) => set({ previewRole: role }),



stageSize: { width: 0, height: 0 },
setStageSize: (size) => set({ stageSize: size }),

canvasBounds: { x: 0, y: 0, width: 0, height: 0 },
setCanvasBounds: (bounds) => set({ canvasBounds: bounds }),

cellSize: 20,
setCellSize: (size) => set({ cellSize: size }),

position: { x: 0, y: 0 },
setPosition: (pos) => set({ position: pos }),

ghostLines: {},
setGhostLines: (lines) => set({ ghostLines: lines }),

ghostOpacity: 0,
setGhostOpacity: (opacity) => set({ ghostOpacity: opacity }),

gridPosition: null,
setGridPosition: (pos) => set({ gridPosition: pos }),

viewportSize: { width: 0, height: 0 },
setViewportSize: (size) => set({ viewportSize: size }),

visible: true,
setVisible: (b) => set({ visible: b }),

scrollPosition: { x: 0, y: 0 },
setScrollPosition: (pos) => set({ scrollPosition: pos }),

thumbValue: 0,
setThumbValue: (v) => set({ thumbValue: v }),

verticalOffset: 0,
setVerticalOffset: (v) => set({ verticalOffset: v }),

showGuides: true,
setShowGuides: (b) => set({ showGuides: b }),

showToolbar: false,
setShowToolbar: (b) => set({ showToolbar: b }),

isImageToolbar: false,
setIsImageToolbar: (b) => set({ isImageToolbar: b }),

portalTarget: null,
setPortalTarget: (el) => set({ portalTarget: el }),

showReflectionModal: false,
setShowReflectionModal: (b) => set({ showReflectionModal: b }),

showCommentModal: false,
setShowCommentModal: (b) => set({ showCommentModal: b }),

showShareModal: false,
setShowShareModal: (b) => set({ showShareModal: b }),

overlayProps: null,
setOverlayProps: (props) => set({ overlayProps: props }),


snapshots: { front: null, back: null },
setSnapshots: (s) => set({ snapshots: s }),



canvasReady: false,
setCanvasReady: (b) => set({ canvasReady: b }),

showGallery: false,
setShowGallery: (b) => set({ showGallery: b }),

showExportModal: false,
setShowExportModal: (b) => set({ showExportModal: b }),

showPages: false,
setShowPages: (b) => set({ showPages: b }),

insideMessage: null,
setInsideMessage: (m) => set({ insideMessage: m }),

konvaText: null,
setKonvaText: (k) => set({ konvaText: k }),

activeTab: null,
setActiveTab: (tab) => set({ activeTab: tab }),

isCollapsed: true,
setIsCollapsed: (b) => set({ isCollapsed: b }),

activeIndex: null,
setActiveIndex: (i) => set({ activeIndex: i }),

isTransitioningTemplate: false,
setIsTransitioningTemplate: (b) => set({ isTransitioningTemplate: b }),

transformMode: null,
setTransformMode: (mode) => set({ transformMode: mode }),

initialZoomedOutValue: 1,
setInitialZoomedOutValue: (v) => set({ initialZoomedOutValue: v }),

hasInitializedZoom: false,
setHasInitializedZoom: (b) => set({ hasInitializedZoom: b }),



        // 🔹 Continue with other state values and setters...
      }),
      {
        name: 'canvas-storage',
        partialize: (state) => ({

            //Chunk 1: 🎨 Core Template and History
            template: state.template,
            lastSavedTemplate: state.lastSavedTemplate,
            templateDocuments: state.templateDocuments,
            dualFaces: state.dualFaces,
            history: state.history,
            future: state.future,
            templateReady: state.templateReady,
            templateRendering: state.templateRendering,
            hasChanged: state.hasChanged,
            maxPageCount: state.maxPageCount,

            //Chunk 2: 🧭 Modes and Navigation
            mode: state.mode,
            side: state.side,
            faceMode: state.faceMode,
            viewMode: state.viewMode,
            designInside: state.designInside,
            designComplete: state.designComplete,
            accessLevel: state.accessLevel,
            prepareForPrint: state.prepareForPrint,
            animatedCells: state.animatedCells,

            //Chunk 3: 🖋️ Text Editing and Styling
            selectedTextId: state.selectedTextId,
            selectedFont: state.selectedFont,
            selectedFontSize: state.selectedFontSize,
            textAlign: state.textAlign,
            isMultiline: state.isMultiline,
            isUnderline: state.isUnderline,
            isBold: state.isBold,
            isItalic: state.isItalic,
            editingText: state.editingText,
            editingTextId: state.editingTextId,
            pendingStyle: state.pendingStyle,
            showOverlayInput: state.showOverlayInput,

            //Chunk 4: 🖼️ Image Editing and Painting
            selectedImageId: state.selectedImageId,
            cropRegion: state.cropRegion,
            cropModeActive: state.cropModeActive,
            brushSize: state.brushSize,
            brushColor: state.brushColor,
            selectedColor: state.selectedColor,
            previewSrc: state.previewSrc,
            previewRole: state.previewRole,
            
            //Chunk 5: 📐 Layout, Geometry, and Scroll
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
viewportSize: state.viewportSize,
visible: state.visible,
scrollPosition: state.scrollPosition,
thumbValue: state.thumbValue,
verticalOffset: state.verticalOffset,


//Chunk 6: 🧰 UI Overlays and Toolbars
showGuides: state.showGuides,
showToolbar: state.showToolbar,
isImageToolbar: state.isImageToolbar,
portalTarget: state.portalTarget,
showReflectionModal: state.showReflectionModal,
showCommentModal: state.showCommentModal,
showShareModal: state.showShareModal,
overlayProps: state.overlayProps,

//Chunk 7: 📸 Snapshots and Export
snapshots: state.snapshots,
snapshotArchive: state.snapshotArchive,
canvasReady: state.canvasReady,
showGallery: state.showGallery,
showExportModal: state.showExportModal,
showPages: state.showPages,
insideMessage: state.insideMessage,


//Chunk 8: 🧠 Refs, Context, and Transform Logic
konvaText: state.konvaText,
activeTab: state.activeTab,
isCollapsed: state.isCollapsed,
activeIndex: state.activeIndex,
isTransitioningTemplate: state.isTransitioningTemplate,
transformMode: state.transformMode,






//



            
        }),
      }
    )
  );
  
 

