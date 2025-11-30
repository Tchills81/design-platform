'use client';

import { Stage, Layer } from 'react-konva';
import { CanvasMode } from "@/src/types/CanvasMode";
import { DualTemplate } from "@/src/types/template";
import { CropBoxOverlay } from "@/src/components/CropBoxOverlay";
import { CropDragOverlay } from '@/src/components/CropDragOverlay';
import { CardSideLayer } from "@/src/components/CardSideLayer";
import RulerLayer from "@/src/components/RulerLayer";
import { PrintGuidesOverlay } from '@/src/components/PrintGuidesOverlay';
import GhostLines from "@/src/components/GhostLines";
import { useCanvasActions } from '../hooks/useCanvasActions';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';

import { useCanvasState } from '../hooks/useCanvasState';

import { Line } from 'react-konva';
import { Text } from 'react-konva';
import { tone } from '@/src/types/tone';


import CanvasViewport from '@/src/components/CanvasViewport';


export interface CanvasStageProps {
  template: DualTemplate | null;
  mode: CanvasMode;
  side: 'front' | 'back';
  setTemplate: (value: React.SetStateAction<DualTemplate | null>) => void;
  handleOnUploadImage: (src: string, role: 'background' | 'element') => void;
  setCropRegion: (region: { x: number; y: number; width: number; height: number }) => void;
  state: ReturnType<typeof useCanvasState>;
  actions: ReturnType<typeof useCanvasActions>;
  
}

