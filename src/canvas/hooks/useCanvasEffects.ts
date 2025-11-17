// src/canvas/hooks/useCanvasEffects.ts

import { useEffect, useRef, useState } from "react";
import { useCanvasActions } from "./useCanvasActions";
import { SnapshotEntry } from "@/src/types/SnapshotEntry";

import { useCanvasState } from "./useCanvasState";

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
import { useFadeInLayer } from "./useFadeInLayer";
import { computeOverlayControlPosition } from "./useOverlayControlPosition";

import { computeOverlayControlPositionFromDOM } from "./computeOverlayControlPositionFromDOM";
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
    sideBarRef,
    topBarRef,
    footerClusterRef,
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
    canvasSize,
    hasInitialized,
    positionRef,
    initailPosition,
    konvaText,
    textToolbarRef,
    SIDEBAR_WIDTH,
    TOPBAR_OFFSET,
    PANEL_WIDTH,
    activeTab,
    SidebarTabsRef,
    PanelRef,
    selectedDualTemplate,

    textControlsRef,
   
    computePosition,
    setTextControlPosition,
    textControlPosition,
    textAreaRef
    
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
    setCanvasSize,
    scrollByWheel,
    clamp,
    setPosition,
    setInitailPosition,
    triggerFade,
    handleFullScreenChange,
    computeOverlayPosition,
    setActiveIndex,
    recenterCanvas,
    setIsTransitioningTemplate,
    
    

  } = actions;




  useEffect(() => {
    if (selectedDualTemplate && !template) {
      handleTemplateSelect(selectedDualTemplate);
    }
  }, [selectedDualTemplate, template]);


  useFadeInLayer({
    groupRef: cardGridGroupRef,
    templateId: template?.id,
    setIsTransitioningTemplate,
    hasInitializedZoom
  });
  



useEffect(() => {
  if (hasInitializedZoom.current) return;
  if (!template || !containerRef.current || mode === "painting" ) return;

  

  const container = containerRef.current;

  // 1. Calculate and set initial zoom
  const _SIDEBAR_WIDTH = 280;
  const RULER_THICKNESS = 24;
  const TOP_BAR_HEIGHT = 110;
  const FOOTER_HEIGHT = 48;
  const RIGHT_MARGIN = 280;
  const EXTRA_MARGIN = 120;

  const viewportWidth = container.offsetWidth - _SIDEBAR_WIDTH - RULER_THICKNESS - RIGHT_MARGIN;
  const viewportHeight = container.offsetHeight - TOP_BAR_HEIGHT - RULER_THICKNESS - FOOTER_HEIGHT;

  const zoomX = (viewportWidth - EXTRA_MARGIN) / template.width;
  const zoomY = (viewportHeight - EXTRA_MARGIN) / template.height;
  const targetZoom = Math.min(zoomX, zoomY, 1);

  setZoom(targetZoom);
  setInitialZoomedOutValue(targetZoom);

  // 2. Calculate initial scaled canvas dimensions
  const scaledWidth = template.width * targetZoom;
  const scaledHeight = template.height * targetZoom;
  setCanvasSize({ scaleX: targetZoom, scaleY: targetZoom, width: scaledWidth, height: scaledHeight });

  // 3. Center canvas in stage
  const initialKonvaX = (stageSize.width - scaledWidth) / 2;
  const initialKonvaY = (stageSize.height - scaledHeight) / 2;
  

  // 4. Reset scroll thumbs
  const verticalInput = document.querySelector('.canvas-scrollbar.vertical') as HTMLInputElement;
  const horizontalInput = document.querySelector('.canvas-scrollbar.horizontal') as HTMLInputElement;
  if (verticalInput) verticalInput.value = '0';
  if (horizontalInput) horizontalInput.value = '0';

  // 5. Apply stage styling

  if(activeTab){

    

    setStageStyle({ backgroundColor:  '#1e1e1e', position:'absolute', top:0, left:(PANEL_WIDTH+SIDEBAR_WIDTH)});

    setPosition({x:initialKonvaX-(PANEL_WIDTH+SIDEBAR_WIDTH)/2, y:initialKonvaY});

    setInitailPosition({x:initialKonvaX-(PANEL_WIDTH+SIDEBAR_WIDTH)/2, y:initialKonvaY});
    
  }else{

    setPosition({ x: initialKonvaX, y: initialKonvaY });
    setInitailPosition({ x: (stageSize.width - scaledWidth) / 2, y: (stageSize.height - scaledHeight) / 2});

    console.log()
    setStageStyle({ backgroundColor:  '#1e1e1e', position:'absolute', top:0, left:0});
 
    
  }
    

  
 

  hasInitializedZoom.current = true;
}, [template, mode, activeTab]);





useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    // ✅ Allow native scroll if sidebar is open and event targets a scrollable sidebar region
    if (activeTab) {
       
      const isSidebarScroll = (e.target as HTMLElement)?.closest('.sidebar-scroll');
      if (isSidebarScroll) return; // Let sidebar scroll naturally
    }

    const konvaGroup = cardGridGroupRef.current;
    if (!konvaGroup || !template) return;

    e.preventDefault();

    const scaledCanvasHeight = template.height * zoom;
    const scaledCanvasWidth = template.width * zoom;
    const maxY = Math.max(0, scaledCanvasHeight - stageSize.height);
    const maxX = Math.max(0, scaledCanvasWidth - stageSize.width);

    const currentKonvaPosition = konvaGroup.position();
    const nextKonvaX = currentKonvaPosition.x - e.deltaX;
    const nextKonvaY = currentKonvaPosition.y - e.deltaY;


  

    let centerOffsetX = (stageSize.width - scaledCanvasWidth) / 2;

    if(activeTab){
      centerOffsetX = (stageSize.width - scaledCanvasWidth -(PANEL_WIDTH+SIDEBAR_WIDTH)) / 2;
    }
    const centerOffsetY = (stageSize.height - scaledCanvasHeight) / 2;

    const clampedKonvaX = clamp(nextKonvaX, -(maxX / 2) + centerOffsetX, maxX / 2 + centerOffsetX);
    const clampedKonvaY = clamp(nextKonvaY, -(maxY / 2) + centerOffsetY, maxY / 2 + centerOffsetY);

    konvaGroup.position({ x: clampedKonvaX, y: clampedKonvaY });

    const isKonvaText=konvaText && konvaText.visible;

    if (isKonvaText ) {
      konvaText.visible(true);
      konvaText.getLayer()?.batchDraw();
      setSelectedTextId(null);
      setShowToolbar(false);
      setInputPosition(null);
    }

    setScrollPosition({ x: clampedKonvaX, y: clampedKonvaY });
    triggerFade();
  };

  window.addEventListener('wheel', handleWheel, { passive: false });
  return () => window.removeEventListener('wheel', handleWheel);
}, [
  activeTab, // ✅ include this so the effect updates when sidebar opens/closes
  scrollPosition,
  zoom,
  template,
  stageSize,
  cardGridGroupRef,
  triggerFade,
  setScrollPosition
]);







useEffect(() => {
  if (template) {
    const doc = transformDualTemplateToDocument(template);
    setDocumentTemplates([doc]);
    setActivePageId(doc.pages[0]?.id ?? 'front');

    console.log('documentTemplate updated from template:', doc);
  }
}, [template]);





useEffect(() => {
  positionRef.current = position;
}, [position]);




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
      top: position.y,
      left: position.x + SIDEBAR_WIDTH, // ✅ add sidebar offset
      transform: `scale(${absoluteGroupScale.x})`,
      transformOrigin: 'top left',
      zIndex: 2,
      opacity: 1,
      transition: 'opacity 0.3s ease-in-out',
      pointerEvents: 'auto',
      cursor: 'crosshair',
      
    });
  }
}, [position, template, mode, zoom]); // Add `template` to dependencies











