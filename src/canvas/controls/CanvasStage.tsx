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
import { useCanvasState } from '../hooks/useCanvasState';
import { useCanvasActions } from '../hooks/useCanvasActions';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';

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
    verticalOffset,
    scrollContainerRef,
    largeContainerRef,
    largeContainerSize,
    scrollPosition,
    canvasSize,
    thumbValue,
    isPreviewMode,
    elementRef,
    konvaText,
  

  } = state;
  
  const {
    handleCellPaint,
    handleImageUpdate,
    handleTextClick,
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
    setKonvaText
    
     // ✅ now correctly sourced from actions
  } = actions;
  

  //const face = template[side];
  //const card = face?.card;

  const isAtInitialZoom = Math.abs(zoom - initialZoomedOutValue) < 0.001;

  const konvaGroup = cardGridGroupRef.current;

  //console.log('scrollPos....', scrollPosition, 'position', position)

  return (

    
    <CanvasViewport
  template={template}
  side={side}
  mode={mode}
  zoom={zoom}
  elementRef={elementRef}
  thumbValue={thumbValue}
  stageSize={stageSize}
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
  
  handlers={{
    setImageRef: updateImageRef,
    onPaint: handleCellPaint,
    onImageUpdate: handleImageUpdate,
    onTextClick: handleTextClick,
    onTextEdit: handleTextEdit,
    onTextUpdate: handleTextUpdate,
    onPrimitiveSelect: onPrimitiveSelect,
    handleHorizontalScroll:handleHorizontalScroll,
    handleVerticalScroll:handleVerticalScroll,
    setSelectedTextId: setSelectedTextId,
    _handleTextClick:_handleTextClick,
    setKonvaText:setKonvaText,
    
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
