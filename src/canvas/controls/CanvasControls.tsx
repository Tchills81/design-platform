/**
 * Renders tone-aware controls: 
 * navigation, mode toggle, undo/redo, save, 
 * preview, painting tools, and zoom/ruler toggles.
 */


// src/canvas/CanvasControls.tsx
import { ArrowLeft, Brush, Image, Text, XIcon } from 'lucide-react';

import { ToneButton } from '@/src/components/ToneButton';
import SidebarModule from '@/src/components/SidebarModule';
import SidebarSection from '@/src/components/SidebarSection';
import CanvasActionCluster from '@/src/components/CanvasActionCluster';
import PaintingCluster from '@/src/components/PaintingCluster';
import FooterControlCluster from '@/src/components/FooterControlCluster';
import PaintingToolbar from '@/src/components/PaintingToolbar';
import { AddImageButton } from '@/src/components/AddImageButton';
import { DualTemplate } from '@/src/types/template';
import { tone } from '@/src/types/tone';
import { CanvasMode } from '@/src/types/CanvasMode';
import TopControlBar from '@/src/components/TopControlBar';
import AddFaceButton from '@/src/components/AddFaceButton';
import FaceSectionSwitcher from '@/src/components/FaceSectionSwitcher';
import { map } from 'framer-motion/client';
import regenerateGrid from '@/src/utils/regenerateGrid';
import { RefObject, useState } from 'react';
import TonePalette from '@/src/components/TonePalette';
import { HistoryEntry } from '@/src/types/HistoryEntry';
import ProfileCard from '@/src/components/ProfileCard';
import ElementPanel from '@/src/components/ElementPanel';
import { DesignElement } from '@/src/types/DesignElement';
import { SnapshotEntry } from '@/src/types/SnapshotEntry';


export interface CanvasControlsProps {

    stageSize:{ width: number; height: number };
    canvasWidth:number;
    canvasHeight:number;
    cardX:number;
    cardY:number;
    template: DualTemplate | null;
    snapshots: { front: string | null; back: string | null };
    snapshotArchive:SnapshotEntry[]
    mode: CanvasMode;
    faceMode: CanvasMode;
    modes:CanvasMode[]
    setModes:(modes:CanvasMode[])=>void;
    side: 'front' | 'back';
    brushSize: number;
    selectedColor: string;
    showRulers: boolean;
    showBleeds: boolean;
    showGrids:boolean;
    bleedToggleDisabled: boolean;
    selectedTextId: string | null;
    selectedImageId: string | null;
    zoom:number;
    initialZoomedOutValue:number;
    hasInitializedZoom:RefObject<boolean>;
    
    setSide: React.Dispatch<React.SetStateAction<'front' | 'back'>>;
    setFaceMode: React.Dispatch<React.SetStateAction<CanvasMode>>;
    setPageAdded: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFullScreen:React.Dispatch<React.SetStateAction<boolean>>;
    toggleFullScreen:()=>void;
    
    setMode: React.Dispatch<React.SetStateAction<CanvasMode>>;
    setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>;
    setSnapshotArchive: React.Dispatch<React.SetStateAction<SnapshotEntry[]>>;
    setLastSavedTemplate:(template:DualTemplate | null)=>void;
    lastSavedTemplate:DualTemplate | null;
    setDualFaces: React.Dispatch<React.SetStateAction<DualTemplate[]>>;
    history: HistoryEntry[];
    future: HistoryEntry[];
    dualFaces:DualTemplate[];
    designElements:DesignElement[];
    activeTimestamp:string | null; 
    hasChanged:boolean;
    captureFrontAndBack(): Promise<{ front: string; back: string }>;
    setActiveTimestamp:React.Dispatch<React.SetStateAction<string | null>>;
    setCanvasReady:React.Dispatch<React.SetStateAction<boolean>>;
    setHasChanged:React.Dispatch<React.SetStateAction<boolean>>;
    setShowRulers: React.Dispatch<React.SetStateAction<boolean>>;
    setShowBleeds: React.Dispatch<React.SetStateAction<boolean>>;
    setShowGrids: React.Dispatch<React.SetStateAction<boolean>>;
    setShowBackground: React.Dispatch<React.SetStateAction<boolean>>;
    setShowReflectionModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowCommentModal:React.Dispatch<React.SetStateAction<boolean>>;
    setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    setElementId?: React.Dispatch<React.SetStateAction<string>>;
    setDesignElement:(el:DesignElement)=>void;
    setBrushSize: (size: number) => void;
    setSelectedColor: (color: string) => void;
    handleUndo: () => void;
    handleZoom: (zoom:number) => void;
    handleRedo: () => void;
    handleSaveCard: () => void;
    captureBothSides: () => void;
    handleAddText: () => void;
    resetDesign:()=>void;
    duplicatePage:()=>void;
    createPageTemplate:(page:number)=>void;
    handleRemoveText: () => void;
    activateTransformMode: (id: string, type: 'image' | 'text') => void;
    handleOnUploadImage: (src: string, role: 'background' | 'element') => void;
    handleRenderBlankTemplate: () => void;
    handleTemplateSelect:(tpl:DualTemplate)=>void;
    setShowPages: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPreviewMode:(mode:boolean)=>void;
    showPages:boolean;
    isPreviewMode:boolean;
    isCollapsed:boolean;
}

