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
import { renderToCanvasInsideFaces } from '../utils/renderToCanvasInsideFaces';

import { serializeDualTemplate } from '../utils/serializeDualTemplate';
import { type DualTemplate } from '../types/template';

import { normalizeDualTemplate } from '../utils/normalizeDualTemplate';

import { ExportRitualModal } from './ExportRitualModal';


import InsideEditorView from './InsideEditorView';


import { type CardState } from '../types/CardState';
import { type HistoryEntry } from '../types/HistoryEntry';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';


import TabNavigator from './TabNavigator';
import RulerLayer from './RulerLayer';

import { Line, Text } from 'react-konva';


import { IconButton } from './IconButton';
import { ToneButton } from './ToneButton';

import ImageToolbar from './ImageToolbar';
import { ImageTools } from '../utils/imageTools';
import { DecorationPicker } from './DecorationPicker';
import { BackgroundPicker } from './BackgroundPicker';


import { printSnapshots } from './printSnapshots';

import {
    RotateCcw,
    ZoomOut,
    ZoomIn,
    Save,
    Undo,
    Redo,
    EyeOff,
    LayoutIcon,
    ArrowLeft,
    Brush,
    CreditCard,
    RotateCw,
    XIcon,
    Type,
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

  import { ToneButtonSection } from './ToneButtonSection';
  import { useTransformMode } from '../utils/useTransformMode';
import { ImageUpload } from './ImageUpload';
import { AddImageButton } from './AddImageButton';
import { CropBoxOverlay } from './CropBoxOverlay';
import { useMemo } from 'react';
import { DesignModeLabel } from './DesignModalLabel';
import { CanvasMode } from '../types/CanvasMode';



  
  

  
  






const KonvaCanvas = () => {
const [template, setTemplate] = useState<DualTemplate | null>(null);
const [side, setSide] = useState<'front' | 'back'>('front');
const [selectedTextId, setSelectedTextId] = useState<string | null>(null); // migrated
const [editingText, setEditingText] = useState('');
const [inputPosition, setInputPosition] = useState<{ x: number; y: number } | null>(null);
const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
const [selectedFont, setSelectedFont] = useState('--font-inter');
const [selectedColor, setSelectedColor] = useState('#ff595e');
const [selectedFontSize, setSelectedFontSize] = useState(8);
const [mode, setMode] = useState<'painting' | 'card' | 'preview' | 'insideFace'>('card');
const [faceMode, setFaceMode] = useState<'insideFront' | 'insideBack' | 'front' | 'back'>('front');

const [animatedCells, setAnimatedCells] = useState<Set<string>>(new Set());
const [showToolbar, setShowToolbar] = useState(false);
const [isImageToolbar, setIsImageToolbar] = useState(false);
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
const [showGuides, setShowGuides] = useState(true);
const [prepareForPrint, setPrepareForPrint] = useState(false);
const [snapshotArchive, setSnapshotArchive] = useState<SnapshotEntry[]>([]);
const [lastSavedTemplate, setLastSavedTemplate] = useState<DualTemplate | null>(null);
const [showBleeds, setShowBleeds] = useState(true);
const [bleedToggleDisabled, setBleedToggleDisabled] = useState(false);
const [showExportModal, setShowExportModal]=useState(false)
const [cropModeActive, setCropModeActive]=useState(false)
const [cellSize, setCellSize]=useState(20)
const [viewMode, setViewMode] = useState<'default' | 'spread'>('default');
const [insideMessage, setInsideMessage] = useState<string | null>(null);

const [designInside, setDesignInside] = useState(false);
const [designComplete, setDesignComplete] = useState(false);



//const [imageRef, setImageRef] = useState<Konva.Image | null>(null);
const imageRef = useRef<Konva.Image>(null);



const toolbarRef = useRef<HTMLDivElement>(null);
const imagebarRef = useRef<HTMLDivElement>(null);



const [snapshots, setSnapshots] = useState<{ front: string | null; back: string | null }>({
  front: null,
  back: null,
});

const stageRef = useRef<any>(null);
const containerRef = useRef<HTMLDivElement | null>(null);

const activeFace = template?.[side];
const card = activeFace?.card;

console.log("activeFace", activeFace, "card", card);

const elements = activeFace?.elements ?? [];
const tone = template?.tone ?? 'light';

const selectedElement = selectedTextId
  ? elements.find(el => el.id === selectedTextId)
  : undefined;

const isBold = selectedElement?.type === 'text' ? selectedElement.isBold ?? false : false;
const isItalic = selectedElement?.type === 'text' ? selectedElement.isItalic ?? false : false;

const [bgImage] = useImage(card?.backgroundImage || '');
const [frontImage] = useImage(template?.front?.card.backgroundImage || '');
const [backImage] = useImage(template?.back?.card.backgroundImage || '');





console.log("cellSize?/?","side", cellSize,"Tobias");

const cols = Math.floor((card?.width ?? 0) / (cellSize ?? 1)) ;
const rows = Math.floor((card?.height ?? 0) / (cellSize ?? 1));


if (card?.gridColors?.length == cols * rows) {
    console.warn(`Grid matched: expected.... ${cols * rows} colors, got ${card?.gridColors?.length}`);
  }
  


const gridColors = card?.gridColors ?? [];
const cardX = (stageSize.width - (card?.width ?? 0)) / 2;
const cardY = (stageSize.height - (card?.height ?? 0)) / 2;

const canvasWidth = stageSize.width;
const canvasHeight = stageSize.height;


const canvasBounds = useMemo(() => ({
    x: cardX ?? 0,
    y: cardY ?? 0,
    width: card?.width ?? 0,
    height: card?.height ?? 0,
  }), [cardX, cardY, card?.width]);



const getCanvasOffset = (): { x: number; y: number } => {
   
   return {x:canvasBounds.x, y:canvasBounds.y}
  };
const offsetBounds=getCanvasOffset();

console.log("offsetBounds", offsetBounds)



const [cropRegion, setCropRegion] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });



