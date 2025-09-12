import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import TextElement from '../components/TextElement';
import ImageElement from '../components/ImageElement';
import TextInputPortal from '../components/TextInputPortal';
import GridBackground from '../components/GridBackground';
import CardGridBackground from '../components/CardGridBackground';
import GridRect from '../components/GridRect';
import TextToolbar from '../components/TextToolbar';
import PaintingToolbar from '../components/PaintingToolbar';
import { computeAverageColor } from '../utils/colorUtils';
import { renderToCanvas } from '../utils/renderToCanvas';

import { serializeDualTemplate } from '../utils/serializeDualTemplate';
import { type DualTemplate } from '../types/template';

import { normalizeDualTemplate } from '../utils/normalizeDualTemplate';


import { type CardState } from '../types/CardState';
import { type HistoryEntry } from '../types/HistoryEntry';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';


import TabNavigator from './TabNavigator';
import RulerLayer from './RulerLayer';

import { Line, Text } from 'react-konva';


import { IconButton } from './IconButton';
import { ToneButton } from './ToneButton';

import {
    RotateCcw,
    ZoomOut,
    ZoomIn,
    Save,
    Undo,
    Redo,
    ToggleLeft,
    ArrowLeft,
    Brush,
    CreditCard,
    RotateCw,
    XIcon,
    Type
  } from 'lucide-react';


  import { ToggleCheckbox } from './ToggleCheckbox';

  import { captureCardFaceSnapshot } from '../utils/captureCardFaceSnapshot';
  import { SnapshotGallery } from './SnapshotGallery';
  import { PrintGuidesOverlay } from './PrintGuidesOverlay';
  import { type SnapshotEntry } from '../types/SnapshotEntry';
  import { loadTemplateFromSnapshot } from '../utils/loadTemplateFromSnapshot';
  import ToneButtonGroup from './ToneButtonGroup';
  import { AddBackgroundButton } from './AddBackground';
  import { CardSideLayer } from './CardSideLayer';
  import { TemplateElement } from '../types/template';
  
  import { isTextElement } from '../types/template';

  import { v4 as uuid } from 'uuid';
  import { ToneButtonSection } from './ToneButtonSection';
  

  
  






