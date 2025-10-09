// src/canvas/hooks/useCanvasState.ts

import { useState, useRef, useMemo } from "react";
import { DualTemplate, Template } from "../../types/template";
import { HistoryEntry } from "../../types/HistoryEntry";
import { SnapshotEntry } from "../../types/SnapshotEntry";
import { CanvasMode } from "@/src/types/CanvasMode";
import useImage from "use-image";
import Konva from "konva";
import { useTransformMode } from "@/src/utils/useTransformMode";
import { DesignElement } from "@/src/types/DesignElement";
import { ELEMENT_LIBRARY } from "@/lib/elements";
export function useCanvasState() {
  // 🎨 Core template and history
  const [template, setTemplate] = useState<DualTemplate | null>(null);
  const [dualFaces, setDualFaces]=useState<DualTemplate[]>([])
  const [lastSavedTemplate, setLastSavedTemplate] = useState<DualTemplate | null>(null);
  
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);


  //refelections...
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [reflections, setReflections] = useState([]);
  const [showReflectionModal, setShowReflectionModal]=useState<boolean>(false);
  const [showShareModal, setShowShareModal]=useState<boolean>(false);
  const [elementId, setElementId]=useState<string>('');
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [designElement, setDesignElement]= useState<DesignElement>()

  // 🧭 Mode and navigation
  const [mode, setMode] = useState<CanvasMode>("card");
  const [side, setSide] = useState<"front" | "back">("front");
  const [faceMode, setFaceMode] = useState<CanvasMode>("front");
  const [viewMode, setViewMode] = useState<"default" | "spread">("default");
  const [designInside, setDesignInside] = useState<boolean>(false);
  const [designComplete, setDesignComplete] = useState<boolean>(false);
  const [prepareForPrint, setPrepareForPrint] = useState<boolean>(false);
  const [animatedCells, setAnimatedCells] = useState<Set<string>>(new Set());

  // 🖋️ Text editing
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string>("--font-inter");
  const [selectedFontSize, setSelectedFontSize] = useState<number>(8);
  const [editingText, setEditingText] = useState<string>("");
  const [inputPosition, setInputPosition] = useState<{ x: number; y: number } | null>(null);
  const [pendingStyle, setPendingStyle] = useState<{ isBold?: boolean; isItalic?: boolean }>({});
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [isMultiline, setIsMultline] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false)

  // 🖼️ Image editing
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [cropModeActive, setCropModeActive] = useState<boolean>(false);
  const [cropRegion, setCropRegion] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  // 🎨 Painting and color
  const [brushSize, setBrushSize] = useState<number>(12);
  const [brushColor, setBrushColor] = useState<string>("#ff0000");
  const [selectedColor, setSelectedColor] = useState<string>("#ff595e");

  // 🧰 UI overlays and toolbars
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [isImageToolbar, setIsImageToolbar] = useState<boolean>(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // 📐 Layout and guides
  const [showRulers, setShowRulers] = useState<boolean>(false);
  const [showBleeds, setShowBleeds] = useState<boolean>(true);
  const [showGrids, setShowGrids] = useState<boolean>(false);
  const [bleedToggleDisabled, setBleedToggleDisabled] = useState<boolean>(false);
  const [showGuides, setShowGuides] = useState<boolean>(true);

  // 🧭 Zoom and stage
  const [zoom, setZoom] = useState<number>(1);
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 🧩 Grid and geometry
  const [cellSize, setCellSize] = useState<number>(20);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ghostLines, setGhostLines] = useState<{ x?: number; y?: number }>({});
  const [ghostOpacity, setGhostOpacity] = useState<number>(0);
  const [dynamicBackground, setDynamicBackground] = useState<string>("#ffffff");
  const [showBackground, setShowBackground] = useState<boolean>(false);

  // 📸 Snapshots and export
  const [snapshots, setSnapshots] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });
  const [snapshotArchive, setSnapshotArchive] = useState<SnapshotEntry[]>([]);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [insideMessage, setInsideMessage] = useState<string | null>(null);

  // 🧠 Refs
  const imageRef = useRef<Konva.Image>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const imagebarRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 🧠 Derived values
  const activeFace = template?.[side];
  const card = activeFace?.card;
  const elements = activeFace?.elements ?? [];
  const tone = template?.tone ?? "light";

  const selectedElement = selectedTextId
    ? elements.find(el => el.id === selectedTextId)
    : undefined;

  const isBold = selectedElement?.type === "text" ? selectedElement.isBold ?? false : false;
  const isItalic = selectedElement?.type === "text" ? selectedElement.isItalic ?? false : false;

  const [bgImage] = useImage(card?.backgroundImage || "");
  const [frontImage] = useImage(template?.front?.card.backgroundImage || "");
  const [backImage] = useImage(template?.back?.card.backgroundImage || "");

  const gridColors = card?.gridColors ?? [];
  const cardX = (stageSize.width - (card?.width ?? 0)) / 2;
  const cardY = (stageSize.height - (card?.height ?? 0)) / 2;

  const cols = Math.floor((card?.width ?? 0) / (cellSize ?? 1));
  const rows = Math.floor((card?.height ?? 0) / (cellSize ?? 1));

  const canvasWidth = stageSize.width;
  const canvasHeight = stageSize.height;
  const [modes, setModes] = useState<CanvasMode[]>(['front','back'])

  const canvasBounds = useMemo(() => ({
    x: cardX ?? 0,
    y: cardY ?? 0,
    width: card?.width ?? 0,
    height: card?.height ?? 0,
  }), [cardX, cardY, card?.width]);

  const getCanvasOffset = (): { x: number; y: number } => ({
    x: canvasBounds.x,
    y: canvasBounds.y,
  });



  

  const offsetBounds = getCanvasOffset();




  const {
      transformModeActive,
      activateTransformMode,
      resetTransformMode,
    } = useTransformMode();
  
  
  
  
  const setTransformModeActive =(bool:boolean)=>
      {
          activateTransformMode(selectedImageId ?? '', 'image')
      }

  const updateImageRef = (ref: Konva.Image | null) => {
    imageRef.current = ref;
  };

  return {
    // 🖼️ Images
    frontImage,
    backImage,
    bgImage,


    // 🎨 Template and history
    template,
    setTemplate,
    dualFaces, 
    setDualFaces,
    elements,
    lastSavedTemplate,
    setLastSavedTemplate,
    history,
    setHistory,
    future,
    setFuture,

    modes, 
    setModes,

    animatedCells, 
    setAnimatedCells,

    transformModeActive,
    activateTransformMode,
    resetTransformMode,
    gridColors,

    //reflections

    reflections,
    setReflections,
    showReflectionModal, 
    setShowReflectionModal,
    showCommentModal, 
    setShowCommentModal,
    elementId, 
    setElementId,
    designElements, 
    setDesignElements,
    showShareModal, 
    setShowShareModal,
    designElement,
    setDesignElement,

    // 🧭 Modes and navigation
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

    // 🖋️ Text
    selectedTextId,
    setSelectedTextId,
    selectedFont,
    setSelectedFont,
    selectedFontSize,
    setSelectedFontSize,
    editingText,
    setEditingText,
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

    // 🖼️ Image
    selectedImageId,
    setSelectedImageId,
    cropModeActive,
    setCropModeActive,
    cropRegion,
    setCropRegion,
    setTransformModeActive,

    // 🎨 Painting
    brushSize,
    setBrushSize,
    brushColor,
    setBrushColor,
    selectedColor,
    setSelectedColor,
    showBackground, 
    setShowBackground,

    // 🧰 UI
    toolbarRef,
    showToolbar,
    setShowToolbar,
    isImageToolbar,
    setIsImageToolbar,
    portalTarget,
    setPortalTarget,

  // 📐 Layout
  showRulers,
  setShowRulers,
  showBleeds,
  setShowBleeds,
  showGrids, 
  setShowGrids,
  bleedToggleDisabled,
  setBleedToggleDisabled,
  showGuides,
  setShowGuides,
  zoom,
  setZoom,
  stageSize,
  setStageSize,
  canvasBounds,
  cellSize,
  setCellSize,
  position,
  setPosition,
  ghostLines,
  setGhostLines,
  ghostOpacity,
  setGhostOpacity,
  dynamicBackground,
  setDynamicBackground,

  // 🧠 Text styling
  isBold,
  isItalic,

  // 🎨 Grid and geometry
  card,
  cardX,
  cardY,
  cols,
  rows,
  canvasWidth,
  canvasHeight,
  offsetBounds,

  // 📸 Snapshots and export
  snapshots,
  setSnapshots,
  snapshotArchive,
  setSnapshotArchive,
  showGallery,
  setShowGallery,
  showExportModal,
  setShowExportModal,
  insideMessage,
  setInsideMessage,

  // 🧠 Refs and transform logic
  imageRef,
  imagebarRef,
  stageRef,
  containerRef,

  updateImageRef,

  // 🧠 Derived tone
  tone,
}}