/**
 * This effect:

Computes the scaled canvas size

Updates the scrollable container size

Centers the scroll position

Sets vertical offset and stage style
 
useEffect(() => {
  const konvaGroup = cardGridGroupRef.current;
  const stage = stageRef.current;
  const container = scrollContainerRef.current;

  if (!konvaGroup || !template ) return;

  // 1. Compute scaled canvas dimensions
  const scale = konvaGroup.getAbsoluteScale();
  const scaledWidth = template.width * scale.x;
  const scaledHeight = template.height * scale.y;

  setCanvasSize({scaleX:scale.x, scaleY:scale.y, width:scaledWidth, height:scaledHeight})



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




/*useEffect(() => {
  const konvaGroup = cardGridGroupRef.current;
  const stage = stageRef.current;
  if (!konvaGroup || !template || !canvasSize.height) return;

  const scaledCanvasHeight = template.height * zoom;

  // Calculate the initial Konva y position to center vertically
  // Only apply this logic if the canvas is smaller than the stage
  let initialKonvaY = position.y; // Maintain current position if already set
  let initialThumbY = 0;

  if (scaledCanvasHeight <= stageSize.height) {
    initialKonvaY = (stageSize.height - scaledCanvasHeight) / 2;
  } else {
    // If it's larger, make sure the initial Konva y is 0 (or a clamped position)
    initialKonvaY = clamp(position.y, -(scaledCanvasHeight - stageSize.height), 0);
    initialThumbY = -initialKonvaY;
  }

  console.log('position', position, 'initialKonvaY', initialKonvaY);

  // Update the thumb's value
  const verticalInput = document.querySelector('.canvas-scrollbar.vertical') as HTMLInputElement;
  if (verticalInput) {
    verticalInput.value = String(initialThumbY);
  }

  // Set the initial position state, only if it's different to prevent loops
  if (position.y !== initialKonvaY) {
    setPosition((prev) => ({ ...prev, y: initialKonvaY }));
  }
  
}, [stageSize, template, zoom, position, canvasSize]);




useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    scrollByWheel(e.deltaX, e.deltaY);
    e.preventDefault();
  };

  window.addEventListener('wheel', handleWheel, { passive: false });
  return () => window.removeEventListener('wheel', handleWheel);
}, [scrollByWheel]);
*



/**
 * This effect:

Centers the canvas group inside the scrollable container

Responds to zoom and container size changes
 */












const [allow, setAllow] = useState(true);

useEffect(() => {
  const stripHeight = stripRef.current?.offsetHeight ?? 0;
  setStripHeight(stripHeight);

  const availableHeight = stageSize.height - stripHeight;
  const availableWidth = stageSize.width;

  if (template && showPages === true && allow) {
    // 🎯 Calculate zoom to fit canvas within available viewport
    const zoomX = availableWidth / template.width;
    const zoomY = availableHeight / template.height;
    const newZoom = Math.min(zoomX, zoomY);

    // 🎯 Update initial zoom
   // setInitialZoomedOutValue(newZoom);
    //setZoom(newZoom)

    // 🎯 Update canvas size
    const scaledCanvasWidth = template.width * newZoom;
    const scaledCanvasHeight = template.height * newZoom;

    setCanvasSize({
      scaleX: newZoom,
      scaleY: newZoom,
      width: scaledCanvasWidth,
      height: scaledCanvasHeight
    });

    // 🎯 Update stage size (viewport)
    setStageSize({
      width: stageSize.width,
      height: availableHeight
    });

    // 🎯 Trigger zoom logic
    //setZoom(newZoom)
    handleZoom(0.8, allow); // allowBelowOne = true

    // 🎯 Lock recalibration until strip is hidden
    setAllow(false);
  }

  if (template && showPages === false && !allow) {
    // 🎯 Restore zoom and unlock recalibration
    const scaledCanvasWidth = template.width * zoom;
    const scaledCanvasHeight = template.height * zoom;


    setCanvasSize({
      scaleX: zoom,
      scaleY: zoom,
      width: scaledCanvasWidth,
      height: scaledCanvasHeight
    });

    setStageSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    handleZoom(zoom, false); // restore previous zoom
    setInitailPosition(initailPosition)
    setScrollPosition({x:0, y:0})
    setAllow(true);
  }
}, [showPages, template, stageSize.height, stageSize.height, zoom, allow]);