const KonvaCanvas = () => {
  const [template, setTemplate] = useState<DualTemplate | null>(null);
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [inputPosition, setInputPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [selectedFont, setSelectedFont] = useState('--font-inter');
  const [selectedColor, setSelectedColor] = useState('#ff595e');
  const [selectedFontSize, setSelectedFontSize] = useState(8);
  const [mode, setMode] = useState<'painting' | 'card' | 'preview'>('card');

  const [animatedCells, setAnimatedCells] = useState<Set<string>>(new Set());
  const [showToolbar, setShowToolbar] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);
  const [dynamicBackground, setDynamicBackground] = useState('#ffffff');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [pendingStyle, setPendingStyle] = useState<{ isBold?: boolean; isItalic?: boolean }>({});
  const [incomingTemplate, setIncomingTemplate] = useState<DualTemplate | null>(null);
  const [zoom, setZoom] = useState(1);
  
  const [showRulers, setShowRulers] = useState(true);
  const [ghostLines, setGhostLines] = useState<{ x?: number; y?: number }>({});
  const [ghostOpacity, setGhostOpacity] = useState(0);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showGallery, setShowGallery] = useState(false);
  const [showGuides, setShowGuides] = useState(true); // default to visible
  const [prepareForPrint, setPrepareForPrint] = useState(false);
  const [snapshotArchive, setSnapshotArchive] = useState<SnapshotEntry[]>([]);

  const [lastSavedTemplate, setLastSavedTemplate] = useState<DualTemplate | null>(null);

  const [showBleeds, setShowBleeds] = useState(true)
  const [transformModeActive, setTransformModeActive]=useState(false)
  const [bleedToggleDisabled, setBleedToggleDisabled] = useState(false);
  





  
  const [snapshots, setSnapshots] = useState<{
    front: string | null;
    back: string | null;
  }>({ front: null, back: null });
  



  


  
  

 





  





  
  

  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeFace = template?.[side];
  const card = activeFace?.card;



  console.log("activeFace", activeFace, "card", card)

  const elements = activeFace?.elements ?? [];
  const tone = template?.tone ?? 'light';

  const selectedElement = selectedTextIndex !== null ? elements[selectedTextIndex] : undefined;
  const isBold = selectedElement?.type === 'text' ? selectedElement.isBold ?? false : false;
  const isItalic = selectedElement?.type === 'text' ? selectedElement.isItalic ?? false : false;

  const [bgImage] = useImage(card?.backgroundImage || '');

  
  const [frontImage] = useImage(template?.front?.card.backgroundImage || '');
  const [backImage] = useImage(template?.back?.card.backgroundImage || '');


  const cols = 10;
  const rows = 6;
  const gridColors = card?.gridColors ?? [];
  const cardX = (stageSize.width - (card?.width ?? 0)) / 2;
  const cardY = (stageSize.height - (card?.height ?? 0)) / 2;


  const canvasWidth = stageSize.width;
  const canvasHeight = stageSize.height;




  const canvasBounds = {
    x: cardX,
    y: cardY,
    width: card?.width ?? 0,
    height: card?.height ?? 0
  };




  const createTextId = (side: 'front' | 'back', elements: TemplateElement[]) => {
    const count = elements.filter(el => el.type === 'text').length;
    return `${side}-text-${count + 1}`;
  };
  



  const handleAddText = () => {
    if (!template || ! template[side]) return;

    const newId = createTextId(side, template[side].elements);
    console.log("newId", newId)

  
    const newTextElement: TemplateElement = {
      type: 'text',
      id: newId,
      label: 'New Text',
      text: 'New Text',
      font: '--font-inter',
      size: 16,
      color: '#000000',
      position: { x: 100, y: 100 },
      isBold: false,
      isItalic: false,
      tone: template.tone,
    };


    
  
    setTemplate((prev) => {
      if (!prev || !prev[side]) return null;
      return {
        ...prev,
        [side]: {
          ...prev[side],
          elements: [...prev[side].elements, newTextElement],
        },
      };
    });

    if(!template[side]) return

    console.log("index of text ", template[side].elements.length)
    setSelectedTextIndex(template[side].elements.length); // auto-select
    //setShowToolbar(true);
  };
  



