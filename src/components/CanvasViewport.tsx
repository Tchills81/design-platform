'use client';

import { Stage, Layer, Line, Text } from 'react-konva';
import { CardSideLayer } from '@/src/components/CardSideLayer';
import RulerLayer from '@/src/components/RulerLayer';
import { PrintGuidesOverlay } from '@/src/components/PrintGuidesOverlay';
import { CropDragOverlay } from '@/src/components/CropDragOverlay';
import { CropBoxOverlay } from '@/src/components/CropBoxOverlay';
import { CanvasMode } from '@/src/types/CanvasMode';
import { DualTemplate, TemplateElement } from '@/src/types/template';
import { RefObject } from 'react';
import { tone } from '../types/tone';
import Konva from 'konva';
import { DesignElement } from '../types/DesignElement';
import CanvasScrollbars from './CanvasScrollbars';

interface CanvasViewportProps {
  template: DualTemplate;
  side: 'front' | 'back';
  mode: CanvasMode;
  zoom: number;
  stageSize: { width: number; height: number };
  scrollOffset: { x: number; y: number };
  cardGridGroupRef: RefObject<any>;
  stageRef: RefObject<any>;
  showRulers: boolean;
  showBleeds: boolean;
  ghostLines: { x?: number; y?: number };
  ghostOpacity: number;
  cropModeActive: boolean;
  selectedImageId: string | null;
  selectedTextId: string | null;
  cropRegion: { x: number; y: number; width: number; height: number };

  scrollPos:{x:number; y:number};

  setScrollPosition:React.Dispatch<React.SetStateAction<{ x: number; y: number; }>>;
  
  setCropRegion: (region: { x: number; y: number; width: number; height: number }) => void;
  canvasSize:{width:number; height:number};
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
  setTemplate: (value: React.SetStateAction<DualTemplate | null>) => void;
  setElementId: React.Dispatch<React.SetStateAction<string>>;
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
    setInputPosition: (pos: { x: number; y: number }) => void;
    setShowToolbar: (show: boolean) => void;
    setSelectedImageId: (id: string) => void;
    onFontSizeChange: (size: number) => void;
    onPrimitiveSelect: () => void;
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
    scrollPos,
    cardX,
    cardY,
    position,
    canvasBounds,
    containerRef,
    editingText,
    designElements,
    transformModeActive,
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
    handlers,
  } = props;

  const face = template[side];
  const card = face?.card;
  if (!card) return null;

  //console.log('scrollPos', scrollPos, 'position', position)

  return (
    <div
      style={{
        width: stageSize.width,
        height: stageSize.height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f9fafb',
      }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        style={{ backgroundColor: '#f0f0f0' }}
      >
        {/* Canvas layer */}
        <CardSideLayer
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
  canvasSize={canvasSize}
  viewportSize={stageSize}
  tone={template.tone}
/>


      
    </div>
  );
}