export default function CanvasStage({
  template,
  mode,
  side,
  setTemplate,
  handleOnUploadImage,
  setCropRegion,
  state,
  actions
}: CanvasStageProps) {
  if (!template) return null;

  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();

  const {
    zoom,
    cardX,
    cardY,
    canvasBounds,
    containerRef,
    stageRef,
    editingText,
    ghostLines,
    ghostOpacity,
    cropRegion,
    cropModeActive,
    selectedTextId,
    selectedImageId,
    setSelectedTextId,
    setShowToolbar,
    setInputPosition,
    pendingStyle,
    setPendingStyle,
    setSelectedImageId,
    showRulers,
    showBleeds,
    brushSize,
    selectedColor,
    brushColor,
    rows,
    cols,
    cellSize,
    frontImage,
    backImage,
    setGhostLines,
    updateImageRef,
    transformModeActive,
    stageSize,
    resetTransformMode,
    position,
    card,
    canvasHeight,
    canvasWidth,
    showBackground,
    dynamicBackground,
    designElements,
    textAlign,
    setTextAlign,
    isMultiline,
    isUnderline,
    setElementId,
    cardGridGroupRef,
    scrollOffset,
    initialZoomedOutValue,
    stageStyle,
    showPages,
    stripHeight,
   
    scrollPosition,
    canvasSize,
    thumbValue,
    isPreviewMode,
    elementRef,
    konvaText,
    SIDEBAR_WIDTH,
    activeTab,
    isTransitioningTemplate,
    handleElementClick,
    clearAll,
    addSelection,
removeSelection,
toggleSelection,

// marquee (optional for later steps)
isMarqueeActive,
marqueeRect,
startMarquee,
updateMarquee,
finalizeMarquee,
setMarqueeActive,
setMarqueeRect,
selectOnly,
selectedIds,
boundingBox,
templateElement,
onGroupUpdate,
groupElement,
selectedGroupId,
setSelectedGroupId,
setTransformModeActive,
setIsolationMode,
isIsolationMode,
setBoundsRect,
boundsRect,
setElementsGrouped,
setStagePosition,
stagePosition,
cardBounds
  } = state;
  
  const {
    handleCellPaint,
    handleImageUpdate,
   
    handleTextEdit,
    handleTextUpdate,
    
    setSelectedColor,
    setSelectedFont,
    onFontSizeChange,
    handleWheel,
    onPrimitiveSelect,
    resetDesign,
    setModeActive,
    handleScroll,
    setScrollPosition,
    handleHorizontalScroll,
    handleVerticalScroll,
    _handleTextClick,
    setKonvaText,
    setActiveTab,
    commitGroupUpdate,
    groupSelectedElements,
    
     // ✅ now correctly sourced from actions
  } = actions;
  

  //const face = template[side];
  //const card = face?.card;

  const isAtInitialZoom = Math.abs(zoom - initialZoomedOutValue) < 0.001;

  const konvaGroup = cardGridGroupRef.current;

  //console.log('startMarquee',startMarquee);
  //console.log('startMarquee',startMarquee);
//console.log('stage...:',onGroupUpdate, setSelectedGroupId, isIsolationMode, setIsolationMode, setBoundsRect, boundsRect)


  
  return (

    
    <CanvasViewport
    groupEl={groupElement}
   setActiveTab={setActiveTab}
   tab={activeTab}
   isIsolationMode={isIsolationMode}
  template={template}
  side={side}
  mode={mode}
  zoom={zoom}
  elementRef={elementRef}
  thumbValue={thumbValue}
  stageSize={stageSize}
  stageStyle={stageStyle}
  scrollPos={scrollPosition}
  setScrollPosition={setScrollPosition}
  scrollOffset={scrollOffset}
  cardGridGroupRef={cardGridGroupRef}
  stageRef={stageRef}
  showRulers={showRulers}
  showBleeds={showBleeds}
  ghostLines={ghostLines}
  ghostOpacity={ghostOpacity}
  cropModeActive={cropModeActive}
  selectedImageId={selectedImageId}
  selectedTextId={selectedTextId}
  cropRegion={cropRegion}
  setCropRegion={setCropRegion}
  canvasSize={canvasSize}
  cardX={cardX}
  cardY={cardY}
  position={position}
  canvasBounds={canvasBounds}
  containerRef={containerRef}
  editingText={editingText}
  designElements={designElements}
  transformModeActive={transformModeActive}
  rows={rows}
  cols={cols}
  cellSize={cellSize}
  brushColor={brushColor}
  bgImage={side === 'front' ? frontImage : backImage}
  showBackground={showBackground}
  dynamicBackground={dynamicBackground}
  textAlign={textAlign}
  isMultiline={isMultiline}
  isUnderline={isUnderline}
  setTemplate={setTemplate}
  setElementId={setElementId}
  setPendingStyle={setPendingStyle}
  resetTransformMode={resetTransformMode}
  setModeActive={setModeActive}
  pendingStyle={pendingStyle}
  isPreviewMode={isPreviewMode}
  konvaText={konvaText}
  isTransitioningTemplate={isTransitioningTemplate}
  SIDEBAR_WIDTH={SIDEBAR_WIDTH}
  selectedIds={selectedIds}
  boundingBox={boundingBox?.stage}
  boundingGroupBox={boundingBox?.group}
  clearAll={clearAll}
 isMarqueeActive={isMarqueeActive}
  marqueeRect={marqueeRect}
  startMarquee={startMarquee}
  updateMarquee={updateMarquee}
  finalizeMarquee={finalizeMarquee}
  setMarqueeActive={setMarqueeActive}
  addSelection={addSelection}
  removeSelection={removeSelection}
  toggleSelection={toggleSelection}
  selectOnly={selectOnly}
  boundsRect={boundsRect}
  stagePosition={stagePosition}
  cardBounds={cardBounds}

  handlers={{
    setImageRef: updateImageRef,
    onPaint: handleCellPaint,
    onImageUpdate: handleImageUpdate,
    onTextEdit: handleTextEdit,
    onTextUpdate: handleTextUpdate,
    onPrimitiveSelect: onPrimitiveSelect,
    handleHorizontalScroll:handleHorizontalScroll,
    handleVerticalScroll:handleVerticalScroll,
    setSelectedTextId: setSelectedTextId,
    _handleTextClick:_handleTextClick,
    handleElementClick:handleElementClick,
    setKonvaText:setKonvaText,
    setSelectedGroupId:setSelectedGroupId,
    onGroupUpdate:onGroupUpdate,
    setTransformModeActive:setTransformModeActive,
    setIsolationMode:setIsolationMode,
    setBoundsRect:setBoundsRect,
    commitGroupUpdate:commitGroupUpdate,
    setElementsGrouped:setElementsGrouped,
    groupSelectedElements:groupSelectedElements,
    setGhostLines,
    setSelectedFont,
    setSelectedColor,
    setInputPosition,
    setShowToolbar,
    setSelectedImageId,
    onFontSizeChange,
   
  }}
/>

    
  );
}
