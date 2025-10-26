// src/canvas/hooks/useCanvasEffects.ts

import { useEffect, useRef, useState } from "react";
import { useCanvasState } from "./useCanvasState";
import { useCanvasActions } from "./useCanvasActions";
import { SnapshotEntry } from "@/src/types/SnapshotEntry";

import { DualTemplate, isTextElement } from "@/src/types/template";

import { computeAverageColor } from "@/src/utils/colorUtils";
import getDynamicBackgroundFromTemplate from "@/src/utils/computeDynamicBackground";
import { tone } from "@/src/types/tone";
import Draggable from "react-draggable";

import { transformDualTemplateToDocument } from "@/src/utils/transformDualTemplate";
import { normalizeDualTemplate } from "@/src/utils/normalizeDualTemplate";
import { renderToCanvas } from "@/src/utils/renderToCanvas";
import { hashTemplateFace } from "@/src/utils/hashTemplateFace";
import { getMaxPageCount } from "@/src/utils/getMaxPageCount";
import { TemplateSize } from "@/src/enumarations/TemplateSize";
export function useCanvasEffects(
  state: ReturnType<typeof useCanvasState>,
  actions: ReturnType<typeof useCanvasActions>
) {
  const {
    template,
    templateDocuments,
    side,
    mode,
    faceMode,
    tone,
    snapshots,
    canvasBounds,
    cardX,
    cardY,
    canvasWidth,
    canvasHeight,
    ghostLines,
    ghostOpacity,
    dynamicBackground,
    cropModeActive,
    selectedImageId,
    selectedTextId,
    showExportModal,
    prepareForPrint,
    toolbarRef,
    stageSize,
    setTemplate,
    inputPosition,
    setShowGuides,
    canvasReady,
    setCanvasReady,
    lastSavedTemplate,
    dualFaces,
    showBackground,
    showReflectionModal,
    showCommentModal,
    designElement,
    setDesignElements,
    imageRef,
    containerRef,
    cardGridGroupRef,
    stageRef,
    zoom,
    hasInitializedZoom,
    setInitialZoomedOutValue,
    setShowGallery,
    position,
    lastFaceHash, 
    setLastFaceHash,
    hasChanged, 
    setHasChanged,
    maxPageCount,
    activeTimestamp,
    snapshotArchive,
    pageAdded,
    initialZoomedOutValue,
    stripRef,
    stripHeight,
    showPages,
    scrollContainerRef,
    scrollPosition,
    largeContainerSize,
  
    
  } = state;

  const {
    
    //setPreviewImage,
    setSnapshotArchive,
    setLastSavedTemplate,
    setDocumentTemplates,
    setMode,
    setStageSize,
    setGhostOpacity,
    setEditingText,
    setSelectedTextId,
    setShowToolbar,
    setInputPosition,
    setPortalTarget,
    setCropRegion,
    setDynamicBackground,
    handleRenderBlankTemplate,
    handleTemplateSelect,
    setDualFaces,
    setReflections,
    handleZoom,
    setOverlayStyle,
    setScrollOffset,
    setActivePageId,
    captureFrontAndBack,
    archiveSnapshots,
    setMaxPageCount,
    setStageStyle,
    setStripHeight,
    setVerticalOffset,
    setScrollPosition,
    setLargeContainerSize,
    setZoom,
    setCanvasSize
    

  } = actions;



// 🧠 Initial zoom to fit template

useEffect(() => {
  if (!template || !containerRef.current || mode=="painting" || hasInitializedZoom.current) return;

  const container = containerRef.current;

  // Layout constants
  const SIDEBAR_WIDTH = 280;
  const RULER_THICKNESS = 24;
  const TOP_BAR_HEIGHT = 64;
  const FOOTER_HEIGHT = 48;
  const RIGHT_MARGIN = 280;
  const EXTRA_MARGIN = 120;

  // Masked viewport dimensions
  const viewportWidth = container.offsetWidth - SIDEBAR_WIDTH - RULER_THICKNESS - RIGHT_MARGIN;
  const viewportHeight = container.offsetHeight - TOP_BAR_HEIGHT - RULER_THICKNESS - FOOTER_HEIGHT;

  // Desired zoom to fit template
  const zoomX = (viewportWidth - EXTRA_MARGIN) / template.width;
  const zoomY = (viewportHeight - EXTRA_MARGIN) / template.height;
  const targetZoom = Math.min(zoomX, zoomY, 1);

  const scaleBy = targetZoom / zoom;
  setInitialZoomedOutValue(targetZoom);

  handleZoom(scaleBy, true);
  hasInitializedZoom.current = true;
  
}, [template,  mode]);




useEffect(() => {
  if (template) {
    const doc = transformDualTemplateToDocument(template);
    setDocumentTemplates([doc]);
    setActivePageId(doc.pages[0]?.id ?? 'front');

    console.log('documentTemplate updated from template:', doc);
  }
}, [template]);



// This effect synchronizes the DOM overlay with the Konva group's state.
useEffect(() => {
  const konvaGroup = cardGridGroupRef.current;
    
  const stage = stageRef.current;
  
  if (konvaGroup && stage && template && mode === "painting" ) {
    
    const absoluteGroupScale = konvaGroup.getAbsoluteScale();

    
      const finalWidth = template.width * absoluteGroupScale.x;
      const finalHeight = template.height * absoluteGroupScale.y;

     const finalLeft=(stageSize.width -finalWidth)/2;
     const finalTop=(stageSize.height-finalHeight)/2

    // setStageSize({width:finalWidth, height:finalHeight});


       // Update the state with the new style properties
    setOverlayStyle({
      position: 'absolute',
      top: finalTop,
      left: finalLeft ,
      transform: `scale(${absoluteGroupScale.x})`,
      transformOrigin: 'top left',
      zIndex: 2,
      opacity: 1,
      transition: 'opacity 0.3s ease-in-out',
      pointerEvents: 'auto',
      cursor: 'crosshair',
      Draggable:true
    });
  }
}, [position, template, mode, zoom]); // Add `template` to dependencies


/**
 * This effect:

Computes the scaled canvas size

Updates the scrollable container size

Centers the scroll position

Sets vertical offset and stage style
 */
useEffect(() => {
  const konvaGroup = cardGridGroupRef.current;
  const stage = stageRef.current;
  const container = scrollContainerRef.current;

  if (!konvaGroup || !template ) return;

  // 1. Compute scaled canvas dimensions
  const scale = konvaGroup.getAbsoluteScale();
  const scaledWidth = template.width * scale.x;
  const scaledHeight = template.height * scale.y;

  setCanvasSize({width:scaledWidth, height:scaledHeight})



  // 5. Compute vertical offset for layout purposes (e.g. stripHeight)
  const availableViewportHeight = window.innerHeight - (showPages ? stripHeight : 0);
  const verticalOffset = (availableViewportHeight - scaledHeight) / 2;
  setVerticalOffset(verticalOffset);

 // setScrollPosition(position);

  // 6. Apply stage styling
  setStageStyle({
    top: 0,
    left: 0,
    position: 'relative',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s ease-in-out',
    bakgroundColor: template.tone=='ceremonial' ? '#f5f500' : '#1e1e1e',
  });
}, [template, zoom, stageSize, showPages, stripHeight]);



useEffect(() => {
  const group = cardGridGroupRef.current;
  if (group) {
    //setScrollPosition(position);
    //group.position({ x: position.x, y: position.y });
    //group.getLayer()?.batchDraw();
  }
}, [scrollPosition]);





/**
 * This effect:

Centers the canvas group inside the scrollable container

Responds to zoom and container size changes
 */












const [allow, setAllow]=useState(true);
useEffect(() => {
  if (stripRef.current) {
    setStripHeight(stripRef.current.offsetHeight);
   
    
  } else {
    setStripHeight(0);
  }

  if(showPages==true)
    {
      setZoom(0.8)
      handleZoom(0.8, allow);
      setAllow(false);
    }else
    {
      if(!allow)
      {
       
        handleZoom(zoom, false);
        setAllow(true);
      }
    }
}, [showPages])



  // 🧠 Update preview image
  useEffect(() => {
    if (!template) return;
    const preview = ""; // Optional: generate preview image
   // setPreviewImage(preview);
  }, [template, side]);

  // 🧠 Archive snapshot on export
  useEffect(() => {
    if (!showExportModal || !template) return;

    const snapshot: SnapshotEntry = {
          image:snapshots[side] ?? '',
          width:canvasWidth,
          height:canvasHeight,
          side: side,
          timestamp: Date().toString(),
          templateId: template.id,
          tone: template.tone as tone,
          type:'front',
          template:template
    };

    setSnapshotArchive(prev => [...prev, snapshot]);
    setLastSavedTemplate(template);
  }, [showExportModal]);

  // 🧠 Sync editing text from selectedTextId
  useEffect(() => {
    if (!selectedTextId || !template || !template[side]) return;

    const selectedElement = template[side].elements.find(el => el.id === selectedTextId);
    if (selectedElement && selectedElement.type === "text") {
      setEditingText(selectedElement.label);
    }
  }, [selectedTextId, template, side]);

  // 🧠 Prepare for print mode
  useEffect(() => {
    if (prepareForPrint) {
      setShowGuides(true);
      setMode("preview");
    }
  }, [prepareForPrint]);

 

 




  // 🧠 Ghost line opacity
  useEffect(() => {
    setGhostOpacity(ghostLines.x || ghostLines.y ? 0.6 : 0);
  }, [ghostLines]);

  // 🧠 Global click to deselect text
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const clickedInsideToolbar = toolbarRef.current?.contains(e.target as Node);

      console.log("handleGlobalClick", toolbarRef)
      if (clickedInsideToolbar) return;

      setSelectedTextId(null);
      setShowToolbar(false);
      setEditingText("");
      setInputPosition(null);
    };

    document.addEventListener("mousedown", handleGlobalClick);
    return () => document.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  // 🧠 Portal target setup
  useEffect(() => {
    const el = document.getElementById("canvas-portal");
    if (el) setPortalTarget(el);
  }, []);

  // 🧠 Log template changes
  useEffect(() => {
    if (template) {
      console.log("🔍 template.back:", template.back);
    }
  }, [side]);

  // 🧠 Compute dynamic background from gridColors
 

  useEffect(() => {
    const avg = getDynamicBackgroundFromTemplate(template, side);
    if (avg) setDynamicBackground(avg);
  }, [template, side, showBackground]);

 


  /// 🧠 Crop region initialization
