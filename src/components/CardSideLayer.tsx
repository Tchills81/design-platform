import { Layer } from 'react-konva';
import KonvaImage from './KonvaImage';
import GridRect from './GridRect';
import ImageElement from './ImageElement';
import TextElement from './TextElement';
import { TemplateElement, DualTemplate, isTextElement } from '../types/template';
import { CanvasMode } from '../types/CanvasMode';
import { useRef, Fragment } from 'react';
import Konva from 'konva';

interface CardSideLayerProps {
  card: {
    width: number;
    height: number;
    background: string;
    backgroundImage?: string;
    gridColors?: string[];
    
  };

  elements: TemplateElement[];
  side: 'front' | 'back';
  templateId: string;
  tone: string;
  selectedImageId: string | null;
  selectedTextId: string | null; // ✅ migrated
  cardX: number;
  cardY: number;
  position: { x: number; y: number };
  canvasBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  containerRef?: any;
  stageRef: React.RefObject<any>;
  zoom: number;
  mode: CanvasMode;
  brushColor: string;
  bgImage?: HTMLImageElement;
  selectedElement?:boolean;
  editingText?:string
  transformModeActive?:boolean
  rows:number;
  cols:number;
  cellSize:number;

  setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>;
  handlers: {
    setImageRef?: (ref: Konva.Image | null) => void;
    onPaint?: (col: number, row: number) => void;
    onImageUpdate: (e: any, id: string) => void;
    onTextClick: (label: string, pos: { x: number; y: number }, id: string) => void; // ✅ updated
    onTextEdit: (text: string, pos: { x: number; y: number }, el: TemplateElement) => void;
    onTextUpdate: (updated: TemplateElement) => void;
    setGhostLines: (lines: { x?: number; y?: number }) => void;
    setSelectedFont: (font: string) => void;
    setSelectedColor: (color: string) => void;
    setInputPosition: (pos: { x: number; y: number }) => void;
    setShowToolbar: (show: boolean) => void;
    setSelectedImageId: (id: string) => void;
    onFontSizeChange: (size: number) => void;
    

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
  tone,
  selectedImageId,
  selectedTextId, // ✅ migrated
  editingText,
  cardX,
  cardY,
  position,
  canvasBounds,
  containerRef,
  stageRef,
  zoom,
  mode,
  selectedElement,
  brushColor,
  bgImage,
  handlers,
  setTemplate,
  transformModeActive,
  rows,
  cols,
  cellSize

}) => {

  const imageRef = useRef<Konva.Image>(null);
  const cardBounds = {
    x: cardX,
    y: cardY,
    width: card.width,
    height: card.height
  };

  const setSelectedRef =(ref: Konva.Image | null)=>
  {
      console.log("setSelectedRef in CardSideLayer", ref)
    if (handlers.setImageRef)
      handlers.setImageRef(ref)
  }

  return (
    <Layer x={position.x} y={position.y} scaleX={zoom} scaleY={zoom}>
      {/* 1. Grid Background */}
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
      />

      {/* 2. Background Image */}
      {bgImage && (
        <KonvaImage
          image={bgImage}
          x={cardX}
          y={cardY}
          width={card.width}
          height={card.height}
        />
      )}

      {/* 3. Image Elements */}
      {elements
        .filter(el => el.type === 'image')
        .map(el => (
          <ImageElement
            key={el.id}
            id={el.id}
            templateId={templateId}
            src={el.src}
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
            onSelect={() => handlers.setSelectedImageId(el.id)}
            handleImageUpdate={(e) => handlers.onImageUpdate(e, el.id)}

            setSelectedRef={setSelectedRef}
          />
        ))}

      {/* 4. Text Elements */}
      {(() => {
        const seenIds = new Set<string>();

        return elements
          .filter(el => el.type === 'text')
          .map((el) => {
            console.log(`Rendering TextElement: id=${el.id}, label=${el.label}`);

            if (seenIds.has(el.id)) {
              console.warn(`⚠️ Duplicate ID detected: ${el.id}`);
            }
            seenIds.add(el.id);

            return (
              <Fragment key={`debug-${el.id}`}>
                <TextElement
                  key={el.id}
                  index={0} // index no longer used for selection
                  el={el}
                  id={el.id}
                  templateId={templateId}
                  text={el.label}
                  position={{
                    x: cardX + el.position.x,
                    y: cardY + el.position.y
                  }}
                  fontFamily={el.font}
                  fontStyle={resolveFontStyle(el.isBold, el.isItalic)}
                  fontWeight={el.isBold ? 'bold' : 'normal'}
                  size={el.size}
                  selected={el.id === selectedTextId}
                  color={el.color}
                  cardBounds={cardBounds}
                  setGhostLines={handlers.setGhostLines}
                  onUpdate={({ id, text, position }) => {
                    console.log("onUpdate triggered for id:", id);
                    const original = elements.find(el => el.id === id);
                    if (!original || !isTextElement(original)) return;

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
                    console.log("Text clicked:", el.id);
                    const stage = e.target.getStage();
                    const pointerPos = stage?.getPointerPosition();
                    if (pointerPos) {
                      handlers.onFontSizeChange(el.size);
                      handlers.setSelectedFont(el.font);
                      handlers.setSelectedColor(el.color);
                      handlers.onTextClick(el.label, pointerPos, el.id); // ✅ migrated
                    }
                  }}
                  onEdit={(text, pos) => {
                    console.log("onEdit triggered for:", el.id);
                    handlers.onTextEdit(text, pos, el);
                    handlers.setSelectedFont(el.font || '--font-inter');
                    handlers.setSelectedColor(el.color || '#000000');
                    handlers.setInputPosition(pos);
                  }}
                />
              </Fragment>
            );
          });
      })()}
    </Layer>
  );
};