const {
    transformModeActive,
    activateTransformMode,
    resetTransformMode,
  } = useTransformMode();




const setTransformModeActive =(bool:boolean)=>
    {
        activateTransformMode(selectedImageId ?? '', 'image')
    }



const updateImageRef =(ref: Konva.Image | null)=>
  {
    imageRef.current=ref;
  }
  

  function handleDecorationSelection(el: TemplateElement) {
    if (el.type !== 'image') return;
  
    const img = new Image();
    img.src = el.src;
  
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const baseWidth = 80;
      const baseHeight = baseWidth / aspectRatio;
  
      const newElement: TemplateElement = {
        ...el,
        id: `decoration-${Date.now()}`,
        position: { x: 100, y: 100 },
        size: { width: baseWidth, height: baseHeight },
        role: 'decoration'
      };
  
      setTemplate((prev) => {
        if (!prev || !prev.front) return prev;
  
        return {
          ...prev,
          front: {
            ...prev.front,
            elements: [...prev.front.elements, newElement]
          }
        };
      });
  
      console.log('✨ Decoration added with aspect ratio:', aspectRatio);
    };
  }




  function handleBackgroundSelection(el: TemplateElement) {
    if (el.type !== 'image') return;
  
    setTemplate((prev) => {
      if (!prev || !prev[side]) return prev;
  
      const updatedFace = {
        ...prev[side]!,
        card: {
          ...prev[side]!.card,
          backgroundImage: el.src
        }
      };
  
      return {
        ...prev,
        [side]: updatedFace
      };
    });
  
    console.log(`🖼️ Background updated for ${side}:`, el.src);
  }
  
  
  


const onTextChange = (text: string) => {
    setEditingText(text); // ← this is the missing piece
  
    if (!selectedTextId || !template || !template[side]) return;
  
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId ? { ...el, label: text } : el
    );
  
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements
      }
    }));
  };
  
  



const handleRemoveText = () => {

    console.log("handleRemoveText", "selectedTextId",  selectedTextId, "template",  template, "template[side]", template?[side]:'')
    if (!selectedTextId || !template || !template[side]) return;
  
    const updatedElements = template[side].elements.filter(el => el.id !== selectedTextId);
  
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        ...prev![side],
        elements: updatedElements
      }
    }));
  
    setSelectedTextId(null);
    setShowToolbar(false);
    setInputPosition(null);
  };
  



const createTextId = (side: 'front' | 'back', elements: TemplateElement[]) => {
  const count = elements.filter(el => el.type === 'text').length;
  return `${side}-text-${count + 1}`;
};

const handleAddText = () => {
  if (!template || !template[side]) return;

  recordSnapshot();

  const newId = createTextId(side, template[side].elements);
  console.log("newId", newId);

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

  setTemplate(prev => {
    if (!prev || !prev[side]) return null;
    return {
      ...prev,
      [side]: {
        ...prev[side],
        elements: [...prev[side].elements, newTextElement],
      },
    };
  });

  setSelectedTextId(newId); // migrated
  // setShowToolbar(true);
};

