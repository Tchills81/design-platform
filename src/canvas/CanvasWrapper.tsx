// src/canvas/CanvasWrapper.tsx

import { useCanvasState } from "./hooks/useCanvasState";
import { useCanvasActions } from "./hooks/useCanvasActions";
import { useCanvasEffects } from "./hooks/useCanvasEffects";

import TabNavigator from "../components/TabNavigator";
import { ExportRitualModal } from "../components/ExportRitualModal";

import TextToolbarOverlay from "./overlays/TextToolbarOverlay";
import ImageToolbarOverlay from "./overlays/ImageToolbarOverlay";
import SnapshotGalleryOverlay from "./overlays/SnapshotGalleryOverlay";

import CanvasControls from "./controls/CanvasControls";
import CanvasStage from "./controls/CanvasStage";
import CanvasMetadata from "./controls/CanvasMetadata";
import { tone } from "../types/tone";
import CardGridBackground from "../components/CardGridBackground";
import GridBackground from "../components/GridBackground";
import ShareModal from "../modals/ShareModal";
import { useEffect } from "react";

export default function CanvasWrapper() {
  const state = useCanvasState();
  const actions = useCanvasActions(state);
  useCanvasEffects(state, actions);

  const {
    designElements,
    template,
    lastSavedTemplate,
    showGallery,
    showExportModal,
    snapshotArchive,
    setSnapshotArchive,
    designComplete,
    snapshots,
    setShowExportModal,
    viewMode,
    setViewMode,
    designInside,
    setDesignInside,
    setInsideMessage,
    mode,
    faceMode,
    setModes,
    modes,
    side,
    brushSize,
    selectedColor,
    showRulers,
    showBleeds,
    showGrids,
    bleedToggleDisabled,
    selectedTextId,
    selectedImageId,
    activateTransformMode,
    setTransformModeActive,
    selectedFontSize,
    selectedFont,
    isBold,
    isItalic,
    showToolbar,
    editingText,
    inputPosition,
    imageRef,
    imagebarRef,
    offsetBounds,
    cropRegion,
    cardX,
    cardY,
    cellSize,
    cols,
    rows,
    gridColors,
    stageSize,
    containerRef,
    toolbarRef,
    canvasBounds,
    dualFaces,
    history,
    future,
    showReflectionModal,
    
    
  } = state;

  const {
    handleTemplateSelect,
    handleUndo,
    handleRedo,
    handleZoom,
    handleSaveCard,
    handleOnUploadImage,
    handleAddText,
    handleRemoveText,
    captureBothSides,
    handleSaveToArchive,
    handleRenderBlankTemplate,
    setLastSavedTemplate,
    handlePrint,
    setMode,
    setFaceMode,
    setSide,
    setTemplate,
    setShowRulers,
    setShowBleeds,
    setShowGrids,
    setBrushSize,
    setSelectedColor,
    setCropRegion,
    setDesignComplete,
    showDesignView,
    onTextChange,
    onFontChange,
    onColorChange,
    onFontSizeChange,
    handleCellPaint,
    handleTextClick,
    handleTextBlur,
    exitEditingMode,
    handleImageUpdate,
    handleToggleItalic,
    handleToggleBold,
    recordSnapshot,
    setModeActive,
    setDynamicBackground,
    setShowBackground,
    setShowReflectionModal,
    setDesignElement,
    setDualFaces,
    resetDesign,
    
  } = actions;

  if (!template) {
    return (
      <div className="fade-in relative pt-20 pl-6">
        <TabNavigator
          userId="chilongatobias@gmail.com"
          onSelect={handleTemplateSelect}
          snapshotArchive={snapshotArchive}
          setSnapshotArchive={setSnapshotArchive}
          setDualFaces={setDualFaces}
          showDesigns={designComplete}
        />
      </div>
    );
  }

  const card = { width: template.width, height: template.height };

  
  return (
    <div ref={containerRef}
    id="canvas-container"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      
      <CanvasControls
        designElements={designElements}
        template={template}
        canvasWidth={canvasBounds.width}
        canvasHeight={canvasBounds.height}
        cardX={canvasBounds.x}
        cardY={canvasBounds.y}
        mode={mode}
        modes={modes}
        faceMode={faceMode}
        setFaceMode={setFaceMode}
        setModes={setModes}
        side={side}
        brushSize={brushSize}
        selectedColor={selectedColor}
        showRulers={showRulers}
        showBleeds={showBleeds}
        showGrids={showGrids}
        bleedToggleDisabled={bleedToggleDisabled}
        selectedTextId={selectedTextId}
        selectedImageId={selectedImageId}
        setMode={setMode}
        setSide={setSide}
        setTemplate={setTemplate}
        setShowRulers={setShowRulers}
        setShowBleeds={setShowBleeds}
        setShowGrids={setShowGrids}
        setBrushSize={setBrushSize}
        setShowBackground={setShowBackground}
        setShowReflectionModal={setShowReflectionModal}
        setDesignElement={ setDesignElement}
        setSelectedColor={setSelectedColor}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleZoom={handleZoom}
        handleSaveCard={handleSaveCard}
        captureBothSides={captureBothSides}
        handleAddText={handleAddText}
        handleRemoveText={handleRemoveText}
        activateTransformMode={activateTransformMode} // ✅ now correctly passed
        handleOnUploadImage={handleOnUploadImage}
        handleRenderBlankTemplate={handleRenderBlankTemplate}
        setLastSavedTemplate={setLastSavedTemplate}
        lastSavedTemplate={lastSavedTemplate}
        handleTemplateSelect={handleTemplateSelect}
        dualFaces={dualFaces}
        setDualFaces={setDualFaces}
        history={history}
        future={future}
        resetDesign={resetDesign}
        
      />




{showGrids && (
  <>
  <GridBackground
  width={stageSize.width}
  height={stageSize.height}
  cellSize={20}
  style={{ zIndex: 0, opacity: 1 }}
/>
  </>

  


)} 


<CanvasMetadata template={template} />


  

{mode=="painting" &&(
  <CardGridBackground
  width={card.width}
  height={card.height}
  x={cardX}
  y={cardY}
  cellSize={cellSize}
  stroke={template.tone === 'dark' ? '#444' : '#f0f0f0'}
  cols={cols}
  rows={rows}
  side={side}
  getCellColor={(col:number, row:number) => {
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

       <CanvasStage
        template={state.template}
        mode={state.mode}
        side={state.side}
        setTemplate={actions.setTemplate}
        handleOnUploadImage={actions.handleOnUploadImage}
        setCropRegion={actions.setCropRegion}
        state={state}
        actions={actions}

      />
      <SnapshotGalleryOverlay
        snapshots={snapshots}
        showGallery={showGallery}
        template={template}
        card={card}
        viewMode={viewMode}
        designInside={designInside}
        mode={mode}
        handleSaveToArchive={handleSaveToArchive}
        handleRenderBlankTemplate={handleRenderBlankTemplate}
        designComplete={designComplete}
        setDesignComplete={setDesignComplete}
        setDesignInside={setDesignInside}
        showDesignView={showDesignView}
        setInsideMessage={setInsideMessage}
        setViewMode={setViewMode}
        handleSaveCard={handleSaveCard}
        handlePrint={handlePrint}
        setShowExportModal={setShowExportModal}
        showCompleteDesign={showDesignView}
      />


{showToolbar && inputPosition && mode === 'card' && (
  <div ref={toolbarRef} id="text-toolbar">
    <TextToolbarOverlay
      toolbarRef={toolbarRef}
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
      showToolbar={showToolbar}
      inputPosition={inputPosition}
      mode={mode}
      />

  </div>
)}



{showReflectionModal && (
  <ShareModal
  isOpen={true}
  shareLink=""
  onClose={()=>{}}
  onInvite={()=>{}}
  onAccessChange={()=>{}}
  accessLevel="view"/>
)}

      

      <ImageToolbarOverlay 
      selectedImageId={selectedImageId}
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
      canvasBounds={canvasBounds}
      mode={mode}
      imagebarRef={imagebarRef}
     />
      {showExportModal && (
        <ExportRitualModal
          snapshots={snapshots}
          tone={template.tone as "minimal" | "reflective" | "warm" | "playful"}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