const handleTextUpdate=(updated:TemplateElement)=>{
    
    if (!template || !isTextElement(updated)) return;
          commitHistoryEntry();
          const updatedElements = elements.map((el) =>
            el.id === updated.id && el.type === 'text'
              ? {
                  ...el,
                  label: updated.text,
                  position: {
                    x: updated.position.x ,
                    y: updated.position.y ,
                  },
                }
              : el
          );
          setTemplate(prev => ({
            ...prev!,
            [side]: {
              ...prev![side],
              elements: updatedElements,
            },
          }));
}


  const handleTextEdit = (
    text: string,
    pos: { x: number; y: number },
    el: TemplateElement
  ) => {
    if (!template || selectedTextIndex === null || !isTextElement(el) || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = [...template[side].elements];
    const updatedTextElement: TemplateElement = {
      ...el,
      label: text,
      text,
      position: {
        x: pos.x - cardX,
        y: pos.y - cardY,
      },
      isBold: el.isBold ?? false,
      isItalic: el.isItalic ?? false,
    };
  
    updatedElements[selectedTextIndex] = updatedTextElement;
  
    setTemplate((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [side]: {
          ...prev[side],
          elements: updatedElements,
        },
      };
    });
  
    setSelectedFont(el.font || '--font-inter');
    setSelectedColor(el.color || '#000000');
    setInputPosition(pos);
    //setShowToolbar(true);
  };



  


  const handleOnUploadBackground = (src: string) => {
    setTemplate((prev) => {
      if (!prev || !prev[side]) return prev;
  
      return {
        ...prev,
        [side]: {
          ...prev[side],
          card: {
            ...prev[side].card,
            backgroundImage: src,
          },
          elements: [...(prev[side].elements ?? [])],
        },
      };
    });
         
    
  };
  
  

  
  


  const captureBothSides = async () => {
    if (!stageRef.current) return;
  
    // Capture front
    setSide('front');
    await new Promise(resolve => setTimeout(resolve, 100));
    const front = captureCardFaceSnapshot({
      stageRef,
      bounds: canvasBounds,
      pixelRatio: 2
    });
  
    // Capture back
    setSide('back');
    await new Promise(resolve => setTimeout(resolve, 100));
    const back = captureCardFaceSnapshot({
      stageRef,
      bounds: canvasBounds,
      pixelRatio: 2
    });
  
    // Restore view
    setSide('front');
  
    // Store only current pair
    setSnapshots({ front, back });

    //console.log("front", front)
    //console.log("back", back)

    setShowGallery(true)
  };
  
  



  



  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    
    
    e.evt.preventDefault();
  
    const scaleBy = 1.05;
    const stage = stageRef.current;
    if (!stage) return;
  
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
  
    const oldZoom = zoom;
    const direction = e.evt.deltaY < 0 ? 1 : -1;
    const newZoom = direction > 0 ? oldZoom * scaleBy : oldZoom / scaleBy;
  
    const clampedZoom = Math.max(1, newZoom); // Prevent zooming out below 1

    if (clampedZoom <= 1) {
        setShowBleeds(true);
        setBleedToggleDisabled(false);
      } else {
        setShowBleeds(false);
        setBleedToggleDisabled(true);
      }
    const newPosition = {
      x: pointer.x - ((pointer.x - position.x) / oldZoom) * clampedZoom,
      y: pointer.y - ((pointer.y - position.y) / oldZoom) * clampedZoom
    };
  
    setZoom(clampedZoom);
    setPosition(newPosition);
  };
  
  



  const handleZoom = (scaleBy: number) => {
    
    const oldZoom = zoom;
    const newZoom = Math.max(1, oldZoom * scaleBy); // Prevent zooming out below 1

    if (newZoom <= 1) {
        setShowBleeds(true);
        setBleedToggleDisabled(false);
      } else {
        setShowBleeds(false);
        setBleedToggleDisabled(true);
      }

    const center = {
      x: stageSize.width / 2,
      y: stageSize.height / 2
    };
  
    const newPosition = {
      x: center.x - ((center.x - position.x) / oldZoom) * newZoom,
      y: center.y - ((center.y - position.y) / oldZoom) * newZoom
    };
  
    setZoom(newZoom);
    setPosition(newPosition);
  };
  






  const resolveFontStyle = (isBold: boolean, isItalic: boolean): 'normal' | 'bold' | 'italic' | 'italic bold' => {
    if (isBold && isItalic) return 'italic bold';
    if (isBold) return 'bold';
    if (isItalic) return 'italic';
    return 'normal';
  };

  const handleToggleMode = () => {
    setMode(prev => {
      const next = prev === 'card' ? 'painting' : 'card';
      if (next === 'painting') {
        setShowToolbar(false);
        setInputPosition(null);
      }
      return next;
    });
  };

  const handleFlipSide = () => {
    setSide(prev => (prev === 'front' ? 'back' : 'front'));
    setSelectedTextIndex(null);
    setSelectedImageId(null);
    setShowToolbar(false);
    setInputPosition(null);
  };

  const commitHistoryEntry = () => {
    if (!card || !elements) return;
    const cardState: CardState = {
      width: card.width,
      height: card.height,
      background: card.background,
      backgroundImage: card.backgroundImage,
      gridColors: card.gridColors,
      elements
    };
    setHistory(prev => [...prev, { mode, cardState }]);
    setFuture([]);
  };

  const handleUndo = () => {
    if (history.length === 0 || !template) return;
  
    const previous = history[history.length - 1];
  
    setHistory(prev => prev.slice(0, -1));
  
    setFuture(prev => [
      {
        mode,
        cardState: {
          width: card?.width ?? previous.cardState.width,
          height: card?.height ?? previous.cardState.height,
          background: card?.background ?? previous.cardState.background,
          backgroundImage: card?.backgroundImage ?? previous.cardState.backgroundImage,
          gridColors: card?.gridColors ?? previous.cardState.gridColors,
          elements: elements
        }
      },
      ...prev
    ]);
  
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        card: { ...previous.cardState },
        elements: previous.cardState.elements
      }
    }));
  
    setMode(previous.mode);
  };
  

  const handleRedo = () => {
    if (future.length === 0 || !template) return;
  
    const nextEntry = future[0];
  
    setFuture(prev => prev.slice(1));
  
    setHistory(prev => [
      ...prev,
      {
        mode,
        cardState: {
          width: card?.width ?? nextEntry.cardState.width,
          height: card?.height ?? nextEntry.cardState.height,
          background: card?.background ?? nextEntry.cardState.background,
          backgroundImage: card?.backgroundImage ?? nextEntry.cardState.backgroundImage,
          gridColors: card?.gridColors ?? nextEntry.cardState.gridColors,
          elements: elements
        }
      }
    ]);
  
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        card: { ...nextEntry.cardState },
        elements: nextEntry.cardState.elements
      }
    }));
  
    setMode(nextEntry.mode);
  };
  

  const handleSaveCard = async () => {
    if (!template || !template.front || !template.front.card) {
      console.warn('🛑 Cannot save: missing front face or template.');
      return;
    }
  
    // 🧵 Final patch: commit toolbar state to selected element
    let patchedTemplate: DualTemplate = template;
  
    if (selectedTextIndex !== null && template?.[side]?.elements) {
      const updatedElements = [...template[side].elements];
      const el = updatedElements[selectedTextIndex];

      console.log("el", el)
  
      if (el?.type === 'text') {
        updatedElements[selectedTextIndex] = {
          ...el,
          font: el.font,
          size: el.size,
          isBold,
          isItalic
        };
  
        patchedTemplate = {
          ...template,
          [side]: {
            ...template[side],
            elements: updatedElements
          }
        };
      }
    }

    console.log("patchedTemplate", patchedTemplate)
  
    // 🧭 Proceed with serialization
    const serialized = serializeDualTemplate(patchedTemplate, mode);

    console.log("serialized", serialized)
  
    const designData = {
      name: `Ceremony - ${template.id}`,
      author: 'Tobias Chilonga',
      savedAt: new Date().toISOString(),
      thumbnailUrl:"/assets/logo.png",
      userId:"chilongatobias@gmail.com",
      data: serialized
    };
  
    try {
      const res = await fetch('/api/saveDesign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(designData)
      });
  
      if (res.ok) {
        console.log('💾 Saved DualTemplate:', designData);
      } else {
        console.error('❌ Save failed:', await res.text());
      }
    } catch (err) {
      console.error('🚨 Save error:', err);
    }
  };
  



  const onFontChange = (newFont: string) => {
    setSelectedFont(newFont);
  
    if (selectedTextIndex === null || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = [...template[side].elements];
    const el = updatedElements[selectedTextIndex];
  
    if (el.type === 'text') {
      updatedElements[selectedTextIndex] = {
        ...el,
        font: newFont
      };
  
      setTemplate(prev => ({
        ...prev!,
        [side]: {
          ...prev![side],
          elements: updatedElements
        }
      }));
    }
  };
  

  const onColorChange = (newColor: string) => {
    setSelectedColor(newColor);

    
  
    if (selectedTextIndex === null || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = [...template[side].elements];
    const el = updatedElements[selectedTextIndex];
  
    if (el.type === 'text') {
      updatedElements[selectedTextIndex] = {
        ...el,
        color: newColor
      };
  
      setTemplate(prev => ({
        ...prev!,
        [side]: {
          ...prev![side],
          elements: updatedElements
        }
      }));
    }
  };
  


  const handleToggleBold = () => {
    setPendingStyle(prev => ({ ...prev, isBold: !prev.isBold }));

    if (selectedTextIndex === null || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = [...template[side].elements];
    const el = updatedElements[selectedTextIndex];
  
    if (el.type === 'text') {
      updatedElements[selectedTextIndex] = {
        ...el,
        isBold: !el.isBold
      };
  
      setTemplate(prev => ({
        ...prev!,
        [side]: {
          ...prev![side],
          elements: updatedElements
        }
      }));
    }
  };
  

  const handleToggleItalic = () => {
    setPendingStyle(prev => ({ ...prev, isBold: !prev.isBold }));

    if (selectedTextIndex === null || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = [...template[side].elements];
    const el = updatedElements[selectedTextIndex];
  
    if (el.type === 'text') {
      updatedElements[selectedTextIndex] = {
        ...el,
        isItalic: !el.isItalic
      };
  
      setTemplate(prev => ({
        ...prev!,
        [side]: {
          ...prev![side],
          elements: updatedElements
        }
      }));
    }
  };
  

  const handleTextClick = (
    text: string,
    pos: { x: number; y: number },
    index: number
  ) => {
    setEditingText(text);
    setInputPosition(pos);
    setSelectedTextIndex(index);
    //setShowToolbar(true);
    console.log("elements ", elements.length)
  
    console.log(`🖋️ Text selected at index ${index} with label "${text}"`);
  };
  


  const handleImageUpdate = (
    e: KonvaEventObject<Event>,
    id: string
  ) => {
    if (!template || !template[side]) return;
  
    commitHistoryEntry();
  
    const node = e.target as Konva.Image;
  
    const updatedElements = template[side].elements.map((el) =>
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
  
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements
      }
    }));
  };
  


  const onFontSizeChange = (newSize: number) => {
    setSelectedFontSize(newSize);
  
    if (selectedTextIndex === null || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = [...template[side].elements];
    const el = updatedElements[selectedTextIndex];
  
    if (el.type === 'text') {
      updatedElements[selectedTextIndex] = {
        ...el,
        size: newSize
      };
  
      setTemplate(prev => ({
        ...prev!,
        [side]: {
          ...prev![side],
          elements: updatedElements
        }
      }));
    }
  };
  
  

  const handleCellPaint = (col: number, row: number) => {
    const index = row * cols + col;
    if (!template || !card || index < 0 || index >= cols * rows) return;
  
    commitHistoryEntry();
  
    setTemplate(prev => {
      if (!prev || !prev[side]) return prev;
  
      const currentColors = prev[side].card.gridColors ?? Array(cols * rows).fill('#f0f0f0');
      const updatedColors = [...currentColors];
      updatedColors[index] = selectedColor;
  
      return {
        ...prev,
        [side]: {
          ...prev[side],
          card: {
            ...prev[side].card,
            gridColors: updatedColors
          }
        }
      };
    });
  
    const key = `${col},${row}`;
    setAnimatedCells(prev => new Set(prev).add(key));
    setTimeout(() => {
      setAnimatedCells(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 300);
  };


  const buttonStyle = {
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    fontSize: '0.9rem'
  };



 
  const showDesignView = () => {
    console.log("showDesignView", lastSavedTemplate)
    handleTemplateSelect(lastSavedTemplate ?? undefined);
    setShowGallery(false)
  };
  
  
  const handleTemplateSelect = (tpl?: DualTemplate) => {
    if (!tpl) {
      console.warn('⚠️ No template provided to handleTemplateSelect');
      return;
    }
  
    try {
      const normalized = normalizeDualTemplate(tpl);
      console.log('🧩 handleTemplateSelect → normalized template:', normalized);
  
      setTemplate(normalized);
      setSide('front');
      setSelectedTextIndex(null);
      setSelectedImageId(null);
      setShowToolbar(false);
      setInputPosition(null);
      setHistory([]);
      setFuture([]);
  
      renderToCanvas(normalized, setTemplate, setMode); // ✅ Immediate canvas draw
    } catch (err) {
      console.error('🛑 Failed to parse and render template:', err);
    }
  };
  



const handleSaveToArchive = () => {
    if (!snapshots.front || !snapshots.back || !template) return;
      
        const timestamp = new Date().toISOString();
      
        const entryFront: SnapshotEntry = {
          image: snapshots.front,
          side: 'front',
          timestamp,
          templateId: template.id,
          tone: template.tone
        };
      
        const entryBack: SnapshotEntry = {
          image: snapshots.back,
          side: 'back',
          timestamp,
          templateId: template.id,
          tone: template.tone
        };
      
        setSnapshotArchive(prev => [...prev, entryFront, entryBack]);
      
        // Optional: show confirmation or pulse animation
        console.log('Design saved to archive ✨'); // if using a toast system

        setLastSavedTemplate(template);

        setTemplate(null)

      };
      


    const handleRestore = (entry: SnapshotEntry) => {
        setSide(entry.side);
        setTemplate(loadTemplateFromSnapshot(entry)); // your logic here
        setPrepareForPrint(false);
      };
      
  



  useEffect(() => {
    if (prepareForPrint) {
      setShowGuides(true);
      setMode('preview'); // disable editing
    }
  }, [prepareForPrint]);
  
  


  
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
    if (ghostLines.x || ghostLines.y) {
      setGhostOpacity(0.6);
    } else {
      setGhostOpacity(0);
    }
  }, [ghostLines]);
  



  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const toolbarEl = document.getElementById('text-toolbar');
      const clickedInsideToolbar = toolbarEl?.contains(e.target as Node);

      console.log("handleGlobalClick called", clickedInsideToolbar)
  
      if (clickedInsideToolbar) {
        setShowToolbar(true)
        return; // ✅ Forgive toolbar interactions
      }
  
      // Otherwise, deselect
      //setSelectedTextIndex(null);
      //setShowToolbar(false);
      //setEditingText('');
      //setInputPosition(null);
    };
  
    document.addEventListener('mousedown', handleGlobalClick);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, []);
  


  
 
  
  

  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  
  

  useEffect(() => {
    const el = document.getElementById('canvas-portal');
    if (el) setPortalTarget(el);
  }, []);




  useEffect(() => {
    if (template) {

     console.log('🔍 template.back:', template.back);

      //renderToCanvas(template, setTemplate, setMode, side);
    }
  }, [side]);

  /*useEffect(() => {
    const loadLatestDesign = async () => {
      try {
        const res = await fetch('/api/loadDualTemplates');
        const designs = await res.json();
  
        console.log('📦 Loaded designs:', designs);
  
        if (designs.length === 0) {
          console.warn('🛑 No designs found in dual_templates');
          return;
        }
  
        let raw = JSON.parse(designs[0].data);
        raw = normalizeDualTemplate(raw);

        console.log('🎨 Final patched template:', raw);
       console.log('🔍 raw.back.card:', raw.back.card);

  
        // Patch front face
        if (!raw.front || !raw.front.card) {
          console.warn('⚠️ Missing front face or card, patching with defaults');
          raw.front = {
            card: {
              width: 600,
              height: 400,
              background: '#ffffff',
              gridColors: Array(60).fill('#f0f0f0')
            },
            elements: []
          };
        } else if (!raw.front.card.gridColors) {
          raw.front.card.gridColors = Array(60).fill('#f0f0f0');
        }
  
        // Patch back face
        if (!raw.back || !raw.back.card) {
          console.warn('⚠️ Missing back face or card, patching with defaults');
          raw.back = {
            card: {
              width: 600,
              height: 400,
              background: '#fafafa',
              gridColors: Array(60).fill('#f5f5f5')
            },
            elements: []
          };
        } else if (!raw.back.card.gridColors) {
          raw.back.card.gridColors = Array(60).fill('#f5f5f5');
        }
  
        console.log('🎨 Final patched template:', raw);
        
        setTemplate(raw)
        renderToCanvas(raw, setTemplate, setMode);

        
        
      } catch (err) {
        console.error('🚨 Failed to load dual template:', err);
      }
    };
  
    loadLatestDesign();
  }, []);
  */


  useEffect(() => {
    const face = template?.[side];
    const gridColors = face?.card?.gridColors;

    console.log(template, face, side)
  
    if (!gridColors || gridColors.length === 0) {
      console.log('🛑 No gridColors found for', side, gridColors);
      return;
    }
  
    const avg = computeAverageColor(gridColors);
    setDynamicBackground(avg);
  }, [template, side]);




  if (!template) {
    return (
        <>
      <div className="fade-in">
        <TabNavigator
          userId="chilongatobias@gmail.com"
          onSelect={handleTemplateSelect}
          snapshotArchive={snapshotArchive}
          setSnapshotArchive={setSnapshotArchive}
        />
       
      </div>

      </>
    );
  }else{ console.log("template is set rendering continuing")}

  
  
  
  
  

  


  



  
  const exitEditingMode = () => {
    setSelectedTextIndex(null);
    setShowToolbar(false)
    setEditingText('');
    // Optionally reset font, size, etc. if needed
    console.log('🚪 Exited editing mode');
  };
  

   const handleTextBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const toolbarEl = document.getElementById('text-toolbar');
    const relatedTarget = e.relatedTarget as HTMLElement;
  
    if (toolbarEl && relatedTarget && toolbarEl.contains(relatedTarget)) {
      return; // Don't commit if blur was caused by toolbar interaction
    }
  
    if (selectedTextIndex !== null && template?.[side]?.elements) {
      const updatedElements = [...template[side].elements];
      const el = updatedElements[selectedTextIndex];
  
      if (el?.type === 'text') {
        updatedElements[selectedTextIndex] = {
          ...el,
          label: editingText
        };
  
        setTemplate(prev => ({
          ...prev!,
          [side]: {
            ...prev![side],
            elements: updatedElements
          }
        }));
  
        console.log('📝 Text committed:', editingText);
      }
    }
  
    exitEditingMode?.(); // Gracefully exit after commit
  };
  
  
 
  
  if (!template || !card || !elements) {
    return <p>Loading card...</p>;
  }


  
  
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

