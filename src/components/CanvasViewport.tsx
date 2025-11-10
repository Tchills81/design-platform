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
  resetTransformMode: () => void;
  setModeActive:(active:boolean)=>void;

  scrollPos:{x:number; y:number};

  setScrollPosition:React.Dispatch<React.SetStateAction<{ x: number; y: number; }>>;
  
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
  setTemplate: (value: React.SetStateAction<DualTemplate | null>) => void;
  setElementId: React.Dispatch<React.SetStateAction<string>>;
  konvaText: Konva.Text | null;

  pendingStyle: {
    isBold?: boolean;
    isItalic?: boolean;
}

setPendingStyle: React.Dispatch<React.SetStateAction<
{   isBold: boolean;
    isItalic: boolean;
 } | {} >>;

 


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
    setSelectedTextId: (value: React.SetStateAction<string | null>) => void;
    setKonvaText: (node:Konva.Text)=>void;
     _handleTextClick: (textNode: Konva.Text) => void;

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
    stageStyle

  } = props;

  const face = template[side];
  const card = face?.card;
  if (!card) return null;  

  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();

 const  backgroundColor = isPreviewMode ? toneBackgroundClasses[template.tone as tone] : '#e2e8f0';

 
  

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


        onClick={(e) => {
            const overlayEl = document.getElementById('text-overlay');
            const overImageBar = document.getElementById('image-tool-bar');
            const { clientX, clientY } = e.evt;
            const domTarget = document.elementFromPoint(clientX, clientY);
          
            const clickedInsideOverlay = overlayEl?.contains(domTarget);

            const clickedInsideOverImageBar = overImageBar?.contains(domTarget);
            console.log('overImageBar', e.target); 

            if (clickedInsideOverlay || clickedInsideOverImageBar) {
              console.log('Clicked inside overlay / image toolbar — do not dismiss ');
              return;
            }
          
            const clickedNode = e.target;
            const className = clickedNode.getClassName?.();
            const nodeName = clickedNode.name?.();
          
            const isImage = className === 'Image';
            const isShape = nodeName === 'Shape';
            const isTransformer = className === 'Transformer';
            const isRect = className === 'Rect';
            const isStage = clickedNode === e.target.getStage();
          
           // console.log('clickedInsideOverImageBar', clickedInsideOverImageBar);
          
            // 🎯 Show transform only for image or shape
            const shouldShowTransform = isImage || isShape;
          
            // 🧹 Dismiss selection for canvas or stage
            const shouldDismiss = isRect || isStage;
          
            // 🧼 Dismiss for anything else
            const isUnknown = !isImage && !isShape && !isTransformer && !isStage && !isRect;
          
            if (shouldDismiss || isUnknown) {
              handlers.setSelectedImageId(null);
              resetTransformMode();
              setModeActive(false);
              return;
            }
          
            // 🎨 Apply pending style updates
            if (shouldShowTransform && selectedTextId && template?.[side]?.elements) {
              const updatedElements = template[side].elements.map(el =>
                el.id === selectedTextId && el.type === 'text'
                  ? { ...el, ...pendingStyle }
                  : el
              );
          
              setTemplate(prev => ({
                ...prev!,
                [side]: {
                  ...prev![side],
                  elements: updatedElements
                }
              }));
          
              setPendingStyle({});
            }
          
            // ✨ Show transform
            if (shouldShowTransform) {
              konvaText?.visible(true);
              konvaText?.getLayer()?.batchDraw();
            }
          }}
          
      >
        {/* Canvas layer */}
        <CardSideLayer
        isPreviewMode={isPreviewMode}
          scrollOffset={scrollOffset}
          scrollPos={scrollPos}
          setScrollPosition={setScrollPosition}
          card={card}
          elements={face?.elements}
          designElements={designElements}
          side={side}
          editingText={editingText}
          templateId={template.id}
          tone={template.tone as tone}
          selectedImageId={selectedImageId}
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
        <Layer x={position.x} y={position.y} scaleX={zoom} scaleY={zoom}  listening={false}>
            <Rect stroke={'#1e1e1e'} width={template.width} height={template.height} listening={false}/>

        </Layer>

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
