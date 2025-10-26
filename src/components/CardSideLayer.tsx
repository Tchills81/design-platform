import { Layer, Group } from 'react-konva';
import KonvaImage from './KonvaImage';
import GridRect from './GridRect';
import ImageElement from './ImageElement';
import TextElement from './TextElement';
import { TemplateElement, DualTemplate, isTextElementForTextComponent } from '../types/template';
import { CanvasMode } from '../types/CanvasMode';
import { useRef } from 'react';
import Konva from 'konva';
import { DesignElement } from '../types/DesignElement';
import { tone } from '../types/tone';
import { Rect } from 'react-konva';

interface CardSideLayerProps {
  card: {
    width: number;
    height: number;
    background: string;
    backgroundImage?: string;
    gridColors?: string[];
  };
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
  setScrollPosition: React.Dispatch<React.SetStateAction<{x: number, y: number}>>;
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
  setElementId: React.Dispatch<React.SetStateAction<string>>;
  
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
}) => {
  const imageRef = useRef<Konva.Image>(null);
  const cardBounds = {
    x: cardX,
    y: cardY,
    width: card.width,
    height: card.height
  };

  const setSelectedRef = (ref: Konva.Image | null) => {
    if (handlers.setImageRef) handlers.setImageRef(ref);
  };

  // Layout offsets
  const SIDEBAR_WIDTH = 280;
  const RULER_THICKNESS = 24;
  const TOP_BAR_HEIGHT = 64;
  const FOOTER_HEIGHT = 48;
  const RIGHT_MARGIN = 280;
  const EXTRA_MARGIN = 120;      // bottom footer

  

  const maskX = 0;
  const maskY = 0;
  
  const maskWidth = window.innerWidth
  const maskHeight = window.innerHeight;

  const availableWidth = window.innerWidth - SIDEBAR_WIDTH - RULER_THICKNESS - RIGHT_MARGIN;
  const availableHeight = window.innerHeight - TOP_BAR_HEIGHT - RULER_THICKNESS - FOOTER_HEIGHT;


  const cardWidth = template?.[side]?.card?.width ?? 0;
  const cardHeight = template?.[side]?.card?.height ?? 0;

  const zoomX = availableWidth / cardWidth;
  const zoomY = availableHeight / cardHeight;

  const initialZoom = Math.min(zoomX, zoomY);


  const offsetX = (availableWidth - cardWidth * initialZoom) / 2 + SIDEBAR_WIDTH + RULER_THICKNESS;
  const offsetY = (availableHeight - cardHeight * initialZoom) / 2 + TOP_BAR_HEIGHT + RULER_THICKNESS;
  
  
  //console.log('scrollPosition', scrollPos, 'position', position)


  return (
    <Layer>
     


        {/* Inner group: scaled canvas */}
        <Group
          ref={cardGridGroupRef}
          x={position.x}
          y={position.y}
          scaleX={zoom}
          scaleY={zoom}
          /*draggable
          onDragMove={(e) => {
            const { x, y } = e.target.position();
            //setScrollPosition({ x, y });
          }}
       // Optionally clamp or store position*/
      
        >
          <GridRect
            x={cardX}
            y={cardY}
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
              x={cardX}
              y={cardY}
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
                  x: cardX + el.position.x,
                  y: cardY + el.position.y
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
                zoom={zoom}
                key={el.id}
                id={el.id}
                index={Number(el.id)}
                el={el}
                text={el.label}
                position={{
                  x: cardX + el.position.x,
                  y: cardY + el.position.y
                }}
                textAlign={textAlign}
                isMultiline={isMultiline}
                isUnderline={isUnderline}
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
                      x: position.x - cardX,
                      y: position.y - cardY
                    }
                  };
                  handlers.onTextUpdate(updated);
                }}
                onClick={(e) => {
                  const stage = e.target.getStage();
                  const pointerPos = stage?.getPointerPosition();
                  if (pointerPos) {
                    handlers.onFontSizeChange(el.size);
                    handlers.setSelectedFont(el.font);
                    handlers.setSelectedColor(el.color);
                    handlers.onTextClick(el.label, pointerPos, el.id);
                    setElementId(el.id);
                  }
                }}
                onEdit={(text, pos, align) => {
                  handlers.onTextEdit(text, pos, el);
                  handlers.setSelectedFont(el.font || '--font-inter');
                  handlers.setSelectedColor(el.color || '#000000');
                  handlers.setInputPosition(pos);
                }}
              />
            ))}
        </Group>
      
    </Layer>
  );
};