const handleTextUpdate = (updated: TemplateElement) => {
  if (!template || !isTextElement(updated)) return;

  commitHistoryEntry();

  const updatedElements = elements.map(el =>
    el.id === updated.id && el.type === 'text'
      ? {
          ...el,
          label: updated.text,
          position: {
            x: updated.position.x,
            y: updated.position.y,
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
};

const handleTextEdit = (
  text: string,
  pos: { x: number; y: number },
  el: TemplateElement
) => {
  if (!template || !isTextElement(el) || !template[side]) return;

  commitHistoryEntry();

  const updatedElements = template[side].elements.map(e =>
    e.id === el.id
      ? {
          ...e,
          label: text,
          text,
          position: {
            x: pos.x - cardX,
            y: pos.y - cardY,
          },
          isBold: el.isBold ?? false,
          isItalic: el.isItalic ?? false,
        }
      : e
  );

  setTemplate(prev => {
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
  // setShowToolbar(true);
};


const handleOnUploadImage = (src: string, role: 'background' | 'element') => {
    if (!template || !template[side]) return;
  
    recordSnapshot();
  
    // Snapshot current state before mutation
    setHistory(prev => [
      ...prev,
      {
        mode,
        cardState: {
          width: card?.width ?? 0,
          height: card?.height ?? 0,
          background: card?.background ?? '',
          backgroundImage: card?.backgroundImage ?? '',
          gridColors: card?.gridColors ?? [],
          elements: [...(template[side]?.elements ?? [])],
        },
      },
    ]);
  
    if (role === 'background') {
      // Apply background image mutation
      setTemplate(prev => {
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
      return;
    }
  
    // For 'element' role, load image to preserve aspect ratio
    const img = new window.Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const baseWidth = 200;
      const newElement: TemplateElement = {
        type: 'image',
        id: `img-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        src,
        position: { x: 100, y: 100 },
        size: {
          width: baseWidth,
          height: baseWidth / aspectRatio,
        },
        tone,
      };
  
      setTemplate(prev => {
        if (!prev || !prev[side]) return prev;
        return {
          ...prev,
          [side]: {
            ...prev[side],
            card: {
              ...prev[side].card,
            },
            elements: [...(prev[side].elements ?? []), newElement],
          },
        };
      });
    };
    img.src = src;
  };
  
  

const handleOnUploadBackground = (src: string) => {
  setTemplate(prev => {
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





const handlePrint = () => {
    setPrepareForPrint(true);
    printSnapshots(snapshots); // { front, back }
  };




  const _recordSnapshot = () => {
    const snapshot = captureCardFaceSnapshot({
      stageRef,
      bounds: canvasBounds,
      pixelRatio: 2,
    });
  
    // Optionally store or push to history
    //snapshotHistory.push(snapshot); // or setSnapshots({ front: snapshot, back: snapshot })
  };
  
  


const captureBothSides = async () => {
    if (!stageRef.current) return;
    

    
    setShowBleeds(false);
    setShowRulers(false);

    
    setMode('insideFace')
  
    setSide('front');
    await new Promise(resolve => setTimeout(resolve, 100));
    const front = captureCardFaceSnapshot({
      stageRef,
      bounds: canvasBounds,
      pixelRatio: 2
    });
  
    setSide('back');
    await new Promise(resolve => setTimeout(resolve, 100));
    const back = captureCardFaceSnapshot({
      stageRef,
      bounds: canvasBounds,
      pixelRatio: 2
    });
  
    setSide('front');
    setSnapshots({ front, back });
    setShowGallery(true);
    setLastSavedTemplate(template);
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
    const clampedZoom = Math.max(1, newZoom);
  
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
    const newZoom = Math.max(1, oldZoom * scaleBy);
  
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
  
  const resolveFontStyle = (
    isBold: boolean,
    isItalic: boolean
  ): 'normal' | 'bold' | 'italic' | 'italic bold' => {
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
    setSelectedTextId(null); // migrated
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



  const recordSnapshot = () => {
    if (!template || !template[side]) return;
  
    setHistory(prev => [
      ...prev,
      {
        mode,
        cardState: {
          width: card?.width ?? 0,
          height: card?.height ?? 0,
          background: card?.background ?? '',
          backgroundImage: card?.backgroundImage ?? '',
          gridColors: card?.gridColors ?? [],
          elements: [...(template[side]?.elements ?? [])], // capture current elements
        },
      },
    ]);
  };
  




  
  const handleUndo = () => {

    console.log("history.length", history.length, "template", template)
    if (history.length === 0 || !template) return;
  
    const previous = history[history.length - 1];
  
    const isSameState =
    JSON.stringify(elements) === JSON.stringify(previous.cardState.elements) &&
    card?.backgroundImage === previous.cardState.backgroundImage &&
    card?.background === previous.cardState.background &&
    JSON.stringify(card?.gridColors) === JSON.stringify(previous.cardState.gridColors);
  
  if (isSameState) return;
  
  
    // Remove last entry from history
    setHistory(prev => prev.slice(0, -1));
  
    // Push current state into future for redo
    setFuture(prev => [
      {
        mode,
        cardState: {
          width: card?.width ?? previous.cardState.width,
          height: card?.height ?? previous.cardState.height,
          background: card?.background ?? previous.cardState.background,
          backgroundImage: card?.backgroundImage ?? previous.cardState.backgroundImage,
          gridColors: card?.gridColors ?? previous.cardState.gridColors,
          elements: elements, // current elements BEFORE undo
        },
      },
      ...prev,
    ]);
  
    // Apply previous state
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        card: {
          width: previous.cardState.width,
          height: previous.cardState.height,
          background: previous.cardState.background,
          backgroundImage: previous.cardState.backgroundImage,
          gridColors: previous.cardState.gridColors,
        },
        elements: previous.cardState.elements,
      },
    }));
  
    setMode(previous.mode);
  };
  
  const handleRedo = () => {
    if (future.length === 0 || !template) return;
  
    const nextEntry = future[0];
  
    // Prevent recording a redundant state if nothing changed
    const isSameState =
      JSON.stringify(elements) === JSON.stringify(nextEntry.cardState.elements) &&
      card?.backgroundImage === nextEntry.cardState.backgroundImage &&
      card?.background === nextEntry.cardState.background&&
      JSON.stringify(card?.gridColors) === JSON.stringify(nextEntry.cardState.gridColors);
  
    if (isSameState) return;
  
    // Remove first entry from future
    setFuture(prev => prev.slice(1));
  
    // Push current state into history for undo
    setHistory(prev => [
      ...prev,
      {
        mode,
        cardState: {
          width: card?.width ?? 0,
          height: card?.height ?? 0,
          background: card?.background ?? '',
          backgroundImage: card?.backgroundImage ?? '',
          gridColors: card?.gridColors ?? [],
          elements, // current elements BEFORE redo
        },
      },
    ]);
  
    // Apply next state
    setTemplate(prev => ({
      ...prev!,
      [side]: {
        card: {
          width: nextEntry.cardState.width,
          height: nextEntry.cardState.height,
          background: nextEntry.cardState.background,
          backgroundImage: nextEntry.cardState.backgroundImage,
          gridColors: nextEntry.cardState.gridColors,
        },
        elements: nextEntry.cardState.elements,
      },
    }));
  
    setMode(nextEntry.mode);
  }


  
  
  
  const handleSaveCard = async () => {
    if (!template || !template.front || !template.front.card) {
      console.warn('🛑 Cannot save: missing front face or template.');
      return;
    }
  
    let patchedTemplate: DualTemplate = template;
  
    if (selectedTextId && template?.[side]?.elements) {
      const updatedElements = [...template[side].elements];
      const elIndex = updatedElements.findIndex(el => el.id === selectedTextId);
      const el = updatedElements[elIndex];
  
      console.log("el", el);
  
      if (el?.type === 'text') {
        updatedElements[elIndex] = {
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
  
    console.log("patchedTemplate", patchedTemplate);
  
    const serialized = serializeDualTemplate(patchedTemplate, mode);
  
    console.log("serialized", serialized);
  
    const designData = {
      name: `Ceremony - ${template.id}`,
      author: 'Tobias Chilonga',
      savedAt: new Date().toISOString(),
      thumbnailUrl: "/assets/logo.png",
      userId: "chilongatobias@gmail.com",
      insideMessage:insideMessage,
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
  
    if (!selectedTextId || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === 'text'
        ? { ...el, font: newFont }
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
  
  const onColorChange = (newColor: string) => {
    setSelectedColor(newColor);
  
    if (!selectedTextId || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === 'text'
        ? { ...el, color: newColor }
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
  
  const handleToggleBold = () => {
    setPendingStyle(prev => ({ ...prev, isBold: !prev.isBold }));
  
    if (!selectedTextId || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === 'text'
        ? { ...el, isBold: !el.isBold }
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
  
  const handleToggleItalic = () => {
    setPendingStyle(prev => ({ ...prev, isItalic: !prev.isItalic }));
  
    if (!selectedTextId || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === 'text'
        ? { ...el, isItalic: !el.isItalic }
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
  
  const handleTextClick = (
    text: string,
    pos: { x: number; y: number },
    id: string
  ) => {
    setEditingText(text);
    setInputPosition(pos);
    setSelectedTextId(id); // migrated
    setShowToolbar(true);

    activateTransformMode(selectedTextId ?? '','text');
    
    console.log("🖋️ Text selected with ID:", id, "label:", text);
  };
  
  const handleImageUpdate = (
    e: KonvaEventObject<Event>,
    id: string
  ) => {
    if (!template || !template[side]) return;
  
    commitHistoryEntry();
  
    const node = e.target as Konva.Image;
  
    const updatedElements = template[side].elements.map(el =>
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
  
    if (!selectedTextId || !template || !template[side]) return;
  
    commitHistoryEntry();
  
    const updatedElements = template[side].elements.map(el =>
      el.id === selectedTextId && el.type === 'text'
        ? { ...el, size: newSize }
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
  
  const handleCellPaint = (col: number, row: number) => {

    
    const index = row * cols + col;
    if (!template || !card || index < 0 || index >= cols * rows) return;

    console.log("handleCellPaint recording", "row", row, "col", col);
  
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

  const showCompleteDesign = ()=>{
    console.log("showCompleteDesign: showing complete design")
    setDesignInside(false);
  }
  
  const showDesignView = () => {
   
    console.log("showDesignView", lastSavedTemplate);
    handleTemplateSelect(lastSavedTemplate ?? undefined);
    setShowGallery(false);
    setShowBleeds(true);
    setShowRulers(true);
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
      setSelectedTextId(null); // migrated
      setSelectedImageId(null);
      setShowToolbar(false);
      setInputPosition(null);
      setHistory([]);
      setFuture([]);
      setCellSize(normalized.front?.card.cellSize ?? cellSize)
      setMode('card');
  
      renderToCanvas(normalized, setTemplate, setMode);
      setShowBleeds(true)
      setShowRulers(true);
      setShowGallery(false);
    } catch (err) {
      console.error('🛑 Failed to parse and render template:', err);
    }
  };
  
  const handleSaveToArchive = (mode:CanvasMode='front') => {
    if (!snapshots.front || !snapshots.back || !template) return;
  
    const timestamp = new Date().toISOString();

    

    if(mode=='insideFace'){


        const entryFront: SnapshotEntry = {
            image: snapshots.front,
            side: 'front',
            timestamp,
            templateId: template.id,
            tone: template.tone,
            type:'insideFront',
            template:template
          };

          const entryBack: SnapshotEntry = {
            image: snapshots.back,
            side: 'back',
            timestamp,
            templateId: template.id,
            tone: template.tone,
            type:'insideBack',
            template:template
          };
        
          setSnapshotArchive(prev => [...prev, entryFront, entryBack]);

    }else
    {
        const entryFront: SnapshotEntry = {
            image: snapshots.front,
            side: 'front',
            timestamp,
            templateId: template.id,
            tone: template.tone,
            type:'front',
            template:template
          };

          const entryBack: SnapshotEntry = {
            image: snapshots.back,
            side: 'back',
            timestamp,
            templateId: template.id,
            tone: template.tone,
            type:'back',
            template:template
          };


          setSnapshotArchive(prev => [...prev, entryFront, entryBack]);
    }

    

    console.log('Design saved to archive ✨');
    setLastSavedTemplate(template);
    setTemplate(null);
  };
  


  const handleRestore = (entry: SnapshotEntry) => {
    setSide(entry.side);
    setTemplate(loadTemplateFromSnapshot(entry));
    setPrepareForPrint(false);
  };



  const setModeActive=(bool:boolean)=>
    {
        setCropModeActive(bool)
    }


    const handleRenderBlankTemplate = () => {
        if (!lastSavedTemplate) return;
      
        // Deep clone the template
        const blankTemplate: DualTemplate = JSON.parse(JSON.stringify(lastSavedTemplate));
      
        console.log("🧼 handleRenderBlankTemplate → cloned template:", blankTemplate);
      
        // Blank front and back faces
        const gridLength = lastSavedTemplate.front?.card?.gridColors?.length ?? 60;
      
        if (blankTemplate.front?.card && blankTemplate.back?.card) {
          blankTemplate.front.card.gridColors = Array(gridLength).fill('#ffffff');
          blankTemplate.back.card.gridColors = Array(gridLength).fill('#ffffff');
      
          blankTemplate.front.card.backgroundImage = '';
          blankTemplate.back.card.backgroundImage = '';
      
          blankTemplate.front.elements = [];
          blankTemplate.back.elements = [];
        }
      
        // Trigger full render cycle
        handleTemplateSelect(blankTemplate);
      
        // UI state adjustments
        setShowGallery(false);
        setShowBleeds(true);
        setShowRulers(true);
        setFaceMode("insideFront");
      };
      








  useEffect(() => {
    if (!selectedTextId || !template || !template[side]) return;
  
    const selectedElement = template[side].elements.find(el => el.id === selectedTextId);
  
    if (selectedElement && selectedElement.type === 'text') {
      setEditingText(selectedElement.label);
    }
  }, [selectedTextId, template, side]);
  

  
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
        
        const clickedInsideToolbar = toolbarRef.current?.contains(e.target as Node);
        
      
  
        console.log("handleGlobalClick called", e.target, clickedInsideToolbar)
    
        if (clickedInsideToolbar) {
            return; // clicked inside toolbar, do nothing
          }
    
        // Otherwise, deselect
        setSelectedTextId(null);
        setShowToolbar(false);
        setEditingText('');
        setInputPosition(null);
        //setTransformModeActive(false)
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
  
  const updateMe = () => {
    if (!cropModeActive || !selectedImageId || !template || !template[side]) return;
  
    const element = template[side].elements.find(
      el => el.id === selectedImageId && el.type === 'image'
    );
  
    if (element && !isTextElement(element)) {
      const localX = element.position.x;
      const localY = element.position.y;
      const width = element.size.width;
      const height = element.size.height;
  
      const translatedX = canvasBounds.x + localX;
      const translatedY = canvasBounds.y + localY;
  
      console.log('[Crop Init]', {
        id: selectedImageId,
        local: { x: localX, y: localY },
        translated: { x: translatedX, y: translatedY },
        size: { width, height },
      });
  
      setCropRegion({
        x: translatedX,
        y: translatedY,
        width,
        height,
      });
    }
  }
  //useEffect(updateMe, [cropModeActive, selectedImageId, template, canvasBounds]);


    useEffect(() => {
        if (!cropModeActive || !selectedImageId || !template || !template[side]) return;
      
        const element = template[side].elements.find(
          el => el.id === selectedImageId && el.type === 'image'
        );
      
        if (element && !isTextElement(element)) {
          const localX = element.position.x;
          const localY = element.position.y;
          const width = element.size.width;
          const height = element.size.height;
      
          const translatedX = canvasBounds.x + localX;
          const translatedY = canvasBounds.y + localY;
      
          console.log('[Crop Init]', {
            id: selectedImageId,
            local: { x: localX, y: localY },
            translated: { x: translatedX, y: translatedY },
            size: { width, height },
          });
      
          setCropRegion({
            x: translatedX,
            y: translatedY,
            width,
            height,
          });
        }
      }, [cropModeActive, selectedImageId, template, canvasBounds]);




     /* useEffect(() => {
        if (designInside) {
           setMode('card'); // optional: switch to design mode
           renderToCanvasInsideFaces(template, setTemplate, setMode);
         
          setShowGallery(false);
          setShowBleeds(true);
          setShowRulers(true);
        }
      }, [designInside]);*/


   




      

  
    if (!template) {
      return (
          <>
        <div className="fade-in">
          <TabNavigator
            userId="chilongatobias@gmail.com"
            onSelect={handleTemplateSelect}
            snapshotArchive={snapshotArchive}
            setSnapshotArchive={setSnapshotArchive}
            showDesigns={designComplete}
          />
         
        </div>
  
        </>
      );
    }else{ console.log("template is set rendering continuing")}





    


    const exitEditingMode = () => {
        setSelectedTextId(null); // migrated
        setShowToolbar(false);
        setEditingText('');
        console.log('🚪 Exited editing mode');
      };
      
      const handleTextBlur = (e: React.FocusEvent<HTMLInputElement>) => {

    
        const toolbarEl = document.getElementById('text-toolbar');
        const relatedTarget = e.relatedTarget as HTMLElement;
      
        if (!relatedTarget || (toolbarEl && toolbarEl.contains(relatedTarget))) {
            return;
        }
          
      
        if (selectedTextId && template?.[side]?.elements) {
          const updatedElements = template[side].elements.map(el =>
            el.id === selectedTextId && el.type === 'text'
              ? { ...el, label: editingText }
              : el
          );
      
          setTemplate(prev => ({
            ...prev!,
            [side]: {
              ...prev![side],
              elements: updatedElements
            }
          }));
      
          console.log('📝 Text committed:', editingText);
        }
      
       //exitEditingMode?.(); // Gracefully exit after commit
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

    <DesignModeLabel faceMode={faceMode} mode={mode} />
    
    <ToneButtonGroup tone={template.tone as 'primary' | 'accent' | 'ceremonial' | 'neutral'}>
  {/* Navigation & Mode */}
  <ToneButtonSection label="Navigation & Mode" initiallyOpen={false}>
    <div className="flex flex-col gap-2">
      <ToneButton
        fontSize="text-sm"
        icon={<ArrowLeft size={18} />}
        label="Back"
        tone={template.tone}
        isActive={false}
        onClick={() => setTemplate(null)}
      />
      <ToneButton
        fontSize="text-sm"
        icon={mode === 'card' ? <Brush size={18} /> : <CreditCard size={18} />}
        label={`${mode === 'card' ? 'Painting' : 'Card'} Mode`}
        tone={template.tone}
        isActive={false}
        onClick={() => setMode((prev) => (prev === 'card' ? 'painting' : 'card'))}
      />
      <ToneButton
        fontSize="text-sm"
        icon={side === 'front' ? <RotateCcw size={18} /> : <RotateCw size={18} />}
        label={`Flip to ${side === 'front' ? 'Back' : 'Front'}`}
        tone={template.tone}
        isActive={false}
        onClick={handleFlipSide}
      />
    </div>
  </ToneButtonSection>

  {/* Actions */}
  <ToneButtonSection label="Actions" initiallyOpen={false}>
    <div className="flex flex-col gap-2">
      <ToneButton
        fontSize="text-sm"
        icon={<Undo size={18} />}
        label="Undo"
        tone={template.tone}
        isActive={false}
        onClick={handleUndo}
      />
      <ToneButton
        fontSize="text-sm"
        icon={<Redo size={18} />}
        label="Redo"
        tone={template.tone}
        isActive={false}
        onClick={handleRedo}
      />
      <ToneButton
        fontSize="text-sm"
        icon={<Save size={18} />}
        label="Save"
        tone={template.tone}
        isActive={false}
        onClick={handleSaveCard}
      />
      <ToneButton
        fontSize="text-sm"
        icon={<Save size={18} />}
        label="Preview"
        tone={template.tone}
        isActive={false}
        onClick={captureBothSides}
      />
    </div>
  </ToneButtonSection>

  {/* Canvas Tools */}
  <ToneButtonSection label="Canvas Tools" initiallyOpen={true}>
    <div className="flex flex-col gap-2">
      <ToneButton
        fontSize="text-sm"
        icon={<Type size={18} />}
        label="Add Text"
        tone={template.tone}
        isActive={false}
        onClick={handleAddText}
      />

      <AddImageButton tone={template.tone} onUpload={handleOnUploadImage} />

      <ToneButton
        fontSize="text-sm"
        icon={<XIcon size={18} />}
        label="Remove Text"
        tone={template.tone}
        isActive={!!selectedTextId}
        onClick={selectedTextId ? handleRemoveText : () => {}}
      />

      <ToneButton
        fontSize="text-sm"
        icon={<Type size={18} />}
        label="Resize Image"
        tone={template.tone}
        isActive={false}
        onClick={() => activateTransformMode(selectedImageId ?? '', 'image')}
      />

      
    </div>
  </ToneButtonSection>




</ToneButtonGroup>


<div className="absolute top-6 right-4 z-20 flex items-center gap-3
            bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg ">
  {/* Zoom Controls */}
  <IconButton
    icon={<ZoomIn size={20} />}
    tone={template.tone}
    onClick={() => handleZoom(1.1)}
  />
  <IconButton
    icon={<ZoomOut size={20} />}
    tone={template.tone}
    onClick={() => handleZoom(0.9)}
  />

  {/* Toggle Controls */}
  <ToggleCheckbox
    label="Show Rulers"
    checked={showRulers}
    onToggle={() => setShowRulers((prev) => !prev)}
    tone={template.tone}
  />

  <ToggleCheckbox
    label="Show Bleeds"
    checked={showBleeds}
    onToggle={() => setShowBleeds((prev) => !prev)}
    tone={template.tone}
    disabled={bleedToggleDisabled}
  />
</div>




    {template && (
  <div className="absolute top-1/2 left-20 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-md shadow-md text-sm text-gray-700 font-inter pointer-events-none">
    <h3 className="text-base font-semibold text-gray-900">{template.name}</h3>
    <p className="text-sm text-gray-600">by {template.author}</p>
    <p className="mt-1 text-xs text-gray-500 italic">
      {template.sizeLabel} ({template.width}×{template.height})
    </p>

    
    
   
  </div>

  
)}




      
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
      
         {mode=="painting" &&(

<CardGridBackground
width={card.width}
height={card.height}
x={cardX}
y={cardY}
cellSize={cellSize}
stroke={tone === 'dark' ? '#444' : '#f0f0f0'}
cols={cols}
rows={rows}
side={side}
getCellColor={(col, row) => {
  const index = row * cols + col;
  return gridColors?.[index] || '#000000';
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

)}


         
      
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
                const toolbarEl = document.getElementById('text-toolbar');
                const { clientX, clientY } = e.evt;
                const domTarget = document.elementFromPoint(clientX, clientY);
                const clickedInsideToolbar = toolbarEl?.contains(domTarget);
              
                console.log("clickedInsideToolbar: stage Event", clickedInsideToolbar);
              
                if (clickedInsideToolbar) return; // ✅ Exit early
              
                const clickedNode = e.target;
                const isImage = clickedNode.getClassName?.() === 'Image';
                const isTransformer = clickedNode.getClassName?.() === 'Transformer';
                const isStage = clickedNode === e.target.getStage();

                console.log("isImage", isImage)
              
                if (!isImage && !isTransformer) {
                    setSelectedImageId(null);
                    resetTransformMode(); // ← graceful exit from resize mode
                  }
                  
              
                if ((isStage || isImage) && selectedTextId) {
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
              
                if (isStage || isImage) {
                  setSelectedTextId(null);
                  setShowToolbar(true);
                  setInputPosition(null);
                }
              }}
              
            >


              
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

{template && template[side] && (
  <CardSideLayer
    card={template[side].card}
    elements={template[side].elements}
    side={side}
    editingText={editingText}
    templateId={template.id}
    tone={template.tone}
    selectedImageId={selectedImageId}
    selectedTextId={selectedTextId} // ✅ migrated
    transformModeActive={transformModeActive}
    cardX={cardX}
    cardY={cardY}
    position={position}
    canvasBounds={canvasBounds}
    containerRef={containerRef}
    stageRef={stageRef}
    zoom={zoom}
    mode={mode}
    rows={rows}
    cols={cols}
    cellSize={cellSize}
    brushColor={brushColor}
    bgImage={side === 'front' ? frontImage : backImage}
    setTemplate={setTemplate}
    handlers={{
      
      setImageRef:updateImageRef,
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
<Layer>

{cropModeActive && selectedImageId && (
  <CropBoxOverlay
    cropRegion={cropRegion}
    onUpdate={setCropRegion}
    isLocked={true} // optional toggle
   

  />
)}

</Layer>





 

</Stage>


  


{snapshots.front && snapshots.back && showGallery && (
  <div className="fixed inset-0 bg-white z-50 overflow-auto p-8">
    <SnapshotGallery snapshots={snapshots} 
    tone={template.tone as 'warm' | 'reflective' | 'minimal' | 'neutral'} 
    card={card} 
    viewMode={viewMode}
    setInsideMessage={(msg)=>{setInsideMessage(msg)}}/>

    <div
  style={{
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    zIndex: 60,
    display: 'flex',
    gap: '0.75rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }}
>

{mode === 'insideFace' && (
  <div className="mt-6 text-center">
    {designInside ? (
    
      <button
        onClick={()=>{
            setDesignComplete(true);
            setDesignInside(false);
            handleSaveToArchive('insideFace');
            showCompleteDesign();}
        }
        
        className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 transition text-sm font-medium"
      >
        🎉 See your complete design →
      </button>
    ) : (
      <button
        onClick={() => {
          setDesignInside(true);
          setDesignComplete(false);
          handleSaveToArchive('front');
           // triggers inside face design
          handleRenderBlankTemplate();
        }}
        className="px-4 py-2 rounded bg-indigo-100 hover:bg-indigo-200 transition text-sm"
      >
        ✨ Click here to design and include inside faces
      </button>
    )}
  </div>
)}



<ToneButton
  label={viewMode === 'spread' ? 'View as Preview' : 'View as Spread'}
  icon={viewMode === 'spread' ? <EyeOff size={18} /> : <LayoutIcon size={18} />}
  tone={template.tone}
  isActive={false}
  fontSize="text-sm"
  onClick={() => setViewMode(viewMode === 'spread' ? 'default' : 'spread')}
/>





      <ToneButton
        fontSize="text-sm"
        icon={<Save size={18} />}
        label="Save"
        tone={template.tone}
        isActive={false}
        onClick={handleSaveCard}
      />
     

      <ToneButton
        icon={<CreditCard size={18} />}
        fontSize="text-sm"
        label="Save to Archive"
        tone={template.tone as 'primary' | 'accent' | 'ceremonial' | 'neutral'}
        isActive={false}
        onClick={handleSaveToArchive}
      />

        <ToneButton fontSize="text-sm" icon={<Save size={18} />} label="Print" 
         tone={template.tone} isActive={false} onClick={handlePrint} />

         <ToneButton fontSize="text-sm" icon={<Save size={18} />} label="Export" 
         tone={template.tone} isActive={false} onClick={() => setShowExportModal(true)}/>

      <ToneButton
        icon={<XIcon size={18} />}
        fontSize="text-sm"
        label="Exit"
        tone={template.tone as 'primary' | 'accent' | 'ceremonial' | 'neutral'}
        isActive={false}
        onClick={showDesignView}
      />
    
    </div>
  </div>
)}



  



{showExportModal && (
  <ExportRitualModal
    snapshots={snapshots}
    tone={template.tone as "minimal" | "reflective" | "warm" | "playful"}
    onClose={() => setShowExportModal(false)}
  />
)}

{showToolbar && inputPosition && mode === 'card' && (
  <div ref={toolbarRef} id="text-toolbar">
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
      onTextChange={onTextChange}
      onTextBlur={handleTextBlur}
      onAddText={handleAddText}
      onRemoveText={handleRemoveText}
      tone={template.tone}
      exitEditingMode={exitEditingMode}
    />
  </div>
  
)}
{selectedImageId && mode === 'card' && (
  <div ref={imagebarRef} id="image-toolbar">
    <ImageToolbar
      selectedElementId={selectedImageId}
      handleOnUploadImage={handleOnUploadImage}
      tone={template.tone}
      setTemplate={setTemplate}
      side={side}
      recordSnapshot={recordSnapshot}
      setTransformModeActive={setTransformModeActive}
      setCropMode={setModeActive}
      onToggleCropMode={setModeActive}
      imageRef={imageRef}
      cropRegion={cropRegion}
      canvasBounds={offsetBounds}
    
    />
  </div>
)}













</div>






);
};

export default KonvaCanvas;
