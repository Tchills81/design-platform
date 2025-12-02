import React, { useRef, useEffect, useState } from 'react';
import { Group, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { TemplateElement, isTextElementForTextComponent } from '@/src/types/template';
import ImageElement from '../ImageElement';
import TextElement from '../TextElement';
import { tone } from '@/src/types/tone';
import { getZoomAwareDragBoundFunc } from '@/src/utils/getZoomAwareDragBoundFunc';
import { LockType } from '@/src/types/access';
import { bakeGroupTransform } from '@/src/utils/bakeGroupTransform';
import { BoundsRect } from '@/src/canvas/store/useContextStore';
import { IsolationRect } from '../IsolationRect';


type GroupElement = Extract<TemplateElement, { type: 'group' }>;

interface GroupElementProps {
  groupElement: TemplateElement | null;
  templateId: string;
  template: any;
  side: 'front' | 'back';
  zoom: number;
  tone: string;
  selectedImageId: string | null;
  selectedTextId: string | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<any>;
  cardBounds: { width: number; height: number; x: number; y: number };
  groupEl:TemplateElement;
  
  boundsRect:BoundsRect | null;
  handlers: any;
  setSelectedRef?: (ref: any) => void;
  setKonvaText?: any;
  konvaText?: any;
  tab?: any;
  setElementId: (id: string) => void;
  transformModeActive?: boolean;
  isSelected: boolean;
  isIsolationMode:boolean;
  id:string;
  position: {
    x: number;
    y: number;
}
}

const GroupElement: React.FC<GroupElementProps> = ({
  groupElement,
  templateId,
  template,
  side,
  zoom,
  tone,
  selectedImageId,
  selectedTextId,
  transformModeActive,
  containerRef,
  stageRef,
  cardBounds,
  handlers,
  setSelectedRef,
  setKonvaText,
  konvaText,
  tab,
  setElementId,
  isSelected,
  isIsolationMode,
  boundsRect,
  groupEl,
  id
}) => {

    console.log('groupEl...', groupEl)

    if (!groupEl || groupEl.type !== 'group') return null;


  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [isSet, setIsSet]= useState<boolean>(false)


//console.log('proceeding to render groupElement', groupElement);

  const { position, size, children, locked, lockType, rotation } = groupEl;
  

 //console.log('incoming group element', groupEl);
 //console.log('updated template', template)
 
  
  
  //console.log('groupBounds', groupBounds, 'groupRef.x', groupRef.current?.x(), 'position.x', position.x)
  
  

  // ✅ Attach transformer when selected
  useEffect(() => {
  
   
    if (isSelected && transformModeActive && transformerRef.current && groupRef.current) {
        
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, transformModeActive]);

  // ✅ Drag bound function
  const dragBoundFunc = getZoomAwareDragBoundFunc(cardBounds, size, zoom);

  // ✅ Selection
  const handleOnSelect = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (locked || isIsolationMode){
        console.log('isIsolationMode', isIsolationMode, 'returning early')
        return;

    } 

    if (e.evt.detail === 2) {
        // Double click → enter isolation
        handlers.setIsolationMode(true);
        
        console.log('entering child isolation mode')
      } else {
        // Single click → select group

        console.log('single selection cancelBubble=true')
       
        handlers.setTransformModeActive(true)


        handlers.setSelectedGroupId(groupEl.id);
        
        e.cancelBubble = true;
       
      }

     

     
    
    
  };


  const exitIsolation = () => {
    handlers.setIsolationMode(false);
    handlers.setSelectedGroupId(null);
  };

  // ✅ Drag end
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (locked || lockType === 'position' || isIsolationMode) return;
    const node = e.target;
  
    const updatedGroup: TemplateElement = {
      ...groupEl,
      position: { x: node.x(), y: node.y() },
    };
  
    // Notify listeners (e.g. UI updates)
    handlers.onGroupUpdate(updatedGroup);
  
    // Commit to template + history
    handlers.commitGroupPositionUpdate(updatedGroup);
  };
  

  // ✅ Transform end
  const handleTransformEnd = () => {
    const group = groupRef.current;
    if (!group) return;
  
    const sx = group.scaleX();
    const sy = group.scaleY();
  
    const absBefore = group.getAbsoluteTransform();
    const topLeftStage = absBefore.point({ x: 0, y: 0 });
  
    const newSize = {
      width: (size.width ?? 0) * sx,
      height: (size.height ?? 0) * sy,
    };
  
    //bakeGroupTransform(group, { bakeRotation: false });
  
    const parent = group.getParent() as Konva.Node;
    const parentInvAbs = parent.getAbsoluteTransform().copy().invert();
    const newLocalPos = parentInvAbs.point(topLeftStage);
    group.position(newLocalPos);
  
    // ✅ Update children by merging baked metrics
// ✅ Update children by merging baked metrics
const updatedChildren = children.map(el => {
    const node = group.findOne(`#${el.id}`);
    if (!node) return el;
  
    const sx = group.scaleX();
    const sy = group.scaleY();


  
    if (el.type === 'text' && node instanceof Konva.Text) {
      // Apply group scale to text metrics before reading them
     
      const baseFontSize = node.getAttr('fontSize') ?? node.fontSize();
      const baseLineHeight = node.getAttr('lineHeight') ?? node.lineHeight();
      const baseLetterSpacing = node.getAttr('letterSpacing') ?? node.letterSpacing();
      const baseWidth = node.getAttr('width') ?? node.width();
  
      const newFontSize = Math.round(baseFontSize * sy);
      const newLineHeight = Math.round(baseLineHeight ? baseLineHeight * sy : baseLineHeight);
      const newLetterSpacing =Math.round( baseLetterSpacing ? baseLetterSpacing * sx : baseLetterSpacing);
      const newWidth = baseWidth * sx;
  
      return {
        ...el,
        position: { x: node.x() * sx, y: node.y() * sy },
        size:newFontSize,
        lineHeight: newLineHeight,
        letterSpacing: newLetterSpacing,
        label: node.text(),
        text: node.text(),
      };
    }
  
    if (el.type === 'image' && node instanceof Konva.Image) {
      const baseWidth = node.getAttr('width') ?? node.width();
      const baseHeight = node.getAttr('height') ?? node.height();
  
      return {
        ...el,
        position: { x: node.x() * sx, y: node.y() * sy },
        size: { width: baseWidth * sx, height: baseHeight * sy },
      };
    }
  
    if (el.type === 'shape' && node instanceof Konva.Shape) {
      const baseWidth = node.getAttr('width') ?? (node as any).width?.() ?? el.size?.width ?? 0;
      const baseHeight = node.getAttr('height') ?? (node as any).height?.() ?? el.size?.height ?? 0;
  
      return {
        ...el,
        position: { x: node.x() * sx, y: node.y() * sy },
        size: { width: baseWidth * sx, height: baseHeight * sy },
      };
    }
  
    if (el.type === 'group') {
      return el;
    }
  
    return el;
  });


  console.log('updatedChildren', updatedChildren);
  
      
  
    const updatedGroupElement= {
      ...groupEl,
      type: 'group',
      position: { x: newLocalPos.x, y: newLocalPos.y },
      size: newSize,
      rotation: group.rotation(),
      children: updatedChildren,
    };
  
    handlers.commitGroupUpdate(updatedGroupElement as GroupElement);
  
    transformerRef.current?.nodes([group]);
    transformerRef.current?.getLayer()?.batchDraw();
  };
  
  
  if (!children || !size) {
    console.log('Group cannot render: no children or size');
    return null;
  }



  const absTransform = groupRef.current?.getAbsoluteTransform();



  


  
  

  // Convert a local point (e.g. group’s top‑left corner) into stage space
  const topLeftStage = absTransform?.point({ x: 0, y: 0 });
  const bottomRightStage = absTransform?.point({
    x: size.width,
    y: size.height
  });
  
  const groupStageBounds:BoundsRect = {
    x: topLeftStage?.x ?? 0,
    y: topLeftStage?.y ?? 0,
    width: (bottomRightStage?.x ?? 0) - (topLeftStage?.x ?? 0),
    height: (bottomRightStage?.y ?? 0) - (topLeftStage?.y ?? 0),
  };




  const rectRef = useRef<Konva.Rect>(null);

  useEffect(() => {
    if (!rectRef.current) return;

    if (isIsolationMode) {
      rectRef.current.moveToTop();
      rectRef.current.listening(true);
      rectRef.current.visible(true);
    } else {
      rectRef.current.moveToBottom();
      rectRef.current.listening(false);
      rectRef.current.visible(false);
    }

    rectRef.current.getLayer()?.batchDraw();
  }, [isIsolationMode]);

 
  

  return (
    <>

      <Group
        ref={groupRef}
        id={groupEl.id ?? id}
        draggable={!locked && lockType !== 'position' && !isIsolationMode}
        x={position.x}
        y={position.y}
        rotation={rotation ?? 0}
        dragBoundFunc={dragBoundFunc}
        onClick={ !isIsolationMode?handleOnSelect:undefined }
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >


   <IsolationRect
 
 width={size.width}
 height={size.height}
 isIsolationMode={isIsolationMode}
 strokeColor="blue"
 dashPattern={[6, 4]}
 animationSpeed={1}
/>
        {children.map((el) => {
          if (!el) return null;

          if (el.type === 'image' || el.type === 'shape') {
            return (
              <ImageElement
                key={el.id}
                element={el}
                id={el.id}
                templateId={templateId}
                template={template}
                side={side}
                src={'src' in el ? el.src : ''}
                position={el.position}
                size={el.size}
                zoom={zoom}
                tone={tone as tone}
                isSelected={selectedImageId === el.id}
                showTransformer={transformModeActive}
                isIsolationMode={isIsolationMode}
                grouped={true}
                containerRef={containerRef}
                stageRef={stageRef}
                canvasBounds={groupStageBounds}
                setGhostLines={handlers.setGhostLines}
                onSelect={(e) => {
                  // e.cancelBubble=true;

                  // console.log('onSelect', handlers.setSelectedImageId, el.id);


                  

                  handlers.setSelectedTextId(null);
                  handlers.setSelectedGroupId(null)

                  handlers.setSelectedImageId(el.id);

                  console.log('onSelect being  called ', el.id)
                  setElementId(el.id);

                }}
                handleImageUpdate={(e) => handlers.onImageUpdate(e, el.id)}
                setSelectedRef={setSelectedRef}
              />
            );
          }

          if (isTextElementForTextComponent(el)) {
            return (
              <TextElement
                key={el.id}
                id={el.id}
                grouped={true}
                isIsolationMode={isIsolationMode}
                zoom={zoom}
                side={side}
                template={template}
                selectedTextId={el.id}
                selectedImageId={null}
                currentLock={el.lockType ?? 'none'}
                index={Number(el.id)}
                text={el.label}
                position={el.position}
                textWidth={el.textWidth}
                textHeight={el.textHeight}
                lineHeight={el.lineHeight}
                textAlign={el.textAlign ?? 'left'}
                isMultiline={el.isMultiline || false}
                isUnderline={el.isUnderline || false}
                fontFamily={el.font}
                fontStyle={el.isItalic ? 'italic' : 'normal'}
                fontWeight={el.isBold ? 'bold' : 'normal'}
                size={el.size}
                selected={el.id === selectedTextId}
                color={el.color}
                cardBounds={groupStageBounds}
                templateId={templateId}
                setGhostLines={handlers.setGhostLines}
                setKonvaText={setKonvaText}
                konvaText={konvaText}

                onUpdate={({ id, text, position }) => {
                    const original = children.find(el => el.id === id);

                    console.log('groupElement original', original)
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
                    handlers._handleTextClick(node, !!tab);
                    handlers.onFontSizeChange(node.fontSize());
                    handlers.setSelectedFont(node.fontFamily());
                    handlers.setSelectedColor(el.color);
                    handlers.setSelectedImageId(null);
                    handlers.setSelectedGroupId(null)
                    handlers.setSelectedTextId(node.id());
                    setElementId(node.id());

                  }
                }}
                onEdit={(text, pos, align) => {
                  handlers.onTextEdit(text, pos, el);
                  handlers.setSelectedFont(el.font || '--font-inter');
                  handlers.setSelectedColor(el.color || '#000000');
                  handlers.setInputPosition(pos);
                }}
              />
            );
          }

          return null;
        })}



      </Group>

      {isSelected && transformModeActive && !isIsolationMode && <Transformer ref={transformerRef} />}
    </>
  );
};

export default GroupElement;
