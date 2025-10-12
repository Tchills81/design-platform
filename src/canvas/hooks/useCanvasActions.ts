// src/canvas/hooks/useCanvasActions.tsx

import { useCallback } from "react";
import { useCanvasState } from "./useCanvasState";
import { DualTemplate, TemplateElement } from "@/src/types/template";
import { SnapshotEntry } from "@/src/types/SnapshotEntry";
import { HistoryEntry } from "@/src/types/HistoryEntry";
import { CanvasMode } from "@/src/types/CanvasMode";
import { tone } from "@/src/types/tone";
import { KonvaEventObject } from "konva/lib/Node";
import { isTextElement } from "@/src/types/template";
import { normalizeDualTemplate } from "@/src/utils/normalizeDualTemplate";
import { renderToCanvas } from "@/src/utils/renderToCanvas";
import { serializeDualTemplate } from "@/src/utils/serializeDualTemplate";
import { injectAssetIntoTemplate } from "@/src/utils/injectAssetIntoTemplate";
import { captureCardFaceSnapshot } from "@/src/utils/captureCardFaceSnapshot";
import { printSnapshots } from "@/src/components/printSnapshots";
import { supportedShapes } from "@/src/components/elements/shapeRegistry";
import isEqual from 'lodash.isequal';

import Konva from "konva";
import { DesignElement } from "@/src/types/DesignElement";

