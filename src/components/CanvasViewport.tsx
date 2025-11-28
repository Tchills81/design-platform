'use client';

import { Stage, Layer, Line, Text, Rect } from 'react-konva';
import { CardSideLayer } from '@/src/components/CardSideLayer';
import RulerLayer from '@/src/components/RulerLayer';
import { PrintGuidesOverlay } from '@/src/components/PrintGuidesOverlay';
import { CropDragOverlay } from '@/src/components/CropDragOverlay';
import { CropBoxOverlay } from '@/src/components/CropBoxOverlay';
import { CanvasMode } from '@/src/types/CanvasMode';
import { DualTemplate, TemplateElement } from '@/src/types/template';
import { RefObject } from 'react';
import { tone,toneBackgroundClasses } from '../types/tone';
import Konva from 'konva';
import { DesignElement } from '../types/DesignElement';
import CanvasScrollbars from './CanvasScrollbars';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';
import { SidebarTab } from '../types/Tab';
import { useSelectedElement } from './elements/useSelectedElement';
import { KonvaEventObject } from 'konva/lib/Node';
import { ClearOptions } from '../canvas/hooks/useClearSelection';
import { BoundsRect, MarqueeRect } from '../canvas/store/useContextStore';
import { BoundingBox } from '../canvas/hooks/useBoundingBox';

interface CanvasViewportProps {
  template: DualTemplate;
  side: 'front' | 'back';
  SIDEBAR_WIDTH:number;
  stageStyle: {};
  mode: CanvasMode;
  zoom: number;
  stageSize: { width: number; height: number };
  scrollOffset: { x: number; y: number };
  cardGridGroupRef: RefObject<any>;
  stageRef: RefObject<any>;
  elementRef: RefObject<HTMLDivElement | null>
  showRulers: boolean;
  showBleeds: boolean;
  ghostLines: { x?: number; y?: number };
  ghostOpacity: number;
  cropModeActive: boolean;
  selectedImageId: string | null;
  selectedTextId: string | null;
  cropRegion: { x: number; y: number; width: number; height: number };
  groupEl:TemplateElement | null;

  resetTransformMode: () => void;

  setModeActive:(active:boolean)=>void;
  toggleSelection: (id: string) => void;
  addSelection: (id: string) => void;
  selectOnly: (id: string) => void;
  removeSelection: (id: string) => void;

  isMarqueeActive: boolean;

  startMarquee: (pos: {
    x: number;
    y: number;
}) => void;
updateMarquee: (pos: {
  x: number;
  y: number;
}) => void;

finalizeMarquee: (elements: TemplateElement[], stage: Konva.Stage) => void
setMarqueeActive: (b: boolean | ((prev: boolean) => boolean)) => void;

marqueeRect: MarqueeRect | null;

selectedIds: string[];

boundingBox: BoundingBox | undefined;
boundingGroupBox: BoundingBox | undefined;


  scrollPos:{x:number; y:number};
   setActiveTab: (tab: SidebarTab | null) => void
   tab:SidebarTab;

  

  setScrollPosition: (pos: {
    x: number;
    y: number;
}) => void;
  
  setCropRegion: (region: { x: number; y: number; width: number; height: number }) => void;
  canvasSize:{scaleX:number; scaleY:number; width:number; height:number};
  thumbValue:number;
  cardX: number;
  cardY: number;
  position: { x: number; y: number };
  canvasBounds: { width: number; height: number; x: number; y: number };
  containerRef: RefObject<any>;
  editingText: string | undefined;
  designElements: DesignElement[];
  transformModeActive: boolean;
  isTransitioningTemplate: boolean;
  rows: number;
  cols: number;
  cellSize: number;
  brushColor: string;
  bgImage: HTMLImageElement | undefined;
  showBackground: boolean;
  dynamicBackground: string;
  textAlign: 'center' | 'left' | 'right';
  isMultiline: boolean;
  isUnderline: boolean;
  isPreviewMode:boolean;
  isIsolationMode:boolean;
  setTemplate: (value: React.SetStateAction<DualTemplate | null>) => void;
  
  clearAll: (opts?: ClearOptions) => void
  setElementId: (id: string) => void
  konvaText: Konva.Text | null;
  boundsRect: BoundsRect | null;

  pendingStyle: {
    isBold?: boolean;
    isItalic?: boolean;
}





 setPendingStyle: (style: {
    isBold?: boolean
    isItalic?: boolean;
}) => void;

 


