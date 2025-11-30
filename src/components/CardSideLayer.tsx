import { Layer, Group } from 'react-konva';
import KonvaImage from './KonvaImage';
import GridRect from './GridRect';
import ImageElement from './ImageElement';
import TextElement from './TextElement';
import { TemplateElement, DualTemplate, isTextElementForTextComponent } from '../types/template';
import { CanvasMode } from '../types/CanvasMode';
import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { DesignElement } from '../types/DesignElement';
import { tone } from '../types/tone';
import { Rect } from 'react-konva';
import { SidebarTab } from '../types/Tab';
import { useSelectedElementLock } from '../canvas/hooks/useElementLock';
import { Bounds, useCardBounds } from '../canvas/hooks/useCardBounds';
import { KonvaEventObject } from 'konva/lib/Node';
import GroupElement from './elements/GroupElement';
import { BoundingBox, useBoundingBox } from '../canvas/hooks/useBoundingBox';
import { BoundsRect } from '../canvas/store/useContextStore';

interface CardSideLayerProps {
  card: {
    width: number;
    height: number;
    background: string;
    backgroundImage?: string;
    gridColors?: string[];
  };
  setKonvaText: (k: Konva.Text | null) => void;
  konvaText: Konva.Text | null;

  isTransitioningTemplate: boolean;
  isPreviewMode?: boolean;
  showBackground: boolean;
  dynamicBackground: string;
  elements: TemplateElement[];
  side: 'front' | 'back';
  templateId: string;
  template?:DualTemplate | null;
  tone: tone;
  selectedImageId: string | null;
  selectedTextId: string | null;
  cardX: number;
  cardY: number;
  position: { x: number; y: number };
  canvasBounds: { x: number; y: number; width: number; height: number };
  scrollPos: {x: number; y: number}
  groupEl:TemplateElement | null;
  isIsolationMode: boolean;
  boundsRect:BoundsRect | null;
  
  setScrollPosition: (pos: {
    x: number;
    y: number;
}) => void
 
  containerRef?: any;
  cardGridGroupRef?:any;
  scrollOffset?:any;
  stageRef: React.RefObject<any>;
  zoom: number;
  mode: CanvasMode;
  brushColor: string;
  bgImage?: HTMLImageElement;
  selectedElement?: boolean;
  editingText?: string;
  transformModeActive?: boolean;
  rows: number;
  cols: number;
  cellSize: number;
  textAlign: 'center' | 'left' | 'right';
  isMultiline: boolean;
  isUnderline: boolean;
  setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>;
  //setElementId: React.Dispatch<React.SetStateAction<string>>;
  setElementId: (id: string) => void
  setActiveTab: (tab: SidebarTab | null) => void
  tab:SidebarTab;
  boundingBox:BoundingBox | undefined;
  boundingStageBox:BoundingBox | undefined;
  cardBounds: Bounds;
  designElements: DesignElement[];
  handlers: {
    setImageRef?: (ref: Konva.Image | null) => void;
    onPaint?: (col: number, row: number) => void;
    onImageUpdate: (e: any, id: string) => void;
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
    _handleTextClick: (textNode: Konva.Text, tabActive:boolean) => void;
    handleElementClick: (e: KonvaEventObject<MouseEvent>, id: string) => void;
    onGroupUpdate: (updated: TemplateElement) => void;
    setSelectedGroupId: (id: string | null) => void;
    setTransformModeActive: (enabled: boolean) => void;
    setIsolationMode: (b: boolean | ((prev: boolean) => boolean)) => void;
    setBoundsRect: (rect: BoundsRect | null)=>void;
    commitGroupUpdate: (updatedGroupElement: TemplateElement) => void;
    setElementsGrouped: (b: boolean) => void;
  
    
    
  };
}

const resolveFontStyle = (
  isBold?: boolean,
  isItalic?: boolean
): 'bold' | 'italic' | 'normal' | 'italic bold' => {
  if (isBold && isItalic) return 'italic bold';
  if (isBold) return 'bold';
  if (isItalic) return 'italic';
  return 'normal';
};