export function useCanvasActions(state: ReturnType<typeof useCanvasState>) {
  const {
    template,
    setTemplate,
    setLastSavedTemplate,
    setMode,
    setSide,
    setShowRulers,
    setShowBleeds,
    setShowGrids,
    setBrushSize,
    setSelectedColor,
    setSnapshotArchive,
    setShowExportModal,
    setViewMode,
    setDesignInside,
    setDesignComplete,
    setInsideMessage,
    setShowGallery,
    setSelectedTextId,
    setSelectedImageId,
    setCropRegion,
    setInputPosition,
    setStageSize,
    setGhostOpacity,
    setEditingText,
    setTextAlign,
    setIsMultline,
    setIsUnderline,
    setShowToolbar,
    setPortalTarget,
    setDynamicBackground,
    setShowBackground,
    setShowReflectionModal,
    setShowShareModal,
    setShowCommentModal,
    setAccessLevel,
    setCellSize,
    cellSize,
    setZoom,
    setPosition,
    setBleedToggleDisabled,
    cropModeActive,
    setCropModeActive,
    setSelectedFont,
    setSelectedFontSize,
    setPendingStyle,
    setAnimatedCells,
    setSnapshots,
    snapshots,
    setDualFaces,
    setPrepareForPrint,
    setFaceMode,
    lastSavedTemplate,
    history,
    future,
    setHistory,
    setFuture,
    stageSize,
    zoom,
    position,
    card,
    side,
    elements,
    selectedTextId,
    selectedImageId,
    editingText,
    isBold,
    isItalic,
    insideMessage,
    stageRef,
    canvasBounds,
    cols,
    rows,
    mode,
    showBleeds, 
    showRulers,
    faceMode,
    selectedColor,
    accessLevel,
    activateTransformMode,
    dualFaces,
    setReflections,
    designElements,
    setDesignElements,
    resetTransformMode,
    initialZoomedOutValue,
    setGridPosition,
    setOverlayStyle,
  } = state;

  const commitHistoryEntry = useCallback(() => {
    if (!card || !elements) return;
    const cardState = {
      width: card.width,
      height: card.height,
      background: card.background,
      backgroundImage: card.backgroundImage,
      gridColors: card.gridColors,
      elements,
    };
    setHistory(prev => [...prev, { mode, cardState }]);
    setFuture([]);
  }, [card, elements, mode]);

  const recordSnapshot = useCallback(() => {
    if (!template || !template[side]) return;
    setHistory(prev => [
      ...prev,
      {
        mode,
        cardState: {
          width: card?.width ?? 0,
          height: card?.height ?? 0,
          background: card?.background ?? "",
          backgroundImage: card?.backgroundImage ?? "",
          gridColors: card?.gridColors ?? [],
          elements: [...(template[side]?.elements ?? [])],
        },
      },
    ]);
  }, [template, side, card, mode]);


  function shouldPushToHistory(elements: TemplateElement[], entry: HistoryEntry | undefined, card: any | undefined): boolean {
    if (!entry || !card) return true;
  
    return (
      !isEqual(elements, entry.cardState.elements) ||
      card.backgroundImage !== entry.cardState.backgroundImage ||
      card.background !== entry.cardState.background ||
      !isEqual(card.gridColors, entry.cardState.gridColors)
    );
  }
  

  const handleUndo = useCallback(() => {
    if (history.length === 0 || !template || !card) return;
  
    console.log('handleUndo length', history.length);
  
    const previous = history[history.length - 1];
  
    // Push current state to redo stack before undoing
    if (shouldPushToHistory(elements, previous, card)) {
      setFuture(prev => [
        {
          mode,
          cardState: {
            width: card.width ?? previous.cardState.width,
            height: card.height ?? previous.cardState.height,
            background: card.background ?? previous.cardState.background,
            backgroundImage: card.backgroundImage ?? previous.cardState.backgroundImage,
            gridColors: card.gridColors ?? previous.cardState.gridColors,
            elements,
          },
        },
        ...prev,
      ]);
    }
  
    // Apply previous state
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        card: {
          width: previous.cardState.width,
          height: previous.cardState.height,
          background: previous.cardState.background,
          backgroundImage: previous.cardState.backgroundImage,
          gridColors: previous.cardState.gridColors,
        },
        elements: previous.cardState.elements,
      },
    }));
  
    setMode(previous.mode);
  
    // Remove last entry from history
    setHistory(prev => prev.slice(0, -1));
  }, [history, future, template, card, elements, mode, side]);
  
  
  const handleRedo = useCallback(() => {
    if (future.length === 0 || !template || !card) return;
  
    console.log('handleRedo length', future.length);
  
    const nextEntry = future[0];
  
    // Push current state to history before redoing
    if (shouldPushToHistory(elements, nextEntry, card)) {
      setHistory(prev => [
        ...prev,
        {
          mode,
          cardState: {
            width: card.width ?? 0,
            height: card.height ?? 0,
            background: card.background ?? "",
            backgroundImage: card.backgroundImage ?? "",
            gridColors: card.gridColors ?? [],
            elements,
          },
        },
      ]);
    }
  
    // Apply next state
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        card: nextEntry.cardState,
        elements: nextEntry.cardState.elements,
      },
    }));
  
    setMode(nextEntry.mode);
  
    // Remove applied entry from future
    setFuture(prev => prev.slice(1));
  }, [future, template, card, elements, mode, side]);
  
  const handleZoom = useCallback((scaleBy: number, allowBelowOne = false) => {
    const oldZoom = zoom;
    const rawZoom = oldZoom * (scaleBy);
  
    const newZoom = allowBelowOne ? rawZoom : Math.max(initialZoomedOutValue, rawZoom);

    // 🧩 Apply zoom and position
    setZoom(newZoom);
    
  
    // 🧭 Center of the stage
    const center = {
      x: stageSize.width / 2,
      y: stageSize.height / 2
    };
  
    // 🎯 Recalculate position to keep canvas centered
    const newPosition = {
      x: center.x - ((center.x - position.x) / oldZoom) * newZoom,
      y: center.y - ((center.y - position.y) / oldZoom) * newZoom
    };
  
    
    setPosition(newPosition); // ✅ This ensures canvas and grid stay aligned
  
    // 🎨 Bleed logic
    //setShowBleeds(newZoom <= 1);
    setBleedToggleDisabled(newZoom > 1);
  }, [zoom, position, stageSize, initialZoomedOutValue]);




  const setDesignGridPosition = useCallback(() => {
    if (!stageRef.current || !template) return;
    const stageRect = stageRef.current.getStage().container().getBoundingClientRect();
    const globalX = stageRect.left + position.x;
    const globalY = stageRect.top + position.y;
    const scaledWidth = template.width * zoom;
    const scaledHeight = template.height * zoom;

    setGridPosition({ x: globalX, y: globalY, width: scaledWidth, height: scaledHeight })
  }, [position, zoom, stageRef, template])
  
  

  
  

  const createShapeId = useCallback(
    (side: 'front' | 'back', elements: TemplateElement[]) => {
      const count = elements.filter(el => el.type === 'shape').length;
      return `${side}-shape-${count + 1}`;
    },
    []
  );

  const createTextId = useCallback((side: 'front' | 'back', elements: TemplateElement[]) => {
    const count = elements.filter(el => el.type === 'text').length;
    return `${side}-text-${count + 1}`;
}, [])



