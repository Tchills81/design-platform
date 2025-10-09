// src/canvas/hooks/useCanvasEffects.ts

import { useEffect } from "react";
import { useCanvasState } from "./useCanvasState";
import { useCanvasActions } from "./useCanvasActions";
import { SnapshotEntry } from "@/src/types/SnapshotEntry";

import { DualTemplate, isTextElement } from "@/src/types/template";

import { computeAverageColor } from "@/src/utils/colorUtils";
import getDynamicBackgroundFromTemplate from "@/src/utils/computeDynamicBackground";
import { tone } from "@/src/types/tone";

export function useCanvasEffects(
  state: ReturnType<typeof useCanvasState>,
  actions: ReturnType<typeof useCanvasActions>
) {
  const {
    template,
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
    lastSavedTemplate,
    dualFaces,
    showBackground,
    showReflectionModal,
    showCommentModal,
    designElement,
    setDesignElements,
    imageRef,
  } = state;

  const {
    
    //setPreviewImage,
    setSnapshotArchive,
    setLastSavedTemplate,
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
  } = actions;

 

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

  // 🧠 Resize listener
  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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




  useEffect(() => {
    if (mode === 'insideFront' && dualFaces && template) {
      if (dualFaces.length === 1) {
        const temp: DualTemplate | undefined = handleRenderBlankTemplate();
  
        if (temp) {
          setDualFaces((prev: DualTemplate[]) => {
            const updated = [...prev];
            updated[0] = { ...template };
            updated.push(temp);
            return updated;
          });
  
          setTemplate(temp);
          handleTemplateSelect(temp);
          console.log('Blank inside face injected and selected');
        }
      } else if (dualFaces.length > 1) {
        setDualFaces((prev: DualTemplate[]) => {
          const updated = [...prev];
          updated[0] = { ...template };
          return updated;
        });
  
        // Use a local copy to avoid stale reads
        const insideTemplate = { ...dualFaces[1] };
        setTemplate(insideTemplate);
        handleTemplateSelect(insideTemplate);
        console.log('Inside face being rendered');
      }
    }
  }, [mode, dualFaces.length]);
  
  


  useEffect(() => {
    if (mode === 'front' && dualFaces.length >= 1 && template) {
      setDualFaces((prev: DualTemplate[]) => {
        const updated = [...prev];
        updated[1] = { ...template };
        return updated;
      });
  
      const frontTemplate = { ...dualFaces[0] };
      setTemplate(frontTemplate);
      handleTemplateSelect(frontTemplate);

      
      console.log('Front–Back face being rendered');
    }
  }, [mode, dualFaces.length]);



  useEffect(() => {
    async function fetchReflections() {
      const res = await fetch(`/api/reflections?designId=${template?.id}`);
      const data = await res.json();
      setReflections(data);
      console.log('showReflectionModal', showReflectionModal, 'showCommentModal', showCommentModal)
    }
  
    fetchReflections();
  }, [template, showReflectionModal]);


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



