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
  template?:DualTemplate;
  tone: tone;
  selectedImageId: string | null;
  selectedTextId: string | null;
  cardX: number;
  cardY: number;
  position: { x: number; y: number };
  canvasBounds: { x: number; y: number; width: number; height: number };
  scrollPos: {x: number; y: number}

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
  
  designElements: DesignElement[];
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
    _handleTextClick: (textNode: Konva.Text, tabActive:boolean) => void;
    
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
  tab
}) => {


  if (isTransitioningTemplate) return null;


  const imageRef = useRef<Konva.Image>(null);
  const cardBounds = {
    x: 0,
    y: 0,
    width: template? template.width * zoom :card.width,
    height: template? template.height * zoom :card.height
  };

  const setSelectedRef = (ref: Konva.Image | null) => {
    if (handlers.setImageRef) handlers.setImageRef(ref);
  };





  return (
    <Layer
         
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
            .map(el => (
              <ImageElement
                key={el.id}
                element={el}
                id={el.id}
                templateId={templateId}
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
                canvasBounds={cardBounds}
                setGhostLines={handlers.setGhostLines}
                onSelect={() => {

                  console.log('el', el);
                  handlers.setSelectedImageId(el.id);
                  setElementId(el.id);
                }}
                handleImageUpdate={(e) => handlers.onImageUpdate(e, el.id)}
                setSelectedRef={setSelectedRef}
              />
            ))}

          {elements
            .filter(isTextElementForTextComponent)
            .map(el => (
              <TextElement
                setKonvaText={setKonvaText}
                konvaText={konvaText}
                zoom={zoom}
                key={el.id}
                id={el.id}
                locked={el.locked ?? false}
                index={Number(el.id)}
                el={el}
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
                cardBounds={cardBounds}
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
                

                    const node = e.target;
                    const stage = node.getStage();
                    const pointerPos = stage?.getPointerPosition();

                    
                    if (node && node instanceof Konva.Text && pointerPos) {
                       // 1. Pass the actual node to your overlay logic


                       console.log('tab..briri', tab, 'setActiveTab'); 

                       
                       handlers._handleTextClick(node, tab ? true:false);

                       // 2. Sync sidebar state (optional if overlay handles this)
                       handlers.onFontSizeChange(node.fontSize());
                       handlers.setSelectedFont(node.fontFamily());
                       handlers.setSelectedColor(el.color);

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
            ))}
        
      
    </Layer>
  );
};
