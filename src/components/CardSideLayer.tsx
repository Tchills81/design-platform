import { Layer } from 'react-konva';
import KonvaImage from './KonvaImage';
import GridRect from './GridRect';
import ImageElement from './ImageElement';
import TextElement from './TextElement';
import BackgroundLayer from './BackgroundLayer';
import { TemplateElement, DualTemplate, isLegacyTextElement, 
  isPrimitiveShapeElement, isTextElementForTextComponent, isPrimitiveImageElement
       } from '../types/template';



import { CanvasMode } from '../types/CanvasMode';
import { useRef, Fragment } from 'react';
import Konva from 'konva';
import { template } from 'lodash';
import { DesignElement } from '../types/DesignElement';
import { tone } from '../types/tone';

interface CardSideLayerProps {
  card: {
    width: number;
    height: number;
    background: string;
    backgroundImage?: string;
    gridColors?: string[];
    
  };

  showBackground:boolean;
  dynamicBackground:string;
  elements: TemplateElement[];
  side: 'front' | 'back';
  templateId: string;
  tone: tone;
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
  textAlign:"center" | "left" | "right";
  isMultiline:boolean;
  isUnderline:boolean;

  setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>;
  setElementId:React.Dispatch<React.SetStateAction<string>>
  designElements:DesignElement[];
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
    onPrimitiveSelect:()=>void;
    

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

  const setSelectedRef =(ref: Konva.Image | null)=>
  {
      console.log("setSelectedRef in CardSideLayer", ref)
    if (handlers.setImageRef)
      handlers.setImageRef(ref)
  }

  return (
  <Layer x={position.x} y={position.y} scaleX={zoom} scaleY={zoom}>
    {/* 0. Background Layers */}
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

    {/* 1. Background Image */}
    {bgImage && (
      <KonvaImage
        image={bgImage}
        x={cardX}
        y={cardY}
        width={card.width}
        height={card.height}
      />
    )}

  

   
    {/* 5. Legacy Image + Shape Elements */}
{elements
  .filter(
    (el): el is TemplateElement & { type: 'image' | 'shape' } =>
      el.type === 'image' || el.type === 'shape'
  )
  .map(el => (
    <ImageElement
      key={el.id}
      element={el}
      id={el.id}
      templateId={templateId}
      src={'src' in el ? el.src : ''} // fallback for shapes
      position={{
        x: cardX + el.position.x,
        y: cardY + el.position.y
      }}
      size={el.size}
      zoom={zoom}
      tone={tone as tone}
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


   {/* 6. Legacy and Styled Text Elements */}
{elements
  .filter(isTextElementForTextComponent)
  .map(el => (
    <TextElement
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

  </Layer>
);

};
