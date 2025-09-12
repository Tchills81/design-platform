/**
 *  Render a Konva Rect with drag and transform capabilities

   Accept initial crop region and update callbacks

   Optionally lock aspect ratio

   Be fully reusable across canvas sides
 */


   import React, { useRef, useEffect } from 'react';
   import { Rect, Transformer } from 'react-konva';
   import Konva from 'konva';
   
   
   type CropBoxProps = {
     cropRegion: { x: number; y: number; width: number; height: number };
     onUpdate: (region: { x: number; y: number; width: number; height: number }) => void;
     isLocked?: boolean;
   };
   
   export const CropBoxOverlay: React.FC<CropBoxProps> = ({ cropRegion, onUpdate, isLocked }) => {
     const rectRef = useRef<Konva.Rect>(null);
     const transformerRef = useRef<Konva.Transformer>(null);
   
     useEffect(() => {
       if (transformerRef.current && rectRef.current) {
         transformerRef.current.nodes([rectRef.current]);
         transformerRef.current.getLayer()?.batchDraw();
       }
     }, []);

     console.log("cropRegion", cropRegion)
   
     const handleTransformEnd = () => {
       const node = rectRef.current;
       if (!node) return;
   
       const scaleX = node.scaleX();
       const scaleY = node.scaleY();
   
       const newWidth = node.width() * scaleX;
       const newHeight = node.height() * scaleY;
   
       node.scaleX(1);
       node.scaleY(1);

       console.log("onUpdate", "x", node.x(), "y", node.y(), "width", newWidth, "height", newHeight);
   
       onUpdate({
         x: node.x(),
         y: node.y(),
         width: newWidth,
         height: newHeight,
       });
     };
   
     const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
       onUpdate({
         ...cropRegion,
         x: e.target.x(),
         y: e.target.y(),
       });
     };
   
     return (
       <>
         <Rect
           ref={rectRef}
           x={cropRegion.x}
           y={cropRegion.y}
           width={cropRegion.width}
           height={cropRegion.height}
           stroke="#8B5CF6"
           strokeWidth={2}
           dash={[6, 4]}
           draggable
           onDragEnd={handleDragEnd}
           onTransformEnd={handleTransformEnd}
         />
         <Transformer
           ref={transformerRef}
           boundBoxFunc={(oldBox, newBox) => {
             if (isLocked) {
               const aspect = oldBox.width / oldBox.height;
               return {
                 ...newBox,
                 height: newBox.width / aspect,
               };
             }
             return newBox;
           }}
           rotateEnabled={false}
           anchorSize={8}
         />
       </>
     );
   };
   