export default function CanvasControls({
    template,
    snapshots,
    snapshotArchive,
    mode,
    stageSize,
    setModes,
    side,
    brushSize,
    selectedColor,
    showRulers,
    showBleeds,
    showGrids,
    bleedToggleDisabled,
    selectedTextId,
    selectedImageId,
    zoom,
    initialZoomedOutValue,
    hasInitializedZoom,
   
    activeTimestamp,
    setActiveTimestamp,
    setCanvasReady,
    duplicatePage,
    setIsFullScreen,
    setMode,
    setSide,
    setTemplate,
    setShowRulers,
    setShowBleeds,
    setShowGrids,
    setBrushSize,
    setSelectedColor,
    setShowBackground,
    setShowReflectionModal,
    setShowCommentModal,
    setShowShareModal,
    setElementId,
    setDesignElement,
    handleUndo,
    handleZoom,
    handleRedo,
    handleSaveCard,
    captureBothSides,
    handleAddText,
   
    handleRemoveText,
    activateTransformMode,
    handleOnUploadImage,
    handleRenderBlankTemplate,
    handleTemplateSelect,
    setLastSavedTemplate,
    lastSavedTemplate,
    dualFaces,
    setDualFaces,
    faceMode,
    setFaceMode,
    history,
    future,
    designElements,
    hasChanged,
    setHasChanged,
    resetDesign,
    createPageTemplate,
    setSnapshotArchive,
    captureFrontAndBack,
    setPageAdded,
    setShowPages,
    showPages,
    isPreviewMode,
    setIsPreviewMode,
    setIsCollapsed,
    toggleFullScreen,
    isCollapsed
  }: CanvasControlsProps) {
    // ...render logic
  if (!template) return null;


  const [showPalette, setShowPalette] = useState(false);

  const handleDesignSelected=(el:DesignElement)=>{

    console.log(template, 'template')
    setDesignElement(el);
    
  }
  

  
  return (

    
    <>

    {!isPreviewMode && (


<SidebarModule tone={template.tone as tone}>
<ToneButton
icon={<ArrowLeft />}
label="Back to Templates"
tone={template.tone}
onClick={() => {
setModes(['front', 'back']);
console.log('resetting design ....', resetDesign)
resetDesign();
setTemplate(null);
setLastSavedTemplate(template);
hasInitializedZoom.current = false;
//setZoom(1);
}}
/>



<SidebarSection label="Elements" >
<ElementPanel tone={template.tone as tone}  onSelect={(el:DesignElement)=>{
handleDesignSelected(el);
}}/>

</SidebarSection>


<SidebarSection label="Canvas Rituals">
<CanvasActionCluster
tone={template.tone as tone}
mode={mode === 'card' ? 'card' : 'painting'}
side={side}
faceMode={faceMode}
onToggleMode={() =>{
setShowBackground(false);
setMode(prev => (prev === 'card' ? 'painting' : 'card'));




}
}
onFlipSide={() => {
if (faceMode === 'insideFront') {
setFaceMode('insideBack');
} else if (faceMode === 'insideBack') {
setFaceMode('insideFront');
} else {


setFaceMode(prev => (prev === 'front' ? 'back' : 'front'));
}

setSide(prev => (prev === 'front' ? 'back' : 'front'));
}}
onUndo={handleUndo}
onRedo={handleRedo}
history={history}
future={future}
onSave={handleSaveCard}
onPreview={captureBothSides}
/>

</SidebarSection>


<SidebarSection label="Canvas Tools">
<ToneButton icon={<Text />} label="Add Text" onClick={handleAddText} tone={template.tone} />

<ToneButton icon={<XIcon />} label="Remove Text" onClick={handleRemoveText} tone={template.tone} isActive={!!selectedTextId} />
<AddImageButton context="design" tone={template.tone} onUpload={handleOnUploadImage} />
<ToneButton icon={<Image />} label="Resize Image" onClick={() => activateTransformMode(selectedImageId ?? '', 'image')} tone={template.tone} />
</SidebarSection>



</SidebarModule>


  )}
      
  { mode=='card' && zoom<1 && !isPreviewMode &&(

<TopControlBar
template={template}
tone={template.tone as tone}
zoom={zoom}
setZoom={(newZoom:number)=>{
  const scaleBy = newZoom / zoom;
  handleZoom(scaleBy);
}}
zoomIn={() => handleZoom(1.1)}
zoomOut={() => handleZoom(0.9)}
onUndo={handleUndo}
onRedo={handleRedo}
history={history}
future={future}
showRulers={showRulers}
toggleRulers={() => setShowRulers(prev => !prev)}
showBleeds={showBleeds}
toggleBleeds={() => setShowBleeds(prev => !prev)}
showGrids={showGrids}
toggleGrids={() => setShowGrids(prev => !prev)}
toggleReflectionsModal={() => {
  
  setShowReflectionModal(true);
  console.log('showReflectionModal...')
}}



toggleShareModal={() => {
  
  setShowShareModal(true);
  console.log('showReflectionModal...')
}}



toggleCommentModal={() => {
  
  setShowCommentModal(true);
  console.log('showModal...', setShowCommentModal)
}}
onPreview={()=>{captureBothSides();}}
bleedToggleDisabled={bleedToggleDisabled}
activeMode={faceMode}
/>

  )}
      


{mode === 'painting' &&  !isPreviewMode &&  (
  <>
    <PaintingToolbar
      brushSize={brushSize}
      onSizeChange={setBrushSize}
      brushColor={selectedColor}
      onColorChange={setSelectedColor}
    />

   <PaintingCluster
  tone={template.tone as tone}
  brushSize={brushSize}
  onBrushSizeIncrease={() => setBrushSize(brushSize+ 4)}
  onResetGrid={() => {
    console.log("Reset grid invoked");
  
    const updatedGrid = regenerateGrid(template, side);
  
    const updatedTemplate: DualTemplate = {
      ...template,
      [side]: {
        ...template[side],
        card: {
          ...template[side]?.card,
          gridColors: updatedGrid
        },
        elements: [...template[side]?.elements ?? []]
      }
    };
  
    setTemplate(updatedTemplate);
  }}
  
  onSave={handleSaveCard}
  onOpenPalette={() => {setShowPalette(prev => !prev); console.log('onPallete', showPalette)}}
  onToggleBackground={()=>{
    setMode('card')
    setShowBackground(prev => !prev);
  }}

  onBack={() => setMode('card')}
  onExitCanvas={() => {
    setModes(['front', 'back']);
    setTemplate(null);
  }}
/>




  </>
)}



{mode === 'painting' && showPalette &&  !isPreviewMode && (
  <TonePalette
    tone={template.tone as tone}
    selectedColor={selectedColor}
    onSelect={setSelectedColor}
  />
)}






     <FooterControlCluster
        stageSize={stageSize}
        template={template}
        setTemplate={setTemplate}
        setSnapshotArchive={setSnapshotArchive}
        setCavansReady={setCanvasReady}
        duplicatePage={duplicatePage}
        snapshots={snapshots}
        snapshotArchive={snapshotArchive}
        mode={mode}
        isPreviewMode={isPreviewMode}
        setIsCollapsed={setIsCollapsed}
        setShowShareModal={setShowShareModal}
        setIsFullScreen={setIsFullScreen}
        toggleFullScreen={toggleFullScreen}
        isCollapsed = {isCollapsed}
        side={side}
        activeTimestamp={activeTimestamp}
        setActiveTimestamp={setActiveTimestamp}
        zoom={zoom}
        initialZoomedOutValue={initialZoomedOutValue}
        setZoom={(newZoom:number)=>{
          const scaleBy = newZoom / zoom;
          handleZoom(scaleBy);
        }}

        setMode={()=>{setMode('card')}}
        setSide={setSide}
        setIsPreviewMode={setIsPreviewMode}

        tone={template.tone as tone}
        zoomIn={() => handleZoom(1.1)}
        zoomOut={() => handleZoom(1.9)}
        showRulers={showRulers}
        toggleRulers={() => setShowRulers(prev => !prev)}
        showBleeds={showBleeds}
        toggleBleeds={() => setShowBleeds(prev => !prev)}
        showGrids={showGrids}
        toggleGrids={() => setShowGrids(prev => !prev)}
        bleedToggleDisabled={bleedToggleDisabled}
        createPageTemplate={createPageTemplate}
        captureFrontAndBack={captureFrontAndBack}
        setHasChanged={setHasChanged}
        hasChanged={hasChanged}
        setPageAdded={setPageAdded}
        setShowPages={setShowPages}
        showPages={showPages}
    />
    </>
  );
}