useEffect(() => {
  document.addEventListener('fullscreenchange', handleFullScreenChange);
  // You might also need vendor prefixes for older browsers (moz, webkit, ms)

  setStageSize({ width: window.innerWidth, height: window.innerHeight + stripHeight });
  return () => {
    document.removeEventListener('fullscreenchange', handleFullScreenChange);
  };
}, []);



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


  useEffect(() => {

    const overlayControls = textControlsRef.current;

    if(!konvaText || !stageRef.current || ! textControlsRef.current?.offsetWidth) return;


    const controlPosition = computeOverlayControlPosition({
      textNode: konvaText,
      stageRef,
      zoom,
      tabActive: activeTab? true : false,
      offset: PANEL_WIDTH + SIDEBAR_WIDTH,
      overlayWidth: overlayControls?.offsetWidth // or measure dynamically
    });

   setTextControlPosition(controlPosition);


   //console.log("Computing text control position offsetWidth...", overlayControls?.offsetWidth, 'controlPosition', controlPosition);



  }, [setShowToolbar, textControlsRef.current?.offsetWidth, konvaText, stageRef, zoom, activeTab]);

 

 




  // 🧠 Ghost line opacity
  useEffect(() => {
    setGhostOpacity(ghostLines.x || ghostLines.y ? 0.6 : 0);
  }, [ghostLines]);

  // 🧠 Global click to deselect text
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      
      
      const clickedInsideToolbar = textToolbarRef.current?.contains(e.target as Node);
      const clickedOnTextOverlay = toolbarRef.current?.contains(e.target as Node);
      const clickedOnTopBar = topBarRef.current?.contains(e.target as Node);
      const clickedOnSideBar = sideBarRef.current?.contains(e.target as Node);
      const clickedOnFooterCluster = footerClusterRef.current?.contains(e.target as Node);
      const clickedOnTabs = SidebarTabsRef.current?.contains(e.target as Node);
      const clickedOnPanel = PanelRef.current?.contains(e.target as Node);

      const control = textControlsRef.current;

      console.log("handleGlobalClick", 
                  'clickedInsideToolbar', 
                  clickedInsideToolbar, 'control....',  control); 


      if (clickedInsideToolbar ||  
          clickedOnTextOverlay || 
          clickedOnTopBar      || 
          clickedOnSideBar     || 
          clickedOnFooterCluster ||
          clickedOnTabs         ||
          clickedOnPanel   

        ) return;


        if (konvaText?.visible) {
          // 🧠 Sync Konva height to overlay before dismissal
          if (textAreaRef.current) {
            const overlayHeight = textAreaRef.current.offsetHeight;
            konvaText.height(overlayHeight);
            console.log("Syncing konvaText height to toolbarRef.current:", 
              toolbarRef.current?.offsetHeight, 'konvaText height before:', konvaText.height());
          }
        
          konvaText.visible(true);
          konvaText.getLayer()?.batchDraw();

          setSelectedTextId(null);
          setShowToolbar(false);
          setInputPosition(null);
        }
        
         

      
    };

    document.addEventListener("mousedown", handleGlobalClick);
    return () => document.removeEventListener("mousedown", handleGlobalClick);
  }, [konvaText, textAreaRef.current]);

  // 🧠 Portal target setup
  useEffect(() => {
    const el = document.getElementById("canvas-portal");
    if (el) setPortalTarget(el);
  }, []);

  // 🧠 Log template changes
  useEffect(() => {
    if (template) {
      console.log("🔍 template", template);
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
      //setInitialPosition(position);
    };
  
    runCapture();

    setActiveIndex(snapshotArchive.length)

    
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