const createPrimitiveId = useCallback(
  (type: 'text' | 'shape' | 'image') => {
    if (!template || !template[side]) return `${side}-${type}-1`;

    const prefix = `${side}-${type}`;
    const elements = template[side].elements;

    const existingIds = elements
      .filter(el => el.type === type)
      .map(el => el.id)
      .filter(id => id.startsWith(prefix));

    const counts = existingIds.map(id => {
      const match = id.match(new RegExp(`${prefix}-(\\d+)$`));
      return match ? parseInt(match[1], 10) : 0;
    });

    const nextIndex = counts.length ? Math.max(...counts) + 1 : 1;

    console.log('createPrimitiveId', `${prefix}-${nextIndex}`, '......')
    return `${prefix}-${nextIndex}`;
  },
  [template, side]
);




const setDesignElement = useCallback(
  (el: DesignElement) => {
    if (!template || !template[side]) return;

    recordSnapshot();

    const newId = createPrimitiveId(el.type);
    let newElement: TemplateElement;

    switch (el.type) {
      case 'shape':
        newElement = {
          id: newId,
          type: 'shape',
          position: { x: el.x ?? 100, y: el.y ?? 100 },
          size: {
            width: el.width ?? 60,
            height: el.height ?? 60,
          },
          fill: el.fill ?? '#f0f0f0',
          shapeType: el.shapeType,
          stroke: el.stroke,
          strokeWidth: el.strokeWidth,
          tone: template.tone,
          role: 'accent',
          label: el.label ?? '',
        };
        break;

      case 'image':
        newElement = {
          id: newId,
          type: 'image',
          src: el.src ?? '/assets/logo.png',
          position: { x: el.x ?? 100, y: el.y ?? 100 },
          size: {
            width: el.width ?? 100,
            height: el.height ?? 80,
          },
          tone: template.tone,
          role: 'decoration',
          label: el.label ?? '',
        };
        break;

      case 'text':
        console.log('text type of element created ', el.label);
        newElement = {
          id: newId,
          type: 'text',
          label: el.label ?? 'New Text',
          shapeType: el.shapeType,
          text: el.label ?? 'New Text',
          font: el.font ?? '--font-inter',
          size: el.fontSize ?? 16,
          color: el.fill ?? '#000000',
          position: { x: el.x ?? 200, y: el.y ?? 200 },
          isBold: el.isBold ?? false,
          isItalic: el.isItalic ?? false,
          tone: template.tone,
          role: 'message',
        };
        break;

      default:
        return;
    }

    setTemplate((prev) => {
      if (!prev || !prev[side]) return null;
      return {
        ...prev,
        [side]: {
          ...prev[side],
          elements: [...prev[side].elements, newElement],
        },
      };
    });

    if (el.type === 'text') {
      setSelectedTextId(newId);
    }
  },
  [template, side]
);




  

  const handleAddText = useCallback(() => {
    if (!template || !template[side]) return;
    
      recordSnapshot();
    
      const newId = createTextId(side, template[side].elements);
      console.log("newId", newId);
    
      const newTextElement: TemplateElement = {
        type: 'text',
        id: newId,
        label: 'New Text',
        shapeType:'heading',
        text: 'New Text',
        font: '--font-inter',
        size: 16,
        color: '#000000',
        position: { x: 100, y: 100 },
        isBold: false,
        isItalic: false,
        tone: template.tone,
      };
    
      setTemplate(prev => {
        if (!prev || !prev[side]) return null;
        return {
          ...prev,
          [side]: {
            ...prev[side],
            elements: [...prev[side].elements, newTextElement],
          },
        };
      });
    
      setSelectedTextId(newId); // migrated
  }, [template, side]);

  const handleRemoveText = useCallback(() => {
    if (!selectedTextId || !template || !template[side]) return;
    const updatedElements = template[side].elements.filter(el => el.id !== selectedTextId);
    setTemplate(prev => ({
      ...prev!,
      [side]: { ...prev![side], elements: updatedElements },
    }));
    setSelectedTextId(null);
    setShowToolbar(false);
    setInputPosition(null);
  }, [selectedTextId, template, side]);

  const handleTextEdit = useCallback((
    text: string,
    pos: { x: number; y: number },
    el: TemplateElement) => {
    if (!template || !isTextElement(el) || !template[side]) return;
    commitHistoryEntry();
    const updatedElements = template[side].elements.map(e =>
      e.id === el.id
        ? {
            ...e,
            label: text,
            text,
            position: { x: pos.x - canvasBounds.x, y: pos.y - canvasBounds.y },
            isBold: el.isBold ?? false,
            isItalic: el.isItalic ?? false,
          }
        : e
    );
    setTemplate(prev => ({
      ...prev!,
      [side]: { ...prev![side], elements: updatedElements },
    }));
    setSelectedFont(el.font || "--font-inter");
    setSelectedColor(el.color || "#000000");
    setInputPosition(pos);
  }, [template, side, canvasBounds]);

  // ...continued below
  const handleTextUpdate = useCallback((updated: TemplateElement) => {
    if (!template || !isTextElement(updated)) return;
    commitHistoryEntry();
    const updatedElements = elements.map(el =>
      el.id === updated.id && el.type === "text"
        ? {
            ...el,
            label: updated.text,
            position: {
              x: updated.position.x,
              y: updated.position.y,
            },
          }
        : el
    );
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements,
      },
    }));
  }, [template, elements, side]);

  const handleTextClick = useCallback((text: string, pos: { x: number; y: number }, id: string) => {
    setEditingText(text);
    setInputPosition(pos);
    setSelectedTextId(id);
    setShowToolbar(true);
    activateTransformMode(id, "text");
    console.log("🖋️ Text selected with ID:", id, "label:", text);
  }, [activateTransformMode]);

  const handleTextBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    const toolbarEl = document.getElementById("text-toolbar");
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || (toolbarEl && toolbarEl.contains(relatedTarget))) return;
    if (selectedTextId && template?.[side]?.elements) {
      const updatedElements = template[side].elements.map(el =>
        el.id === selectedTextId && el.type === "text"
          ? { ...el, label: editingText }
          : el
      );
      setTemplate(prev => ({
        ...prev!,
        [side]: {
          ...prev![side],
          elements: updatedElements,
        },
      }));
      console.log("📝 Text committed:", editingText);
    }
    exitEditingMode();
  }, [selectedTextId, template, side, editingText]);

  const exitEditingMode = useCallback(() => {
    setSelectedTextId(null);
    setShowToolbar(false);
    setEditingText("");
    console.log("🚪 Exited editing mode");
  }, []);

  const onTextChange = useCallback((text: string) => {
    setEditingText(text);
    if (!selectedTextId || !template || !template[side]) return;
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId ? { ...el, label: text } : el
    );
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements,
      },
    }));
  }, [selectedTextId, template, side]);

  const onFontChange = useCallback((newFont: string) => {
    setSelectedFont(newFont);
    if (!selectedTextId || !template || !template[side]) return;
    commitHistoryEntry();
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === "text"
        ? { ...el, font: newFont }
        : el
    );
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements,
      },
    }));
  }, [selectedTextId, template, side]);

  const onFontSizeChange = useCallback((newSize: number) => {
    setSelectedFontSize(newSize);
    if (!selectedTextId || !template || !template[side]) return;
    commitHistoryEntry();
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === "text"
        ? { ...el, size: newSize }
        : el
    );
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements,
      },
    }));
  }, [selectedTextId, template, side]);

  const onColorChange = useCallback((newColor: string) => {
    setSelectedColor(newColor);
    if (!selectedTextId || !template || !template[side]) return;
    commitHistoryEntry();
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === "text"
        ? { ...el, color: newColor }
        : el
    );
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements,
      },
    }));
  }, [selectedTextId, template, side]);

  const handleToggleBold = useCallback(() => {
    setPendingStyle(prev => ({ ...prev, isBold: !prev.isBold }));
    if (!selectedTextId || !template || !template[side]) return;
    commitHistoryEntry();
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === "text"
        ? { ...el, isBold: !el.isBold }
        : el
    );
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements,
      },
    }));
  }, [selectedTextId, template, side]);

  const handleToggleItalic = useCallback(() => {
    setPendingStyle(prev => ({ ...prev, isItalic: !prev.isItalic }));
    if (!selectedTextId || !template || !template[side]) return;
    commitHistoryEntry();
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === "text"
        ? { ...el, isItalic: !el.isItalic }
        : el
    );
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements,
      },
    }));
  }, [selectedTextId, template, side]);

  const handleImageUpdate = useCallback(
    (e: KonvaEventObject<Event>, id: string) => {
      if (!template || !template[side]) return;
  
      commitHistoryEntry();
      const node = e.target;
      const className = node.getClassName?.();
  
      const shapeMeta = Object.values(supportedShapes).find(meta =>
        meta.render.name?.includes(className)
      );
  
      const offset = shapeMeta?.getAnchorOffset?.(node) ?? { x: 0, y: 0 };
  
      const updatedX = node.x() + offset.x - canvasBounds.x;
      const updatedY = node.y() + offset.y - canvasBounds.y;
      const updatedWidth = node.width();
      const updatedHeight = node.height();
  
      const updatedElements = template[side].elements.map(el => {
        if (el.id !== id) return el;
  
        if (el.type === 'image' || el.type === 'shape') {
          return {
            ...el,
            position: {
              x: updatedX,
              y: updatedY
            },
            size: {
              width: updatedWidth,
              height: updatedHeight
            }
          };
        }
  
        return el;
      });
  
      setTemplate(prev => ({
        ...prev!,
        [side]: {
          ...prev![side],
          elements: updatedElements
        }
      }));
    },
    [template, side, canvasBounds]
  );
  
  

  const handleCellPaint = useCallback((col: number, row: number) => {
    const index = row * cols + col;
    if (!template || !card || index < 0 || index >= cols * rows) return;
    commitHistoryEntry();
    setTemplate(prev => {
      if (!prev || !prev[side]) return prev;
      const currentColors = prev[side].card.gridColors ?? Array(cols * rows).fill("#f0f0f0");
      const updatedColors = [...currentColors];
      updatedColors[index] = selectedColor;
      return {
        ...prev,
        [side]: {
          ...prev[side],
          card: {
            ...prev[side].card,
            gridColors: updatedColors,
          },
        },
      };
    });
    const key = `${col},${row}`;
    setAnimatedCells(prev => new Set(prev).add(key));
    setTimeout(() => {
      setAnimatedCells(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 300);
  }, [template, card, cols, rows, selectedColor]);


  const handleOnUploadImage = useCallback(async (src: string, role: "background" | "element") => {
    if (!template || !template[side]) return;
  
    recordSnapshot();
  
    setHistory(prev => [
      ...prev,
      {
        mode,
        cardState: {
          width: card?.width ?? 0,
          height: card?.height ?? 0,
          background: card?.background ?? "",
          backgroundImage: card?.backgroundImage ?? "",
          gridColors: card?.gridColors ?? [],
          elements: [...(template[side]?.elements ?? [])],
        },
      },
    ]);
  
    const enriched = await injectAssetIntoTemplate(template, { src, role });
  
    setTemplate(prev => {
      if (!prev || !prev[side]) return prev;
      return {
        ...prev,
        [side]: enriched[side],
      };
    });
  }, [template, side, card, mode]);

  const setModeActive = useCallback((bool: boolean) => {
    setCropModeActive(bool);

   /*if (cropModeActive) {
      document.body.style.cursor = 'crosshair';
    } else {
      document.body.style.cursor = 'default';
    }*/
  }, [cropModeActive]);

  const captureBothSides = useCallback(async () => {
    if (!stageRef.current) return;

    //const clonedTemplate: DualTemplate = JSON.parse(JSON.stringify(template));

    
  
    setShowBleeds(false);
    setShowRulers(false);



    setMode("insideFace");
  
    setSide("front");
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('generating preview for front', showBleeds, showRulers)
    const front = captureCardFaceSnapshot({
      stageRef,
      bounds: canvasBounds,
      pixelRatio: 2,
    });
  
    setSide("back");
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('generating preview for back', showBleeds, showRulers)
    const back = captureCardFaceSnapshot({
      stageRef,
      bounds: canvasBounds,
      pixelRatio: 2,
    });
  
    setSide("front");
    setSnapshots({ front, back });
    setShowGallery(true);
    setLastSavedTemplate(template);
    
    //console.log('clonedTemplate', clonedTemplate)

    //handleTemplateSelect(clonedTemplate || undefined);
  
  }, [stageRef, canvasBounds, template, showRulers, showBleeds]);


  const handleSaveCard = useCallback(async () => {
    if (!template || !template.front || !template.front.card) {
      console.warn("🛑 Cannot save: missing front face or template.");
      return;
    }
  
    let patchedTemplate: DualTemplate = template;
  
    if (selectedTextId && template?.[side]?.elements) {
      const updatedElements = [...template[side].elements];
      const elIndex = updatedElements.findIndex(el => el.id === selectedTextId);
      const el = updatedElements[elIndex];
  
      if (el?.type === "text") {
        updatedElements[elIndex] = {
          ...el,
          font: el.font,
          size: el.size,
          isBold,
          isItalic,
        };
  
        patchedTemplate = {
          ...template,
          [side]: {
            ...template[side],
            elements: updatedElements,
          },
        };
      }
    }
  
    const serialized = serializeDualTemplate(patchedTemplate, mode);
  
    const designData = {
      name: `Ceremony - ${template.id}`,
      templateId: template.id,
      id:template.id,
      size:template.size,
      tone:template.tone,
      previewMode:template.previewMode,
      author: "Tobias Chilonga",
      savedAt: new Date().toISOString(),
      thumbnailUrl: "/assets/logo.png",
      userId: "chilongatobias@gmail.com",
      insideMessage,
      cellSize:cellSize,
      data: serialized,
    };
  
    try {
      const res = await fetch("/api/saveDesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(designData),
      });
  
      if (res.ok) {
        console.log("💾 Saved DualTemplate:", designData);
      } else {
        console.error("❌ Save failed:", await res.text());
      }
    } catch (err) {
      console.error("🚨 Save error:", err);
    }
  }, [template, selectedTextId, side, isBold, isItalic, mode, insideMessage]);
  
  

  const handlePrint = useCallback(() => {
    setPrepareForPrint(true);
    printSnapshots(snapshots); // { front, back }
  }, [snapshots]);


  const handleSaveToArchive = useCallback((mode: CanvasMode = "front") => {
    if (!snapshots.front || !snapshots.back || !template) return;
  
    const timestamp = new Date().toISOString();
  
    const entryFront: SnapshotEntry = {
      image: snapshots.front,
      side: "front",
      width: card?.width,
      height: card?.height,
      timestamp,
      templateId: template.id,
      tone: template.tone as tone,
      type: mode === "insideFace" ? "insideFront" : "front",
      template,
    };
  
    const entryBack: SnapshotEntry = {
      image: snapshots.back,
      side: "back",
      width: card?.width,
      height: card?.height,
      timestamp,
      templateId: template.id,
      tone: template.tone as tone,
      type: mode === "insideFace" ? "insideBack" : "back",
      template,
    };
  
    setSnapshotArchive(prev => [...prev, entryFront, entryBack]);
    console.log("Design saved to archive ✨");
    setLastSavedTemplate(template);
    setTemplate(null);
  }, [snapshots, template, card]);



  const handleTemplateSelect = useCallback((tpl?: DualTemplate) => {
    if (!tpl) {
      console.warn("⚠️ No template provided to handleTemplateSelect");
      return;
    }
  
    try {
      const normalized = normalizeDualTemplate(tpl);
      console.log("🧩 handleTemplateSelect → normalized template:",
                      normalized, normalized.width, 
                      normalized.height,
                   'cellSize', normalized.front?.elements
                  );
  
      setTemplate(normalized);
      setSide("front");
      setSelectedTextId(null);
      setSelectedImageId(null);
      setShowToolbar(false);
      setInputPosition(null);
      setHistory([]);
      setFuture([]);
      setCellSize(normalized.front?.card.cellSize ?? cellSize);
      setMode("card");
  
      renderToCanvas(normalized, setTemplate, setMode);
      //setShowBleeds(true);
      //setShowRulers(true);
      setShowGallery(false);

     
    } catch (err) {
      console.error("🛑 Failed to parse and render template:", err);
    }
  }, [setTemplate, setSide, setSelectedTextId, setSelectedImageId, setShowToolbar, setInputPosition, setHistory, setFuture, setCellSize, setMode, setShowBleeds, setShowRulers, setShowGallery, cellSize]);
  

  
  const handleRenderBlankTemplate = useCallback(() => {
    if (!lastSavedTemplate) return;
  
    const blankTemplate: DualTemplate = JSON.parse(JSON.stringify(lastSavedTemplate));
    console.log("🧼 handleRenderBlankTemplate → cloned template:", blankTemplate);
  
    const gridLength = lastSavedTemplate.front?.card?.gridColors?.length ?? 60;
  
    if (blankTemplate.front?.card && blankTemplate.back?.card) {
      blankTemplate.front.card.gridColors = Array(gridLength).fill("#ffffff");
      blankTemplate.back.card.gridColors = Array(gridLength).fill("#ffffff");
  
      blankTemplate.front.card.backgroundImage = "";
      blankTemplate.back.card.backgroundImage = "";
  
      blankTemplate.front.elements = [];
      blankTemplate.back.elements = [];
    }
  
    handleTemplateSelect(blankTemplate);
    setShowGallery(false);
    //setShowBleeds(true);
    //setShowRulers(true);
    setFaceMode("insideFront");
    setLastSavedTemplate(lastSavedTemplate);
    return blankTemplate;
  }, [lastSavedTemplate, handleTemplateSelect]);


  const showDesignView = useCallback(() => {
    console.log("showDesignView", lastSavedTemplate);
    handleTemplateSelect(lastSavedTemplate ?? undefined);
    setShowGallery(false);
    //setShowBleeds(true);
    //setShowRulers(true);
  }, [lastSavedTemplate, handleTemplateSelect]);

  
  const showCompleteDesign = useCallback(() => {
    console.log("showCompleteDesign: showing complete design");
    setDesignInside(false);
  }, []);



  const onPrimitiveSelect = useCallback(() => {
    console.log("primitiveSelected");
   
  }, []);


  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    return;
  
    const scaleBy = 1.05;
    const stage = stageRef.current;
    if (!stage) return;
  
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
  
    const oldZoom = zoom;
    const direction = e.evt.deltaY < 0 ? 1 : -1;
    const newZoom = direction > 0 ? oldZoom * scaleBy : oldZoom / scaleBy;
    const clampedZoom = Math.max(1, newZoom);
  
    if (clampedZoom <= 1) {
      setShowBleeds(true);
      setBleedToggleDisabled(false);
    } else {
      setShowBleeds(false);
      setBleedToggleDisabled(true);
    }
  
    const newPosition = {
      x: pointer.x - ((pointer.x - position.x) / oldZoom) * clampedZoom,
      y: pointer.y - ((pointer.y - position.y) / oldZoom) * clampedZoom
    };
  
    setZoom(clampedZoom);
    setPosition(newPosition);
  }, []);



  const addReflection = useCallback(async (userId:string, message: string, tone: tone, elementId: string, designId:string) => {
    await fetch('/api/addReflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        designId,
        elementId,
        message,
        tone,
        createdBy: userId
      })
    });
  
    // Refresh reflections
    const res = await fetch(`/api/reflections?designId=${designId}`);
    const data = await res.json();
    setReflections(data);
  }, []);


  const resetDesign = useCallback(() => {
    setSelectedImageId(null);
    resetTransformMode();
    setCropModeActive(false);
    setIsMultline(false);
    setIsUnderline(false);
    
  }, []);



  const handleInvite = useCallback(async (email: string) => {
    if(!template || !accessLevel) return;
    const id = template.id;
    const body ={
      id,
      //userId,
      accessLevel,
      invitedEmail: email
    }
    try {
      const res = await fetch('/api/shareDesign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({body})
      });
  
      if (!res.ok) {
        throw new Error('Failed to send invite');
      }
  
      // Optional: toast or feedback
      console.log(`✅ Invitation sent to ${email}`);
    } catch (err) {
      console.error('🚨 Invite error:', err);
      // Optional: toast or error feedback
    }
  }, [template, accessLevel]);


  const addDesignElement = useCallback((el:DesignElement) => {
    //add selected element from elementPanel ..do this by updating template designElements.map(el)
    
  }, []);



  /*const setDesignElement = useCallback((el:DesignElement) => {
    //add selected element from elementPanel ..do this by updating template designElements.map(el)
    
   
    //designElements.push(el);

    //setDesignElements([]);
    //console.log('design element being called....', el, designElements)


    //handleAddElement(el.type);
  }, []);*/
  
  


  
  
  
  

  // You can now export all these methods in your return block
  return {
    // Core orchestration
    setDesignElement,
    setDesignElements,
    setTemplate,
    setLastSavedTemplate,
    setMode,
    setFaceMode,
    setSide,
    setShowRulers,
    setShowBleeds,
    setShowGrids,
    setBrushSize,
    setSelectedColor,
    setSnapshotArchive,
    setShowExportModal,
    setViewMode,
    setDesignInside,
    setDesignComplete,
    setInsideMessage,
    setShowGallery,
    setSelectedTextId,
    setSelectedImageId,
    setCropRegion,
    setInputPosition,
    setStageSize,
    setGhostOpacity,
    setEditingText,
    setTextAlign,
    setShowToolbar,
    setPortalTarget,
    setDynamicBackground,
    setShowBackground,
    setShowReflectionModal,
    setShowCommentModal,
    setShowShareModal,
    setAccessLevel,
    setCellSize,
    setZoom,
    setPosition,
    setBleedToggleDisabled,
    setCropModeActive,
    setSelectedFont,
    setSelectedFontSize,
    setPendingStyle,
    setAnimatedCells,

    // History and state
    handleUndo,
    handleRedo,
    commitHistoryEntry,
    recordSnapshot,
    setDualFaces,

    // Text editing
    handleAddText,
    handleRemoveText,
    handleTextEdit,
    handleTextUpdate,
    handleTextClick,
    handleTextBlur,
    exitEditingMode,
    onTextChange,
    onFontChange,
    onFontSizeChange,
    onColorChange,
    handleToggleBold,
    handleToggleItalic,

    // Image editing
    handleImageUpdate,
    handleOnUploadImage,

    // Grid painting
    handleCellPaint,

    // Zoom and transform
    handleZoom,
    setDesignGridPosition,
    setModeActive,
    activateTransformMode,

    // Snapshot and export
    captureBothSides,
    handleSaveCard,
    handlePrint,
    handleSaveToArchive,
    handleRenderBlankTemplate,

    // Template lifecycle
    handleTemplateSelect,
    showDesignView,
    showCompleteDesign,
    handleWheel,
    onPrimitiveSelect,
    setReflections,
    resetDesign,
    handleInvite,
    setOverlayStyle,
    
    //handleAddElement,
    
  };
}
