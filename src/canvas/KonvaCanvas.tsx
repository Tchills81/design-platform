'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import TextElement from '../components/TextElement';
import ImageElement from '../components/ImageElement';
import TextInputPortal from '../components/TextInputPortal';
import { Template } from '../types/template';
import { DualTemplate } from '../types/template';
import GridBackground from '../components/GridBackground';
import CardGridBackground from '../components/CardGridBackground';
import { computeAverageColor } from '../utils/colorUtils';
import GridRect from '../components/GridRect';

import TextToolbar from '../components/TextToolbar';
import PaintingToolbar from '../components/PaintingToolbar';

import { type TextElement as textElement } from '../types/TextElement';
import { type ImageElement as imageElement } from '../types/ImageElement';
import { type CardState } from '../types/CardState';
import { type HistoryEntry } from '../types/HistoryEntry';
import { type ImageUpdatePayload } from '../types/ImageUpdatePayload';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { serializeCardState } from '../utils/serializeCardState';

import { renderToCanvas } from '../utils/renderToCanvas';





const KonvaCanvas = () => {
  const [template, setTemplate] = useState<Template | null>(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  //const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [inputPosition, setInputPosition] = useState<{ x: number; y: number } | null>(null);

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [selectedFont, setSelectedFont] = useState('--font-inter');
  const selectedElement =
  selectedTextIndex !== null ? template?.elements[selectedTextIndex] : undefined;

  const isBold = selectedElement?.type === 'text' ? selectedElement.isBold ?? false : false;
  const isItalic = selectedElement?.type === 'text' ? selectedElement.isItalic ?? false : false;


  



const resolveFontStyle = (isBold: boolean, isItalic: boolean): 'normal' | 'bold' | 'italic' | 'italic bold' => {
   var style: 'normal' | 'bold' | 'italic' | 'italic bold';

  if (isBold && isItalic) 
      style ='italic bold';
  else if (isBold) style = 'bold';
  else  if (isItalic) style =  'italic';
  else style = 'normal';

  console.log("selected style", style)

  return style;
};





  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  
  const [selectedColor, setSelectedColor] = useState('#ff595e');
  const [selectedFontSize, setSelectedFontSize]=useState(8)
  const [bgImage] = useImage(template?.card?.backgroundImage || '');
  const [dynamicBackground, setDynamicBackground] = useState('#ffffff');
  const [mode, setMode] = useState<'painting' | 'card'>('card');
  const [animatedCells, setAnimatedCells] = useState<Set<string>>(new Set());
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [isPaintingMode, setIsPaintingMode] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);

  
  


  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);


  

  

  const buttonStyle = {
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    fontSize: '0.9rem'
  };
  


  

  const canvasWidth = 1000;
  const canvasHeight = 800;


    
   
  
    
      

  const handleSaveCard = async () => {
    if (!template) return;
  
    const templateId = template.id; // or template.meta.id, depending on your structure
    const cardData = serializeCardState(template, mode, templateId);
  
    const designData = {
      name: 'Red Grid Ceremony', // You can make this dynamic if needed
      author: 'Tobias Chilonga',
      data: cardData
    };
  
    try {
      const response = await fetch('/api/saveDesign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designData)
      });
  
      if (response.ok) {
        console.log('💾 Saved Card to SQLite:', designData);
      } else {
        console.error('❌ Failed to save design:', await response.text());
      }
    } catch (err) {
      console.error('🚨 Error saving design:', err);
    }
  };



  


  //loadLatestDesign();
  
  
  
    
  



  const onFontSizeChange = (newSize: number) => {
    setSelectedFontSize(newSize);
  
    if (selectedTextIndex !== null && template) {
      
      commitHistoryEntry('card', template);

        
      const updatedElements = [...template.elements];
      const el = updatedElements[selectedTextIndex];
  
      if (el.type === 'text') {
        updatedElements[selectedTextIndex] = {
          ...el,
          size: newSize
        };
        setTemplate({ ...template, elements: updatedElements });
      }
    }
  };
  


  
  

  const handleToggleMode = () => {
    setMode((prev) => {
      const nextMode = prev === 'card' ? 'painting' : 'card';
  
      if (nextMode === 'painting') {
        setShowToolbar(false);      // ✅ hide text toolbar
        setInputPosition(null);     // ✅ clear anchor position
      }
  
      return nextMode;
    });
  };
  
  


  const commitHistoryEntry = (mode: 'card' | 'painting', template: Template) => {
    const cardState: CardState = {
      width: template.card.width,
      height: template.card.height,
      background: template.card.background,
      backgroundImage: template.card.backgroundImage,
      gridColors: template.card.gridColors,
      elements: template.elements
    };
  
    setHistory((prev) => [...prev, { mode, cardState }]);
    setFuture([]);
  };



  const exitEditingMode = (e?: React.MouseEvent) => {
    setShowToolbar(false);
    setInputPosition(null); // or however you're managing overlay
    //setSelectedTextIndex(null);    // optional: clear selection
  };
  




  const handleToggleBold = () => {
    if (selectedTextIndex === null || !template) return;
  
    commitHistoryEntry('card', template); // snapshot before mutation
  
    const updatedElements = [...template.elements];
    const el = updatedElements[selectedTextIndex];
  
    if (el.type === 'text') {
      updatedElements[selectedTextIndex] = {
        ...el,
        isBold: !el.isBold
      };
      setTemplate({ ...template, elements: updatedElements });
    }
  };
  


  const handleToggleItalic = () => {
    if (selectedTextIndex === null || !template) return;
  
    commitHistoryEntry('card', template); // snapshot before mutation
  
    const updatedElements = [...template.elements];
    const el = updatedElements[selectedTextIndex];
  
    if (el.type === 'text') {
      updatedElements[selectedTextIndex] = {
        ...el,
        isItalic: !el.isItalic
      };
      setTemplate({ ...template, elements: updatedElements });
    }
  };
  
  
  
  

  const onColorChange = (newColor: string) => {
    setSelectedColor(newColor);
  
    if (selectedTextIndex !== null && template) {
      commitHistoryEntry('card', template);
  
      const updatedElements = [...template.elements];
      const el = updatedElements[selectedTextIndex];
  
      if (el.type === 'text') {
        updatedElements[selectedTextIndex] = {
          ...el,
          color: newColor
        };
        setTemplate({ ...template, elements: updatedElements });
      }
    }
  };
  
  




  const onFontChange = (newFont: string) => {
    setSelectedFont(newFont);
  
    if (selectedTextIndex === null || !template) return;
  
    const updatedElements = [...template.elements];
    const el = updatedElements[selectedTextIndex];
  
    if (el.type !== 'text') return;
  
    // ✅ Commit full template snapshot before mutation
    commitHistoryEntry('card', template);
  
    updatedElements[selectedTextIndex] = {
      ...el,
      font: newFont
    };
  
    setTemplate({
      ...template,
      elements: updatedElements
    });
  };
  

  

  const handleTextClick = (text: string, pos: { x: number; y: number }, index: number) => {
    setEditingText(text);
    setInputPosition(pos);
    setSelectedTextIndex(index); // ← this is key
    console.log("index", index)
    setShowToolbar(true);
  };
  



  
  const handleUndo = () => {
    if (history.length === 0 || !template) return;
  
    const previousEntry = history[history.length - 1];
  
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [
      {
        mode,
        cardState: template.card
          ? {
              ...template.card,
              elements: template.elements
            }
          : previousEntry.cardState
      },
      ...prev
    ]);
  
    setTemplate((prev) => ({
      ...prev!,
      card: {
        width: previousEntry.cardState.width,
        height: previousEntry.cardState.height,
        background: previousEntry.cardState.background,
        backgroundImage: previousEntry.cardState.backgroundImage,
        gridColors: previousEntry.cardState.gridColors
      },
      elements: previousEntry.cardState.elements
    }));
  
    setMode(previousEntry.mode);
    
  };
  
  
  



  const handleRedo = () => {
    if (future.length === 0 || !template) return;
  
    const nextEntry = future[0];
  
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [
      ...prev,
      {
        mode,
        cardState: {
          ...template.card,
          elements: template.elements
        }
      }
    ]);
  
    setTemplate((prev) => ({
      ...prev!,
      card: {
        width: nextEntry.cardState.width,
        height: nextEntry.cardState.height,
        background: nextEntry.cardState.background,
        backgroundImage: nextEntry.cardState.backgroundImage,
        gridColors: nextEntry.cardState.gridColors
      },
      elements: nextEntry.cardState.elements
    }));
  
    setMode(nextEntry.mode);
    
  };



  const handleImageUpdate = (
    e: KonvaEventObject<Event>,
    id: string
  ) => {
    if (!template) return;
  
    commitHistoryEntry('card', template); // ✅ Only here
  
    const node = e.target as Konva.Image;
  
    const updatedElements = template.elements.map((el) =>
      el.id === id && el.type === 'image'
        ? {
            ...el,
            position: {
              x: node.x() - cardX,
              y: node.y() - cardY
            },
            size: {
              width: node.width(),
              height: node.height()
            }
          }
        : el
    );
  
    setTemplate({ ...template, elements: updatedElements });
  };
  
  
  
  

  const handleCellPaint = (col: number, row: number) => {
    const index = row * cols + col;

  if (index < 0 || index >= cols * rows) {
    console.warn(`Index ${index} out of bounds for gridColors with length ${cols * rows}`);
    return;
  }

  if (!template) return;

  // ✅ Commit full card state with mode
  const cardState: CardState = {
    width: template.card.width,
    height: template.card.height,
    background: template.card.background,
    backgroundImage: template.card.backgroundImage,
    gridColors: template.card.gridColors,
    elements: template.elements
  };

  setHistory((prev) => [...prev, { mode: 'painting', cardState }]);
  setFuture([]); // Clear redo stack

  // ✅ Proceed with painting logic
  setTemplate((prev) => {
    if (!prev) return prev;

    const currentColors = prev.card.gridColors ?? Array(cols * rows).fill('#f0f0f0');
    const updatedColors = [...currentColors];
    updatedColors[index] = selectedColor;

    return {
      ...prev,
      card: {
        ...prev.card,
        gridColors: updatedColors
      }
    };
  });



    
    
    


    const key = `${col},${row}`;
          setAnimatedCells((prev) => new Set(prev).add(key));
          setTimeout(() => {
          setAnimatedCells((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
  });
}, 300); // duration of pulse

  };
  
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);




  


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') handleUndo();
      if (e.ctrlKey && e.key === 'y') handleRedo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, future]);
  
 
  

  useEffect(() => {
  const el = document.getElementById('canvas-portal');
  if (el) setPortalTarget(el);
     }, []);


 


     useEffect(() => {
      const loadLatestDesign = async () => {
        const res = await fetch('/api/loadDesigns');
        const designs = await res.json();
        if (designs.length > 0) {
          const latest = designs[0];
          renderToCanvas(JSON.parse(latest.data), setTemplate, setMode);
        }
      };
    
      loadLatestDesign();
    }, []);

  /*useEffect(() => {
    fetch('/templates/classic-business-card.json')
      .then((res) => res.json())
      .then((data: Template) => setTemplate(data));
  }, []);*/

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  

  useEffect(() => {
    const gridColors = template?.card?.gridColors;
    if (!gridColors || gridColors.length === 0) {
        console.log(gridColors, "returning")
        return;
    }
  
    const avg = computeAverageColor(gridColors);
    setDynamicBackground(avg);
  }, [template]);
  

  if (!template || !template.card || !template.elements) {
    return <p>Loading card...</p>;
  }
  
  const { card, elements, tone } = template;
  
  const { gridColors } = card;
  
  

  const cardX = (stageSize.width - card.width) / 2;
  const cardY = (stageSize.height - card.height) / 2;
  const cols = 10;
  const rows = 6;

  const canvasBounds = {
    x: cardX,
    y: cardY,
    width: card.width,
    height: card.height
  };

  

  return (
    <div
      ref={containerRef}
      id="canvas-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
     <div
  style={{
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    display: 'flex',
    gap: '0.5rem'
  }}
>
  <button style={buttonStyle} onClick={handleToggleMode}>Toggle Mode</button>
  <button style={buttonStyle} onClick={handleUndo}>Undo</button>
  <button style={buttonStyle} onClick={handleRedo}>Redo</button>
  <button style={buttonStyle} onClick={handleSaveCard}>Save Design</button>
</div>




      {mode === 'painting' && (
     <PaintingToolbar
    
    brushSize={brushSize}
    
    onSizeChange={setBrushSize}

    brushColor={selectedColor}
    onColorChange={setSelectedColor} 
    />
    )}



      <GridBackground
        width={stageSize.width}
        height={stageSize.height}
        cellSize={20}
        
        style={{
          zIndex: 0,
          opacity: 1
        }}
      />

      <CardGridBackground
        width={card.width}
        height={card.height}
        x={cardX}
        y={cardY}
        cellSize={64}
        stroke={tone === 'dark' ? '#444' : '#f0f0f0'}
        cols={cols}
        rows={rows}
        getCellColor={(col, row) => {
        const index = row * cols + col;
        
          
          return gridColors?.[index] || '#f0f0f0';
        }}

        previewColor={selectedColor}
        onAverageColorChange={(color) => setDynamicBackground(color)}
        onCellPaint={handleCellPaint}
        style={{
          zIndex: mode === 'painting' ? 2 : 0,
          opacity: mode === 'painting' ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: 'auto',
          cursor: 'crosshair',

        }}
      />

<div style={{
  position: 'absolute',
  top: 20,
  right: 20,
  zIndex: 10,
  background: '#fff',
  padding: 8,
  borderRadius: 8,
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
}}>
 

</div>



      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        style={{
          width: '100vw',
          height: '100vh',
          zIndex: mode === 'card' ? 2 : 0,
          opacity: mode === 'card' ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onClick={(e) => {
          const clickedNode = e.target;
          const isImage = clickedNode.getClassName?.() === 'Image';
          const isTransformer = clickedNode.getClassName?.() === 'Transformer';
          const isStage = clickedNode === e.target.getStage();
        
          // 🛡️ Prevent dismissal if clicking inside toolbar
          const toolbarEl = document.getElementById('text-toolbar');
          const clickTarget = e.evt?.target as HTMLElement;
          if (toolbarEl && toolbarEl.contains(clickTarget)) {
            return;
          }
        
          if (!isImage && !isTransformer) {
            setSelectedImageId(null);
          }
        
          if (isStage || isImage) {
            setSelectedTextIndex(null);
            setShowToolbar(false); // ← Dismiss toolbar
            setInputPosition(null); // ← Clear position
          }
        }}
        
        
      >
        <Layer>
          {bgImage && (
            <KonvaImage
              image={bgImage}
              x={cardX}
              y={cardY}
              width={card.width}
              height={card.height}
            />
          )}

<GridRect
  x={cardX}
  y={cardY}
  width={card.width}
  height={card.height}
  cols={cols}
  rows={rows}
  gridColors={template.card.gridColors ?? []}
  mode={mode}
  brushColor={brushColor}
  onPaint={mode === 'painting' ? handleCellPaint : undefined}
/>


          {elements
            .filter((el) => el.type === 'image')
            .map((el) => (
              <ImageElement
                key={el.id}
                id={el.id}
                templateId="classic-business-card"
                src={el.src}
                position={{
                  x: cardX + el.position.x,
                  y: cardY + el.position.y
                }}
                size={el.size}
                tone={tone}
                isSelected={selectedImageId === el.id}
                containerRef={containerRef}
                stageRef={stageRef}
                canvasBounds={canvasBounds}
                onSelect={() => setSelectedImageId(el.id)}
                handleImageUpdate={handleImageUpdate}
                
              />
            ))}

{elements
  .filter((el) => el.type === 'text')
  .map((el, index) => (
    <TextElement
      key={el.id}
      index={index}
      el={el}
      id={el.id}
      templateId="classic-business-card"
      text={el.label}
      position={{
        x: cardX + el.position.x,
        y: cardY + el.position.y
      }}
      fontFamily={selectedFont}
      fontStyle={resolveFontStyle(isBold, isItalic)} 
      fontWeight={isBold ? 'bold' : 'normal'}
      size={el.size}
      color={el.color}
      cardBounds={{
        x: cardX,
        y: cardY,
        width: card.width,
        height: card.height
      }}
      onUpdate={(updated) => {

        if (!template) return;
        
        commitHistoryEntry('card', template); // ✅ snapshot before mutation

        const updatedElements = template.elements.map((el) =>
          el.id === updated.id && el.type === 'text'
            ? {
                ...el,
                label: updated.text,
                position: {
              x: updated.position.x - cardX,
              y: updated.position.y - cardY
            }
              }
            : el
        );


        
        const currentEl = updatedElements[index];
        if (currentEl.type === 'text') {
          updatedElements[index] = {
            ...currentEl,
            label: updated.text,
            position: {
              x: updated.position.x - cardX,
              y: updated.position.y - cardY
            }
          };
          setTemplate({ ...template, elements: updatedElements });
        }
      }}
      onClick={(e) => {
        const stage = e.target.getStage();
        const pointerPos = stage?.getPointerPosition();
       

        if (pointerPos) {
          handleTextClick(el.label, pointerPos, index); // 🎯 External click logic
        }
      }}
      onEdit={(text, pos) => {

        if (!template || selectedTextIndex === null) return;


        // ✅ Step 1: Commit current state to history
          commitHistoryEntry('card', template);

          // ✅ Step 2: Clone and update the element
        const updatedElements = [...template.elements];

        const updatedEl = {
          ...el,
          isBold: el.isBold ?? false,
          isItalic: el.isItalic ?? false
        };


        updatedElements[selectedTextIndex] = updatedEl;
        // ✅ Step 3: Update the template
        setTemplate({
          ...template,
          elements: updatedElements});


        setSelectedFont(el.font || '--font-inter');
        setSelectedColor(el.color || '#000000');
        
        console.log("el.isBold", el.isBold, "el.isItalic", el.isItalic)
        setInputPosition(pos);
        setShowToolbar(true);
      }}
      
    />
  ))}

        </Layer>




      </Stage>




  {showToolbar && inputPosition && mode === 'card' && (
  <TextToolbar
    selectedFont={selectedFont}
    onFontChange={onFontChange}
    selectedColor={selectedColor}
    onColorChange={onColorChange}
    onFontSizeChange={onFontSizeChange}
    selectedFontSize={selectedFontSize}
    isBold={isBold}
    isItalic={isItalic}
    onToggleBold={handleToggleBold}
    onToggleItalic={handleToggleItalic}
    position={inputPosition}
    canvasWidth={canvasWidth}
    canvasHeight={canvasHeight}
    exitEditingMode={exitEditingMode}
  />
)}



        {selectedTextIndex !== null && (() => {
        const el = template.elements[selectedTextIndex];
        if (el.type !== 'text') return null;

        return (
            <TextInputPortal
              value={editingText}
              position={inputPosition}
              font={el.font}
              size={el.size}
              color={el.color}
              isBold={isBold}
              isItalic={isItalic}
              onChange={(val) => setEditingText(val)}
              onBlur={(e) => {
                const toolbarEl = document.getElementById('text-toolbar');
                const relatedTarget = e.relatedTarget as HTMLElement;
              
                if (toolbarEl && relatedTarget && toolbarEl.contains(relatedTarget)) {
                  // User is clicking into the toolbar—don’t reset
                  return;
                }
              
                const updatedElements = [...template.elements];
                updatedElements[selectedTextIndex] = {
                  ...el,
                  label: editingText
                };
                setTemplate({ ...template, elements: updatedElements });
                //setSelectedTextIndex(null); // ← Only reset if truly leaving context
                console.log("setSelectedTextIndex(true);")
              }}
            />
          );
        })()}




      </div>
    );
  };
  
  export default KonvaCanvas;
  