<ToneButtonGroup tone={template.tone as "primary" | "accent" | "ceremonial" | "neutral" }>
  <ToneButtonSection label="Navigation & Mode" initiallyOpen={true}>
    {/* Back, Mode Toggle, Flip */}
    <ToneButton fontSize="text-sm" icon={<ArrowLeft size={18} />} label="Back" tone={template.tone} 
    isActive={false} onClick={() => setTemplate(null)} 
     />
    <ToneButton fontSize="text-sm" icon={mode === 'card' ? <Brush size={18} /> : <CreditCard size={18} />} 
    label={`${mode === 'card' ? 'Painting' : 'Card'} Mode`} tone={template.tone} 
    isActive={false} onClick={() => setMode((prev) => (prev === 'card' ? 'painting' : 'card'))} 
    />

   <ToneButton fontSize="text-sm" icon={side === 'front' ? <RotateCcw size={18} /> : <RotateCw size={18} />} 
    label={`Flip to ${side === 'front' ? 'Back' : 'Front'}`} tone={template.tone} 
   isActive={false} onClick={handleFlipSide} 
   />

  </ToneButtonSection>

  <ToneButtonSection label="Actions">
    {/* Undo, Redo, Save, Snapshot, Print */}

   <ToneButton fontSize="text-sm" icon={<Undo size={18} />} label="Undo" tone={template.tone} isActive={false} onClick={handleUndo} />
   <ToneButton fontSize="text-sm" icon={<Redo size={18} />} label="Redo" tone={template.tone} isActive={false} onClick={handleRedo} />
   <ToneButton fontSize="text-sm" icon={<Save size={18} />} label="Save" tone={template.tone} isActive={false} onClick={handleSaveCard} />
    <ToneButton fontSize="text-sm" icon={<Save size={18} />} label="Snapshot" tone={template.tone} isActive={false} onClick={captureBothSides} />

   <ToneButton fontSize="text-sm" icon={<Save size={18} />} label="Print" tone={template.tone} isActive={false} onClick={() => setPrepareForPrint(true)} />
 
  </ToneButtonSection>

  <ToneButtonSection label="Canvas Tools" initiallyOpen={true}>
    {/* AddBackgroundButton, Zoom, Rulers, Bleeds */}

    <ToneButton
      fontSize="text-sm"
      icon={<Type size={18} />}
      label="Add Text"
      tone={template.tone}
      isActive={false}
      onClick={handleAddText}
    />
     <AddBackgroundButton
  tone={template.tone}
  onUpload={handleOnUploadBackground}