  handlers: {
    setImageRef?: (ref: Konva.Image | null) => void;
    onPaint?: (col: number, row: number) => void;
    onImageUpdate: (e: any, id: string) => void;
    onTextClick: (label: string, pos: { x: number; y: number }, id: string) => void;
    onTextEdit: (text: string, pos: { x: number; y: number }, el: TemplateElement) => void;
    onTextUpdate: (updated: TemplateElement) => void;
    setGhostLines: (lines: { x?: number; y?: number }) => void;
    setSelectedFont: (font: string) => void;
    setSelectedColor: (color: string) => void;
    setInputPosition: (pos: { x: number; y: number } | null) => void;
    setShowToolbar: (show: boolean) => void;
    setSelectedImageId: (id: string | null) => void;
    onFontSizeChange: (size: number) => void;
    onPrimitiveSelect: () => void;
    handleHorizontalScroll:(e: React.ChangeEvent<HTMLInputElement>)=>void;
    handleVerticalScroll:(e: React.ChangeEvent<HTMLInputElement>)=>void;
    //setSelectedTextId: (value: React.SetStateAction<string | null>) => void;
    setSelectedTextId: (id: string | null) => void
    setKonvaText: (node:Konva.Text | null)=>void;
     _handleTextClick: (textNode: Konva.Text, tabActive:boolean) => void;
     handleElementClick: (e: KonvaEventObject<MouseEvent>, id: string) => void;
     setSelectedGroupId: (id: string | null) => void;
     onGroupUpdate: (updated: TemplateElement) => void;
     setTransformModeActive: (enabled: boolean) => void;
     setIsolationMode: (b: boolean | ((prev: boolean) => boolean)) => void;
     setBoundsRect: (rect: BoundsRect | null)=>void;
     commitGroupUpdate: (updatedGroupElement: TemplateElement) => void;
     setElementsGrouped: (b: boolean) => void;
     groupSelectedElements: () => void;

  };
}