export const CardSideLayer: React.FC<CardSideLayerProps> = ({
  card,
  elements,
  side,
  templateId,
  template,
  tone,
  selectedImageId,
  selectedTextId,
  editingText,
  cardX,
  cardY,
  position,
  canvasBounds,
  containerRef,
  stageRef,
  cardGridGroupRef,
  scrollPos,
  setScrollPosition,
  scrollOffset,
  zoom,
  mode,
  selectedElement,
  brushColor,
  bgImage,
  handlers,
  setTemplate,
  setElementId,
  transformModeActive,
  rows,
  cols,
  cellSize,
  showBackground,
  dynamicBackground,
  designElements,
  textAlign,
  isMultiline,
  isUnderline,
  isPreviewMode,
  setActiveTab,
  isTransitioningTemplate,
  setKonvaText,
  konvaText,
  boundingBox,
  boundingStageBox,
  groupEl,
  isIsolationMode,
  boundsRect,
  cardBounds,
  tab
}) => {


  if (isTransitioningTemplate || !template) return null;


  const SIDEBAR_WIDTH = 60; // or 280 if panel is open
  const TOPBAR_OFFSET = 30; // or 280 if panel is open
  const PANEL_WIDTH = 385;
  const offset = tab? SIDEBAR_WIDTH + PANEL_WIDTH : 0;


  const imageRef = useRef<Konva.Image>(null);
  //const cardBounds = useCardBounds(template, card, zoom, position, offset);

  const setSelectedRef = (ref: Konva.Image | null) => {
    if (handlers.setImageRef) handlers.setImageRef(ref);
  };

  
  //console.log('layer...:',handlers.onGroupUpdate, handlers.setSelectedGroupId, isIsolationMode, 
    //handlers.setIsolationMode, handlers.setBoundsRect, boundsRect)
  




  return (
    <Layer id='card-side-layer'
         
         ref={cardGridGroupRef}
          x={position.x}
          y={position.y}
          scaleX={zoom}
          scaleY={zoom}
          listening={!isPreviewMode}
          >
     


        
          <GridRect
            x={0}
            y={0}
            width={card.width}
            height={card.height}
            cols={cols}
            rows={rows}
            gridColors={card.gridColors ?? []}
            mode={mode}
            brushColor={brushColor}
            onPaint={mode === 'painting' ? handlers.onPaint : undefined}
            showDynamicBackground={showBackground}
            dynamicColor={dynamicBackground}
          />

          {bgImage && (
            <KonvaImage
              image={bgImage}
              x={0}
              y={0}
              width={card.width}
              height={card.height}
            />
          )}

          {elements
            .filter(el => el.type === 'image' || el.type === 'shape')
            .map(el=>{

             // console.log('el individual', el)
              return(
                <ImageElement
            
                key={el.id}
                element={el}
                id={el.id}
                templateId={templateId}
                template={template}
                side={side}
                
                src={'src' in el ? el.src : ''}
                position={{
                  x: el.position.x,
                  y: el.position.y
                }}
                size={el.size}
                zoom={zoom}
                tone={tone}
                isSelected={selectedImageId === el.id}
                showTransformer={transformModeActive}
                containerRef={containerRef}
                stageRef={stageRef}
                canvasBounds={canvasBounds}
                setGhostLines={handlers.setGhostLines}
                onSelect={(e) => {

                  //e.cancelBubble=true;

                  handlers.handleElementClick(e, el.id);

                       

                  if (!e.evt.shiftKey) 
                     handlers.setSelectedImageId(el.id);
                 

                  

                  setElementId(el.id);

                 
                 
                }}
                handleImageUpdate={(e) => handlers.onImageUpdate(e, el.id)}
                setSelectedRef={setSelectedRef}
              />
              )
            })}

          {elements
            .filter(isTextElementForTextComponent)
            .map(el=>{
              //console.log('el individual', el);
              return(

                <TextElement
                setKonvaText={setKonvaText}
                konvaText={konvaText}
                zoom={zoom}
                key={el.id}
                id={el.id}
                 side={side}
                 template={template}
                 selectedTextId={el.id}
                 selectedImageId={null}
                 currentLock={el.lockType??'none'}
                index={Number(el.id)}
                text={el.label}
                position={{
                  x: el.position.x,
                  y: el.position.y
                }}
                textWidth={el.textWidth ?? undefined}
                textHeight={el.textHeight ?? undefined}
                lineHeight={el.lineHeight ?? undefined}
                textAlign={el.textAlign ?? 'left'}
                isMultiline={el.isMultiline || false}
                isUnderline={el.isUnderline || false}
                fontFamily={el.font}
                fontStyle={resolveFontStyle(el.isBold, el.isItalic)}
                fontWeight={el.isBold ? 'bold' : 'normal'}
                size={el.size}
                selected={el.id === selectedTextId}
                color={el.color}
                cardBounds={canvasBounds}
                templateId={templateId}
                setGhostLines={handlers.setGhostLines}
                onUpdate={({ id, text, position }) => {
                  const original = elements.find(el => el.id === id);
                  if (!original || !isTextElementForTextComponent(original)) return;
                  const updated: TemplateElement = {
                    ...original,
                    label: text,
                    text,
                    position: {
                      x: position.x,
                      y: position.y
                    }
                  };
                  handlers.onTextUpdate(updated);
                }}
                onClick={(e) => {
                  //e.cancelBubble=true;

                    const node = e.target;
                    const stage = node.getStage();
                    const pointerPos = stage?.getPointerPosition();

                    
                    if (node && node instanceof Konva.Text && pointerPos) {
                       // 1. Pass the actual node to your overlay logic


                       

                       handlers.handleElementClick(e, el.id);

                       

                       if (!e.evt.shiftKey) {


                        handlers._handleTextClick(node, tab ? true:false);

                       // 2. Sync sidebar state (optional if overlay handles this)
                       handlers.onFontSizeChange(node.fontSize());
                       handlers.setSelectedFont(node.fontFamily());
                       handlers.setSelectedColor(el.color);
                       

                      

                       }

                      // 3. Track selected element
                      setElementId(node.id());
                       
                }}}
                onEdit={(text, pos, align) => {
                  handlers.onTextEdit(text, pos, el);
                  handlers.setSelectedFont(el.font || '--font-inter');
                  handlers.setSelectedColor(el.color || '#000000');
                  handlers.setInputPosition(pos);
                }}
              />

              )
            })
          }


{elements
  .filter(el => el.type === 'group')
  .map(el=>{
   // console.log('el' ,el);
    return(
      <GroupElement
      groupEl={el}
      isSelected={true}
      groupElement={groupEl}
      key={el.id}
      id={el.id}
      position={el.position}
      templateId={templateId}
      template={template}
      side={side}
      zoom={zoom}
      tone={tone}
      selectedImageId={selectedImageId}
      selectedTextId={selectedTextId}
      transformModeActive={transformModeActive}
      containerRef={containerRef}
      stageRef={stageRef}
      cardBounds={canvasBounds}
      handlers={handlers}
      setSelectedRef={setSelectedRef}
      setKonvaText={setKonvaText}
      konvaText={konvaText}
      tab={tab}
      setElementId={setElementId}
      isIsolationMode={isIsolationMode}
      boundsRect={boundsRect}
      
    />
    )
  })
 }

        
      
    </Layer>
  );
};
