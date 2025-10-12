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

import { Line } from 'react-konva';
import { Text } from 'react-konva';
import { tone } from '@/src/types/tone';

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
    
     // ✅ now correctly sourced from actions
  } = actions;
  

  //const face = template[side];
  //const card = face?.card;

  return (
    <div className="canvas-stage bg-neutral-100"
    style={{
      width: '100vw',
      height: '100vh',
      zIndex: mode === 'card'  ? 2 : 0,
      opacity: mode === 'card' ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
     
    }}>
      <Stage 
           
                  ref={stageRef}
                  onWheel={handleWheel}
                  width={stageSize.width}
                  height={stageSize.height}

                  style={{
                    width: '100%', // Use % or let it inherit from parent
                    height: '100%',
                    zIndex: mode === 'card' ? 2 : 0,
                    opacity: mode === 'card' ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                  
                  onClick={(e) => {
                      const toolbarEl = document.getElementById('text-toolbar');
                      const { clientX, clientY } = e.evt;
                      const domTarget = document.elementFromPoint(clientX, clientY);
                      const clickedInsideToolbar = toolbarEl?.contains(domTarget);
                    
                      console.log("clickedInsideToolbar: stage Event", clickedInsideToolbar);
                    
                      if (clickedInsideToolbar) return; // ✅ Exit early
                    
                      const clickedNode = e.target;
                      

                      const isImage =clickedNode.getClassName?.() === 'Image' ;
                      const isShape = clickedNode.name?.() == 'Shape';

                      const isTransformer = clickedNode.getClassName?.() === 'Transformer';
                      const isStage = clickedNode === e.target.getStage();
      
                     
                    
                      if ((!isImage && !isShape)  && !isTransformer) {
                          setSelectedImageId(null);
                          resetTransformMode(); // ← graceful exit from resize mode
                          setModeActive(false);
                          
                        }

                     



                     


                      
                    
                      if ((isStage || isImage || isShape) && selectedTextId) {
                        if (!template || !template[side] || !template[side].elements) return;
                    
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
                    
                      if (isStage || isImage || isShape) {
                        setSelectedTextId(null);
                        setShowToolbar(true);
                        setInputPosition(null);
                      }
                    }}
                    
                  >
      
      
                    
     
      {template && template[side] && (
        
       

        <CardSideLayer
          card={template[side].card}
          elements={template[side].elements}
          designElements={designElements}
          side={side}
          editingText={editingText}
          templateId={template.id}
          tone={template.tone as tone}
          selectedImageId={selectedImageId}
          selectedTextId={selectedTextId} // ✅ migrated
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
          bgImage={side === 'front' ? frontImage : backImage}
          showBackground={showBackground}
          dynamicBackground={dynamicBackground}
          textAlign={textAlign}
          isMultiline={isMultiline}
          isUnderline={isUnderline}
          setTemplate={setTemplate}
          handlers={{
            
            setImageRef:updateImageRef,
            onPaint: handleCellPaint,
            onImageUpdate: handleImageUpdate,
            onTextClick: handleTextClick,
            onTextEdit: handleTextEdit,
            onTextUpdate: handleTextUpdate,
            onPrimitiveSelect:onPrimitiveSelect,
            setGhostLines,
            setSelectedFont,
            setSelectedColor,
            setInputPosition,
            setShowToolbar,
            setSelectedImageId,
            onFontSizeChange,
            
          }}
        />

      
        
       
        
      )}


       <Layer>
        {showRulers && (
          <RulerLayer
            width={stageSize.width}
            height={stageSize.height}
            tone={template.tone}
            zoom={zoom}
          />
        )}
      </Layer>
      
      
      
      
      <Layer>
      
      <PrintGuidesOverlay
        cardX={cardX}
        cardY={cardY}
        cardWidth={card?.width}
        cardHeight={card?.height}
        bleed={36}
        safeZone={24}
        visible={showBleeds}
      />
      
      </Layer>
      
      
      <Layer>
        {ghostLines.x !== undefined && (
          <Line
            points={[ghostLines.x, 0, ghostLines.x, canvasHeight]}
        stroke="#aaa"
        dash={[4, 4]}
        strokeWidth={1}
        listening={false}
        opacity={ghostOpacity}
          />
        )}
        {ghostLines.y !== undefined && (
          <Line
            points={[0, ghostLines.y, canvasWidth, ghostLines.y]}
            stroke="#aaa"
            dash={[4, 4]}
            strokeWidth={1}
            
          />
      
          
        )}
      
      
      {ghostLines.y !== undefined && (
          <Text x={(ghostLines.x ?? 0) + 4}
          y={12}
          text={`x = ${ghostLines.x}`}
          fontSize={10}
          fill={template.tone}
          opacity={ghostOpacity}
          
          />
      )}
      
      
      {ghostLines.y !== undefined && (
          <Text y={(ghostLines.y ?? 0) -4}
          x={12}
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
    </div>
  );
}
