// src/canvas/hooks/useCanvasState.ts



import { useMemo, useRef, useState } from "react";
import { useCanvasStore } from "../store/createCanvasStore";
import useImage from "use-image";
import { useOverlayPosition } from "./useOverlayPosition";
import { DesignElement } from "@/src/types/DesignElement";
import { usePageLimiter } from "@/src/utils/usePageLimiter";
import { useTransformMode } from "@/src/utils/useTransformMode";
import { shallow } from 'zustand/shallow';

import Konva from "konva";
import { computeOverlayControlPosition } from "./useOverlayControlPosition";





export function useCanvasState() {
  // Get the entire store object
  const store = useCanvasStore();
  

  // Destructure all your variables from the store object
  const {
    template,
    setTemplate,
    lastSavedTemplate,
    setLastSavedTemplate,
    templateDocuments,
    setDocumentTemplates,
    dualFaces,
    setDualFaces,
    history,
    setHistory,
    future,
    setFuture,
    hasChanged,
    setHasChanged,
    maxPageCount,
    setMaxPageCount,
    isTextLocked,
    toggleTextLock,
    duplicateTextById,
    deleteTextById,
    elementInserted,
    setElementInserted,
    setLockedTextIds,
    lockedTextIds,

    
    


    //Chunk 2: 🧭 Modes and Navigation
    mode,
  setMode,
  side,
  setSide,
  faceMode,
  setFaceMode,
  viewMode,
  setViewMode,
  designInside,
  setDesignInside,
  designComplete,
  setDesignComplete,
  prepareForPrint,
  setPrepareForPrint,
  animatedCells,
  setAnimatedCells,


    //Chunk 3: 🖋️ Text Editing


    selectedTextId,
    setSelectedTextId,
    selectedFont,
    setSelectedFont,
    selectedFontSize,
    setSelectedFontSize,
    editingText,
    setEditingText,
    editingTextId,
    setEditingTextId,
    inputPosition,
    setInputPosition,
    pendingStyle,
    setPendingStyle,
    textAlign,
    setTextAlign,
    isMultiline,
    setIsMultline,
    isUnderline,
    setIsUnderline,
    showOverlayInput,
    setShowOverlayInput,


     //Chunk 4: 🖼️ Image Editing
  selectedImageId,
  setSelectedImageId,
  cropRegion,
  setCropRegion,
  cropModeActive,
  setCropModeActive,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  selectedColor,
  setSelectedColor,
  previewSrc,
  setPreviewSrc,
  previewRole,
  setPreviewRole,


  // Chunk 5: 🧰 UI Overlays and Toolbars
  showGuides,
  setShowGuides,
  showToolbar,
  setShowToolbar,
  isImageToolbar,
  setIsImageToolbar,
  portalTarget,
  setPortalTarget,
  showReflectionModal,
  setShowReflectionModal,
  showCommentModal,
  setShowCommentModal,
  showShareModal,
  setShowShareModal,


  //Chunk 6: 📐 Layout and Geometry
  zoom,
  setZoom,
  initialZoomedOutValue,
  setInitialZoomedOutValue,
  scrollPosition,
  setScrollPosition,
  stageSize,
  setStageSize,
  cellSize,
  setCellSize,
  position,
  setPosition,
  gridPosition,
  setGridPosition,
  showRulers,
  setShowRulers,
  showBleeds,
  setShowBleeds,
  showGrids,
  setShowGrids,
  bleedToggleDisabled,
  setBleedToggleDisabled,
  dynamicBackground,
  setDynamicBackground,
  showBackground,
  setShowBackground,
  canvasReady,
  setCanvasReady,
  canvasBounds,


  //Chunk 7: 📸 Snapshots and Export
  snapshots,
  setSnapshots,
  snapshotArchive,
  setSnapshotArchive,

  showGallery,
  setShowGallery,
  showExportModal,
  setShowExportModal,
  showPages,
  setShowPages,
  insideMessage,
  setInsideMessage,
  ghostLines,
  ghostOpacity,
  setGhostLines,

  //Chunk 8: 🧠 Context and Panel State

  konvaText,
  setKonvaText,
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  activeIndex,
  setActiveIndex,
  isTransitioningTemplate,
  setIsTransitioningTemplate,
  setAccessLevel,


      // 🧠 Layout Memory and Flow
lastFaceHash,
setLastFaceHash,
activeTimestamp,
setActiveTimestamp,
pageAdded,
setPageAdded,
stripHeight,
setStripHeight,
largeContainerSize,
setLargeContainerSize,
canvasSize,
setCanvasSize,
hasInitialized,
setHasInitialized,
designElements,
setDesignElements,




designElement,
setDesignElement,

initialPosition,
setInitailPosition,
setTextControlPosition,
textControlPosition,



// 🧠 Snapshot & Preview
previewEntry,
setPreviewEntry,
isPreviewing,
setIsPreviewing,

// 🧠 Overlay Style
overlayStyle,
setOverlayStyle,
overlayProps,
setOverlayProps,
setIsFullScreen,

// 🧠 Template Rendering Flags
templateReady,
setTemplateReady,
templateSelected,
setTemplateSelected,
templateRendering,
setTemplateRendering,
setActivePageId,
// 🧠 Reflections
reflections,
setReflections,

// 🧠 Layout Timeout
//fadeTimeout,
setFadeTimeout,

setElementId,
stageStyle,
thumbValue,
isPreviewMode,
//hasInitializedZoom,
initailPosition,
scrollOffset,

setScrollOffset,
verticalOffset,


setStageStyle,

accessLevel,
setGhostOpacity,

setVisible,
setThumbValue,

setIsPreviewMode,

setVerticalOffset,


setModes,
modes,
elementId,

selectedDualTemplate,
setSelectedDualTemplate

  


  } = store;

 
const toolbarRef = useRef<HTMLDivElement | null>(null);
const sideBarRef = useRef<HTMLDivElement | null>(null);
const topBarRef = useRef<HTMLDivElement | null>(null);
const footerClusterRef = useRef<HTMLDivElement | null>(null);
const imageRef = useRef<Konva.Image>(null);
const containerRef = useRef<HTMLDivElement | null>(null);
const cardGridGroupRef = useRef<any>(null);
const stageRef = useRef<any>(null);
const scrollContainerRef = useRef<HTMLDivElement | null>(null);
const positionRef = useRef<{ x: number; y: number } | null>(null);
const textToolbarRef = useRef<HTMLDivElement | null>(null);
const SidebarTabsRef = useRef<HTMLDivElement | null>(null);
const PanelRef = useRef<HTMLDivElement | null>(null);
const stripRef = useRef<HTMLDivElement | null>(null);
const elementRef = useRef<HTMLDivElement>(null);
const hasInitializedZoom = useRef(false);
const fadeTimeout = useRef<NodeJS.Timeout | null>(null);
const imagebarRef = useRef<HTMLDivElement>(null);
const textControlsRef = useRef<HTMLDivElement | null >(null);

const textAreaRef = useRef<HTMLTextAreaElement | null >(null);




 const SIDEBAR_WIDTH = 60; // or 280 if panel is open
 const TOPBAR_OFFSET = 30; // or 280 if panel is open
 const PANEL_WIDTH = 385;

  const canvasWidth = canvasBounds?.width ?? 0;
  const canvasHeight = canvasBounds?.height ?? 0;



  const computePosition = useOverlayPosition();
  

 
  





  // 🧠 Chunk 9: Derived Values and Geometry
  const activeFace = template?.[side];
  const card = activeFace?.card;
  const elements = activeFace?.elements ?? [];
  const tone = template?.tone ?? 'light';

  const selectedElement = selectedTextId
    ? elements.find((el) => el.id === selectedTextId)
    : undefined;

  const isBold = selectedElement?.type === 'text' ? selectedElement.isBold ?? false : false;
  const isItalic = selectedElement?.type === 'text' ? selectedElement.isItalic ?? false : false;

  const [bgImage] = useImage(card?.backgroundImage || '');
  const [frontImage] = useImage(template?.front?.card.backgroundImage || '');
  const [backImage] = useImage(template?.back?.card.backgroundImage || '');

  const gridColors = card?.gridColors ?? [];
  const cardX = (stageSize.width - (card?.width ?? 0)) / 2;
  const cardY = (stageSize.height - (card?.height ?? 0)) / 2;

  const cols = Math.floor((card?.width ?? 0) / (cellSize ?? 1));
  const rows = Math.floor((card?.height ?? 0) / (cellSize ?? 1));


  const {
    maxCount,
    currentPageCount,
    canAddPage,
    isMaxReached,
    limitStatus
  } = usePageLimiter(template, snapshotArchive);


  const layoutMode = useMemo(() => {
    if (stageSize.width < 600) return 'compact';
    if (stageSize.width < 1024) return 'scroll';
    return 'grid';
  }, [stageSize.width]);


  const getCanvasOffset = (): { x: number; y: number } => ({
    x: 0,
    y: 0,
  });
  


  
  
  const offsetBounds = getCanvasOffset();


  const {
    transformModeActive,
    activateTransformMode,
    resetTransformMode,
  } = useTransformMode();
  
  const setTransformModeActive = (bool: boolean) => {
    activateTransformMode(selectedImageId ?? '', 'image');
  };


  const updateImageRef = (ref: Konva.Image | null) => {
    imageRef.current = ref;
  };
  
  
  
  
  

  return {
    // 🎨 Template and History
    template,
    setTemplate,
    lastSavedTemplate,
    setLastSavedTemplate,
    templateDocuments,
    setDocumentTemplates,
    dualFaces,
    setDualFaces,
    history,
    setHistory,
    future,
    setFuture,
    hasChanged,
    setHasChanged,
    maxPageCount,
    setMaxPageCount,
    setIsFullScreen,
  
    // 🧭 Modes and Navigation
    mode,
    setMode,
    side,
    setSide,
    faceMode,
    setFaceMode,
    viewMode,
    setViewMode,
    designInside,
    setDesignInside,
    designComplete,
    setDesignComplete,
    prepareForPrint,
    setPrepareForPrint,
    animatedCells,
    setAnimatedCells,
  
    // 🖋️ Text Editing
    selectedTextId,
    setSelectedTextId,
    selectedFont,
    setSelectedFont,
    selectedFontSize,
    setSelectedFontSize,
    editingText,
    setEditingText,
    editingTextId,
    setEditingTextId,
    inputPosition,
    setInputPosition,
    pendingStyle,
    setPendingStyle,
    textAlign,
    setTextAlign,
    isMultiline,
    setIsMultline,
    isUnderline,
    setIsUnderline,
    showOverlayInput,
    setShowOverlayInput,

    setInitailPosition,
    initialPosition,
  
    // 🖼️ Image Editing
    selectedImageId,
    setSelectedImageId,
    cropRegion,
    setCropRegion,
    cropModeActive,
    setCropModeActive,
    brushSize,
    setBrushSize,
    brushColor,
    setBrushColor,
    selectedColor,
    setSelectedColor,
    previewSrc,
    setPreviewSrc,
    previewRole,
    setPreviewRole,
  
    // 🧰 UI Overlays and Toolbars
    showGuides,
    setShowGuides,
    showToolbar,
    setShowToolbar,
    isImageToolbar,
    setIsImageToolbar,
    portalTarget,
    setPortalTarget,
    showReflectionModal,
    setShowReflectionModal,
    showCommentModal,
    setShowCommentModal,
    showShareModal,
    setShowShareModal,
  
    // 📐 Layout and Geometry
    zoom,
    setZoom,
    initialZoomedOutValue,
    setInitialZoomedOutValue,
    scrollPosition,
    setScrollPosition,
    stageSize,
    setStageSize,
    cellSize,
    setCellSize,
    position,
    setPosition,
    gridPosition,
    setGridPosition,
    showRulers,
    setShowRulers,
    showBleeds,
    setShowBleeds,
    showGrids,
    setShowGrids,
    bleedToggleDisabled,
    setBleedToggleDisabled,
    dynamicBackground,
    setDynamicBackground,
    showBackground,
    setShowBackground,
    canvasReady,
    setCanvasReady,
    canvasBounds,
  
    // 📸 Snapshots and Export
    snapshots,
    setSnapshots,
    snapshotArchive,
    setSnapshotArchive,
    showGallery,
    setShowGallery,
    showExportModal,
    setShowExportModal,
    showPages,
    setShowPages,
    insideMessage,
    setInsideMessage,
  
    // 🧠 Context and Panel State
    konvaText,
    setKonvaText,
    activeTab,
    setActiveTab,
    isCollapsed,
    setIsCollapsed,
    activeIndex,
    setActiveIndex,
    isTransitioningTemplate,
    setIsTransitioningTemplate,
  
    // 🧠 Derived Values and Geometry
    activeFace,
    card,
    elements,
    tone,
    selectedElement,
    isBold,
    isItalic,
    bgImage,
    frontImage,
    backImage,
    gridColors,
    cardX,
    cardY,
    cols,
    rows,


    // 🧠 Layout Memory and Flow
lastFaceHash,
setLastFaceHash,
activeTimestamp,
setActiveTimestamp,
pageAdded,
setPageAdded,
stripHeight,
setStripHeight,
largeContainerSize,
setLargeContainerSize,
canvasSize,
setCanvasSize,
hasInitialized,
setHasInitialized,
designElements,
setDesignElements,


// 🧠 Canvas Dimensions
canvasWidth,
canvasHeight,

// 🧠 Refs
toolbarRef,
sideBarRef,
topBarRef,
footerClusterRef,
imageRef,
containerRef,
cardGridGroupRef,
stageRef,
scrollContainerRef,
positionRef,
textToolbarRef,
SidebarTabsRef,
PanelRef,
stripRef,


designElement,
setDesignElement,



// 🧠 Constants
SIDEBAR_WIDTH,
TOPBAR_OFFSET,
PANEL_WIDTH,

// 🧠 Utilities
computePosition,
maxCount,
    currentPageCount,
    canAddPage,
    isMaxReached,
    limitStatus ,
    layoutMode,
    offsetBounds,
    transformModeActive,
    activateTransformMode,
    resetTransformMode,
    setTransformModeActive,
    updateImageRef,
    elementRef,

    // 🧠 Snapshot & Preview
previewEntry,
setPreviewEntry,
isPreviewing,
setIsPreviewing,

// 🧠 Overlay Style
overlayStyle,
setOverlayStyle,
overlayProps,
setOverlayProps,

// 🧠 Template Rendering Flags
templateReady,
setTemplateReady,
templateSelected,
setTemplateSelected,
templateRendering,
setTemplateRendering,

// 🧠 Reflections
reflections,
setReflections,

// 🧠 Layout Timeout
fadeTimeout,
setFadeTimeout,

  ghostLines,
  ghostOpacity,
  setGhostLines,
  setElementId,
stageStyle,
thumbValue,
isPreviewMode,
hasInitializedZoom,
initailPosition,
scrollOffset,

setScrollOffset,
verticalOffset,


setStageStyle,

accessLevel,
setGhostOpacity,

setVisible,
setThumbValue,

setIsPreviewMode,
setAccessLevel,

setVerticalOffset,
setActivePageId,

imagebarRef,

setModes,
modes,
elementId,

selectedDualTemplate,
setSelectedDualTemplate,

isTextLocked,
toggleTextLock,
duplicateTextById,
deleteTextById,
textControlsRef,
setTextControlPosition,
textControlPosition,
textAreaRef,
elementInserted,
setElementInserted,
setLockedTextIds,
lockedTextIds,


  };
  
}