/>

    <ToneButton
      fontSize="text-sm"
      icon={<Type size={18} />}
      label="Resize Image"
      tone={template.tone}
      isActive={false}
      onClick={() => setTransformModeActive(true)}
    />

    <IconButton icon={<ZoomIn size={20} />} tone={template.tone} onClick={() => handleZoom(1.1)} />
    <IconButton icon={<ZoomOut size={20} />} tone={template.tone} onClick={() => handleZoom(0.9)} />
    <ToggleCheckbox label="Show Rulers" checked={showRulers} onToggle={() => setShowRulers((prev) => !prev)} tone={template.tone} />
    <ToggleCheckbox label="Show Bleeds" checked={showBleeds} onToggle={() => setShowBleeds((prev) => !prev)} tone={template.tone} disabled={bleedToggleDisabled} />


    
  </ToneButtonSection>

  
</ToneButtonGroup>

  

  
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
        style={{ zIndex: 0, opacity: 1 }}
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
        side={side}
        getCellColor={(col, row) => {
          const index = row * cols + col;
          return gridColors?.[index] || '#f0f0f0';
        }}
        previewColor={selectedColor}
        onAverageColorChange={setDynamicBackground}
        onCellPaint={handleCellPaint}
        style={{
          zIndex: mode === 'painting' ? 2 : 0,
          opacity: mode === 'painting' ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: 'auto',
          cursor: 'crosshair'
        }}
      />
  
      <Stage
        ref={stageRef}
        onWheel={handleWheel}
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

            console.log("clickedInsideToolbar,,,,,")
            const clickedNode = e.target;
            const isImage = clickedNode.getClassName?.() === 'Image';
            const isTransformer = clickedNode.getClassName?.() === 'Transformer';
            const isStage = clickedNode === e.target.getStage();
        
            const toolbarEl = document.getElementById('text-toolbar');
            const { clientX, clientY } = e.evt;

           const domTarget = document.elementFromPoint(clientX, clientY);
           const clickedInsideToolbar = toolbarEl?.contains(domTarget);

          

           if (clickedInsideToolbar) return; // ✅ Forgive toolbar clicks

        
            if (!isImage && !isTransformer) setSelectedImageId(null);
        
            // ✅ Commit pending styles before deselecting
            if ((isStage || isImage) && selectedTextIndex !== null) {
                if (!template || !template[side] || !template[side].elements) return;
              const updatedElements = [...template[side].elements];
              const el = updatedElements[selectedTextIndex];
        
              if (el.type === 'text') {
                updatedElements[selectedTextIndex] = {
                  ...el,
                  ...pendingStyle // Apply bold/italic if present
                };
        
                setTemplate(prev => ({
                  ...prev!,
                  [side]: {
                    ...prev![side],
                    elements: updatedElements
                  }
                }));
              }
        
              setPendingStyle({});
            }
        
            if (isStage || isImage) {
              setSelectedTextIndex(null);
              setShowToolbar(false);
              setInputPosition(null);
            }
          }}
      >