export default function CanvasViewport(props: CanvasViewportProps) {
  const {
    template,
    side,
    mode,
    zoom,
    stageSize,
    scrollOffset,
    cardGridGroupRef,
    stageRef,
    showRulers,
    showBleeds,
    ghostLines,
    ghostOpacity,
    cropModeActive,
    selectedImageId,
    selectedTextId,
    cropRegion,
    setCropRegion,
    setScrollPosition,
    pendingStyle,
    setPendingStyle,
    scrollPos,
    cardX,
    cardY,
    position,
    canvasBounds,
    containerRef,
    editingText,
    designElements,
    transformModeActive,
    resetTransformMode,
    setModeActive,
    rows,
    cols,
    cellSize,
    brushColor,
    bgImage,
    showBackground,
    dynamicBackground,
    textAlign,
    isMultiline,
    isUnderline,
    setTemplate,
    setElementId,
    canvasSize,
    thumbValue,
    handlers,
    isPreviewMode,
    elementRef,
    konvaText,
    SIDEBAR_WIDTH,
    stageStyle,
    setActiveTab,
    isTransitioningTemplate,
    tab,
    clearAll,
    isMarqueeActive,
    startMarquee,
    updateMarquee,
    finalizeMarquee,
    marqueeRect,
    selectedIds,
    boundingBox,
    boundingGroupBox,
    toggleSelection,
    addSelection,
    selectOnly,
    groupEl,
    isIsolationMode,
    boundsRect

  } = props;

  const face = template[side];
  const card = face?.card;
  if (!card) return null;  

  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();

 const  backgroundColor = isPreviewMode ? toneBackgroundClasses[template.tone as tone] : '#e2e8f0';



 /*const { selectedElement, role} = useSelectedElement({
  selectedImageId: selectedImageId ?? null,
  selectedTextId: selectedTextId ?? null,
  template:template,
  side: side
});

 console.log("CanvasViewport - selectedElement:", selectedElement);*/

 //console.log('startMarquee..',startMarquee, 'selectedIds:',selectedIds);
 //console.log('viewport...:',handlers.onGroupUpdate, handlers.setSelectedGroupId, isIsolationMode, 
  //handlers.setIsolationMode, handlers.setBoundsRect, boundsRect)


  return (
    <div
    ref={elementRef}
    className="canvas-stage"
    style={{
      position: 'relative',
      
     
      top: 0,
      overflow: 'hidden'
    }}
  >
  
      
    
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        className={`${isPreviewMode? backgroundColor:backgroundClass}`}
        style={stageStyle}



        onMouseDown={(e) => {
          const clickedNode = e.target;
          const stage = e.target.getStage();
        
          // Stage itself
          const isStage = clickedNode === stage;
        
          // Background rect (Konva draws a Rect under the Layer)
          const isBackgroundRect =
            clickedNode.getClassName?.() === 'Rect' &&
            clickedNode.parent?.getClassName?.() === 'Group' &&
            clickedNode.parent?.parent?.getClassName?.() === 'Layer';
        
          if (isStage || isBackgroundRect) {
            const pos = stageRef.current?.getPointerPosition();
            if (pos) {
             // console.log('Starting marquee at', pos);
              startMarquee(pos);
            }
          }
        }}
        
        onMouseMove={(e) => {
          if (!isMarqueeActive) return;
          const pos = stageRef.current?.getPointerPosition();
          if (pos){ 
            //console.log('Updating marquee to', pos);
            updateMarquee(pos);
           
          }
        }}
        onMouseUp={() => {
          if (isMarqueeActive) {
           
            finalizeMarquee(template?.[side]?.elements ?? [], stageRef.current!);
            clearAll({
              clearStoreSelection: false,   // ✅ only clears when background clicked
              clearImageSelection: true,
              clearTextSelection: true,
              hideToolbar: false,
              resetInput: false,
              resetKonvaText: false,
              resetTransform: true,
              setModeInactive: true,
              
            });
          }
        }}


        onClick={(e) => {

         

            /**
             * 
             * 🔍 What This onClick Handler Does
Detects DOM target under the click

Checks if click was inside overlay or image toolbar

If yes → exits early

Identifies clicked Konva node

Class name, node name, type

Dismisses selection if clicked on canvas, rect, or unknown

Calls:

handlers.setSelectedImageId(null)

resetTransformMode()

setModeActive(false)

Applies pending style updates if needed

Shows transform if applicable
             */

// 🔍 DOM overlay checks
const overlayEl = document.getElementById('text-overlay');
const overImageBar = document.getElementById('image-tool-bar');
const { clientX, clientY } = e.evt;
const domTarget = document.elementFromPoint(clientX, clientY);

const clickedInsideOverlay = overlayEl?.contains(domTarget);
const clickedInsideOverImageBar = overImageBar?.contains(domTarget);

//console.log('stage click', e.target);
if (clickedInsideOverlay || clickedInsideOverImageBar) {
  return; // do not dismiss if clicking overlay/toolbars
}

// 🔍 Konva node checks
const clickedNode = e.target;
const className = clickedNode.getClassName?.();
const nodeName = clickedNode.name?.();

const isImage = className === 'Image';
const isShape = nodeName === 'Shape';
const isFrame = nodeName === 'Frame';
const isTransformer = className === 'Transformer';
const isRect = className === 'Rect';
const isStage = clickedNode === e.target.getStage();

// ✅ Consistent background rect detection
const isBackgroundRect =
  isRect &&
  !isShape &&
  !isFrame &&
  clickedNode.parent?.getClassName?.() === 'Group' &&
  clickedNode.parent?.parent?.getClassName?.() === 'Layer';

const shouldShowTransform = isImage || isShape || isFrame;
const shouldDismiss = isStage || isBackgroundRect;
const isUnknown =
  !isImage && !isShape && !isFrame && !isTransformer && !isStage && !isRect;

// 1) Dismissal path — only for Stage or background rect

const isClickOnElement = e.target instanceof Konva.Text || e.target instanceof Konva.Image;


const target = e.target;

if (target instanceof Konva.Text) {
  handlers.setSelectedTextId(clickedNode?.id())
  handlers.setSelectedImageId(null);
  handlers.setSelectedGroupId(null)
} else if (target instanceof Konva.Image) {
  handlers.setSelectedTextId(null)
  handlers.setSelectedImageId(clickedNode?.id());
  handlers.setSelectedGroupId(null)
}


if ( (shouldDismiss || isUnknown )) {

  console.log('clearing  selection Stage onClick', e.target)
  clearAll({
    clearStoreSelection: true,   // ✅ only clears when background clicked
    clearImageSelection: true,
    clearTextSelection: false,
    hideToolbar: false,
    resetInput: false,
    resetKonvaText: false,
    resetTransform: true,
    setModeInactive: true,
    
  });
  return;
}

// 2) Apply pending style to selected text when showing transform
if (shouldShowTransform && selectedTextId && template?.[side]?.elements) {
  const updatedElements = template[side].elements.map((el) =>
    el.id === selectedTextId && el.type === 'text'
      ? { ...el, ...pendingStyle }
      : el
  );

  setTemplate((prev) => ({
    ...prev!,
    [side]: {
      ...prev![side],
      elements: updatedElements,
    },
  }));

  setPendingStyle({});
}

// 3) Select and show transform for the clicked drawable (image/shape/frame)
if (shouldShowTransform) {
  console.log('shouldShowTransform', shouldShowTransform)
  const selectedId = clickedNode.id?.();
  if (selectedId) {
    // ✅ Sync with store selection
    if (e.evt.shiftKey) {
      addSelection(selectedId);   // accumulate
    } else if (e.evt.ctrlKey || e.evt.metaKey) {
      toggleSelection(selectedId); // toggle on/off
    } else {
      selectOnly(selectedId);     // replace
    }

    // Legacy image selection sync
    handlers.setSelectedImageId(selectedId);
  }

  konvaText?.visible(true);
  konvaText?.getLayer()?.batchDraw();
}

}}
          
      >
        {/* Canvas layer */}
        <CardSideLayer
         groupEl={groupEl}
          konvaText={konvaText}
          setKonvaText={handlers.setKonvaText}
          setActiveTab={setActiveTab}
          isTransitioningTemplate={isTransitioningTemplate}
          tab={tab}
          isPreviewMode={isPreviewMode}
          isIsolationMode={isIsolationMode}
          scrollOffset={scrollOffset}
          scrollPos={scrollPos}
          setScrollPosition={setScrollPosition}
          card={card}
          elements={face?.elements}
          designElements={designElements}
          side={side}
          editingText={editingText}
          templateId={template.id}
          template={template}
          tone={template.tone as tone}
          selectedImageId={selectedImageId}
          boundingBox={boundingGroupBox}
          boundingStageBox={boundingBox}
          boundsRect={boundsRect}

          selectedTextId={selectedTextId}
          
          setElementId={setElementId}
          transformModeActive={transformModeActive}
          cardX={cardX}
          cardY={cardY}
          position={position}
          canvasBounds={canvasBounds}
          containerRef={containerRef}
          stageRef={stageRef}
          cardGridGroupRef={cardGridGroupRef}
          zoom={zoom}
          mode={mode}
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          brushColor={brushColor}
          bgImage={bgImage}
          showBackground={showBackground}
          dynamicBackground={dynamicBackground}
          textAlign={textAlign}
          isMultiline={isMultiline}
          isUnderline={isUnderline}
          setTemplate={setTemplate}
          handlers={handlers}
        />
      

        {/* Rulers */}
        {showRulers && (
          <Layer>
            <RulerLayer
              width={stageSize.width}
              height={stageSize.height}
              tone={template.tone}
              zoom={zoom}
            />
          </Layer>
        )}

        {/* Print guides */}
        {showBleeds && (
          <Layer>
            <PrintGuidesOverlay
              cardX={cardX}
              cardY={cardY}
              cardWidth={card.width}
              cardHeight={card.height}
              bleed={36}
              safeZone={24}
              visible={showBleeds}
            />
          </Layer>
        )}

        {/* Ghost lines */}
        <Layer>
          {ghostLines.x !== undefined && (
            <Line
              points={[ghostLines.x, 0, ghostLines.x, stageSize.height]}
              stroke="#aaa"
              dash={[4, 4]}
              strokeWidth={1}
              listening={false}
              opacity={ghostOpacity}
            />
          )}
          {ghostLines.y !== undefined && (
            <Line
              points={[0, ghostLines.y, stageSize.width, ghostLines.y]}
              stroke="#aaa"
              dash={[4, 4]}
              strokeWidth={1}
              listening={false}
              opacity={ghostOpacity}
            />
          )}
          {ghostLines.x !== undefined && (
            <Text
              x={ghostLines.x + 4}
              y={12}
              text={`x = ${ghostLines.x}`}
              fontSize={10}
              fill={template.tone}
              opacity={ghostOpacity}
            />
          )}
          {ghostLines.y !== undefined && (
            <Text
              x={12}
              y={ghostLines.y - 4}
              text={`y = ${ghostLines.y}`}
              fontSize={10}
              fill={template.tone}
              opacity={ghostOpacity}
            />
          )}
        </Layer>

        <Layer>
      
      {cropModeActive && selectedImageId && (
        <>
        <CropDragOverlay
         isActive={cropModeActive}
         onComplete={(region) => setCropRegion(region)}
       />
        <CropBoxOverlay
          cropRegion={cropRegion}
          onUpdate={setCropRegion}
          isLocked={true} // optional toggle
         
      
        />
        </>
         
      )}
      
      </Layer>



        {/* Overlay rectangle */}
  {isMarqueeActive && marqueeRect && (
    <Layer>
      <Rect
        x={marqueeRect.x}
        y={marqueeRect.y}
        width={marqueeRect.w}
        height={marqueeRect.h}
        stroke="blue"
        dash={[4, 4]}
        opacity={0.5}
      />
    </Layer>
  )}



{boundingBox && selectedIds.length > 1 && (
  <Layer>
  <Rect
    x={boundingBox.x}
    y={boundingBox.y}
    width={boundingBox.width}
    height={boundingBox.height}
    stroke="blue"
    dash={[4, 4]}
    listening={false}
  />
  </Layer>
)}
      
      </Stage>

      <CanvasScrollbars
  scrollPosition={scrollPos}
  setScrollPosition={setScrollPosition}
  handleHorizontalScroll={handlers.handleHorizontalScroll}
  handleVerticalScroll={handlers.handleVerticalScroll}
  canvasSize={canvasSize}
  viewportSize={stageSize}
  thumbValue={thumbValue}
  tone={template.tone}
  zoom={zoom}
/>


      
    </div>
  );
}