useEffect(() => {
  if (!cropModeActive || !selectedImageId || !template || !template[side] || !imageRef?.current) return;

  const node = imageRef.current;
  const stage = node.getStage();
  if (!stage) return;

  const bounds = node.getClientRect({ relativeTo: stage });

  console.log("[Crop Init]", {
    id: selectedImageId,
    shapeType: node.getClassName(),
    bounds,
  });

  setCropRegion({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  });

  
  
}, [cropModeActive, selectedImageId, template, canvasBounds, imageRef?.current]);




 
  // 🧠 Capture front and back when canvasReady

  useEffect(() => {
    // 🧩 Step 1: Calculate max page count early
    const maxPageCount = getMaxPageCount(template?.size ?? TemplateSize.PRESENTATION);
    const currentPageCount = snapshotArchive.length;
  
    // 🛡️ Step 2: Guard clause with full context
    if (
      !canvasReady ||
      !template ||
      !canvasBounds ||
      !stageRef.current ||
      currentPageCount >= maxPageCount
    ) {
      console.log("🛑 useCanvasEffects: canvasReady effect early return");
      return;
    }
  
    // 🧠 Step 3: Proceed with capture
    const runCapture = async () => {
      const images = await captureFrontAndBack();
      archiveSnapshots('front', images, template);
  
      const clonedTemplate: DualTemplate = JSON.parse(JSON.stringify(template));
      const normalized = normalizeDualTemplate(clonedTemplate);
      renderToCanvas(normalized, setTemplate, setMode, 'front');
      setTemplate(prev => normalizeDualTemplate(normalized || prev));
  
      setShowGallery(false);
      setCanvasReady(false);
    };
  
    runCapture();
  }, [
    canvasReady,
    template,
    canvasBounds,
    stageRef,
    snapshotArchive.length
  ]);
  


  useEffect(() => {

    if(!template) return;

    const currentFace = template[side]; // 'front', 'back', etc.
    const currentHash = hashTemplateFace(currentFace ?? { elements: [], card: { width: 0, height: 0, background: '' } });
  
    if (currentHash !== lastFaceHash) {
      setHasChanged(true);
      setLastFaceHash(currentHash);
    } else {
      setHasChanged(false);
    }
  }, [template, side]);
  
  
  


  // 🧠 Fetch reflections when modal is shown

  useEffect(() => {
    async function fetchReflections() {
      const res = await fetch(`/api/reflections?designId=${template?.id}`);
      const data = await res.json();
      setReflections(data);
      console.log('showReflectionModal', showReflectionModal, 'showCommentModal', showCommentModal)
    }
  
    fetchReflections();
  }, [template, showReflectionModal]);


  // 🧠 Fetch reflections when modal is shown
  useEffect(() => {
    async function fetchReflections() {
      if (!template?.id || !showReflectionModal) return;
      const res = await fetch(`/api/reflections?designId=${template.id}`);
      const data = await res.json();
      setReflections(data);
    }
  
    fetchReflections();
  }, [template?.id, showReflectionModal]);



  
}