<Layer>
{showRulers && (
  <RulerLayer width={stageSize.width}
  height={stageSize.height}
  tone={template.tone}
  zoom={zoom} />
)}
</Layer>


{template && template[side] && (
  <CardSideLayer
    card={template[side].card}
    elements={template[side].elements}
    side={side}
    templateId={template.id}
    tone={template.tone}
    selectedImageId={selectedImageId}
    showTransformer={transformModeActive}
    selectedTextIndex={selectedTextIndex}
    cardX={cardX}
    cardY={cardY}
    position={position}
    canvasBounds={canvasBounds}
    containerRef={containerRef}
    stageRef={stageRef}
    zoom={zoom}
    mode={mode}
    brushColor={brushColor}
    bgImage={side === 'front' ? frontImage : backImage}
    setTemplate={setTemplate}
    handlers={{
      onPaint: handleCellPaint,
      onImageUpdate: handleImageUpdate,
      onTextClick: handleTextClick,
      onTextEdit: handleTextEdit,
      onTextUpdate: handleTextUpdate,
      setGhostLines,
      setSelectedFont,
      setSelectedColor,
      setInputPosition,
      setShowToolbar,
      setSelectedImageId,
      onFontSizeChange
    }}
  />
)}







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




 

</Stage>


{snapshots.front && snapshots.back && showGallery && (
    
  <div className="fixed inset-0 bg-white z-50 overflow-auto p-8">
    <SnapshotGallery snapshots={snapshots} tone={template.tone} card={card}/>


    <div
        style={{
          position: 'relative',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '0.5rem',
          padding:"10px",
          
          
        }}
      >
     <ToneButton
  icon={<XIcon size={18} />}
  fontSize='text-sm'
  label="Close"
  tone={template.tone as "primary" | "accent" | "ceremonial" | "neutral"}
  isActive={false}
  onClick={showDesignView}

/>

<ToneButton
fontSize='text-sm'
  icon={<CreditCard size={18} />}
  label="Save to Archive"
  tone={template.tone as "primary" | "accent" | "ceremonial" | "neutral"}
  isActive={false}
  onClick={handleSaveToArchive}
/>
      </div>

  


   



  </div>
)}






  
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
          editingText={editingText}
          onTextChange={setEditingText}
          onTextBlur={handleTextBlur}
          position={inputPosition}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          exitEditingMode={exitEditingMode}
        />
      )}
  
      </div>


     
);
};

export default KonvaCanvas;
