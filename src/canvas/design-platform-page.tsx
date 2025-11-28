'use client';
// design-platform/page.tsx

import { useCanvasState } from "@/src/canvas/hooks/useCanvasState";
import { useCanvasActions } from "@/src/canvas/hooks/useCanvasActions";
import { useCanvasEffects } from "@/src/canvas/hooks/useCanvasEffects";




import { ExportRitualModal } from "@/src/components/ExportRitualModal";


import TextToolbarOverlay from "@/src/canvas/overlays/TextToolbarOverlay";
import ImageToolbarOverlay from "@/src/canvas/overlays/ImageToolbarOverlay";
import SnapshotGalleryOverlay from "@/src/canvas/overlays/SnapshotGalleryOverlay";
import { unstable_batchedUpdates } from 'react-dom';

import CanvasControls from "@/src/canvas/controls/CanvasControls";

import CanvasStage from "@/src/canvas/controls/CanvasStage";


import CanvasMetadata from "@/src/canvas/controls/CanvasMetadata";
import { tone } from "@/src/types/tone";

import CardGridBackground from "@/src/components/CardGridBackground";
import GridBackground from "@/src/components/GridBackground";

import ShareModal from "@/src/modals/ShareModal";
import ReflectionModal from "@/src/modals/ReflectionModal";
import CommentModal from "@/src/modals/CommentModal";
import { DOMViewport } from "@/src/components/DOMViewport";
import { ThumbnailStrip } from "@/src/components/ThumbnailStrip";
import { CanvasMode } from "@/src/types/CanvasMode";
import { SnapshotEntry } from "@/src/types/SnapshotEntry";
import { normalizeDualTemplate } from "@/src/utils/normalizeDualTemplate";

import { renderToCanvas } from "@/src/utils/renderToCanvas";
import { PreviewModal } from "@/src/components/PreviewModal";

import { ModalThumbnailStrip } from "@/src/components/ModalThumbnailStrip";
import TextOverlayInput from "@/src/components/TextOverlayInput";
import { SidebarTabs } from "@/src/components/SidebarTabs";
import { SidebarPanel } from "@/src/components/SidebarPanel";

import { TabContext } from "@/src/canvas/hooks/TabContext";
import { TextOverlayControls } from "../components/text/TextOverlayControls";
import { useLock } from "./hooks/useTextLock";
import { LockType, useSafeLock } from "../types/access";
import { useSelectedElement } from "../components/elements/useSelectedElement";
import { useUnifiedOverlayPosition } from "./hooks/useOverlayPosition";


export default function DesignPlatformPage() {
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
    reflections,
    showShareModal,
    showCommentModal,
    elementId,
    setTextAlign,
    setIsMultline,
    setIsUnderline,
    isMultiline,
    isUnderline,
    textAlign,
    stageRef,
    accessLevel,
    zoom,
    initialZoomedOutValue,
    hasInitializedZoom,
    position,
    gridPosition,
    overlayStyle,
    activeTimestamp,
    hasChanged,
    showPages,
    stripRef,
    isPreviewing,
    previewEntry,
    isPreviewMode,
    isCollapsed,
    activeIndex,
    overlayProps,
    konvaText,
    textToolbarRef,
    footerClusterRef,
    sideBarRef,
    topBarRef,
    cardGridGroupRef,
    previewSrc,
    activeTab,
    SIDEBAR_WIDTH,
    PANEL_WIDTH,
    SidebarTabsRef,
    PanelRef,
    templateReady,
    selectedDualTemplate,
    canvasReady,
   
    duplicateTextById,
    deleteTextById,
    textControlsRef,
    textControlPosition,
    textAreaRef,
    lockedTextIds,
    setLockedTextIds,
    domPos,
    boundingBox,
    isMarqueeActive,
    selectedIds,
    elementsGrouped,
    setElementsGrouped,
    selectedGroupId,
    isIsolationMode,

    //currentSelectedElement
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
    setShowCommentModal,
    setReflections,
    setShowShareModal,
    setDesignElement,
    setAccessLevel,
    handleInvite,
    setDualFaces,
    resetDesign,
    setZoom,
    createPageTemplate,
    setActiveTimestamp,
    setCanvasReady,
    duplicatePage,
    captureFrontAndBack,
    setHasChanged,
    setPageAdded,
    setShowPages,
    setDocumentTemplates,
    handlePreview,
    closePreview,
    setIsPreviewMode,
    setIsCollapsed,
    setActiveIndex,
    setIsFullScreen,
    toggleFullScreen,
    setPreviewSrc,
    setActiveTab,
    setStageSize,
    setPosition,
    setStageStyle,
    recenterCanvas,
    kovaTextAlign,
    toggleMultiline,
    toggleUnderline,
   duplicatedElement,
   deleteElementById,
   groupSelectedElements,
   
    
  } = actions;

  
  if(!selectedDualTemplate || !template) return;


  //console.log(selectedGroupId, selectedTextId, selectedImageId)


  

   const { selectedElement:selectedElement, role } = useSelectedElement({
      selectedImageId: selectedImageId ?? null,
      selectedTextId: selectedTextId ?? null,
      selectedGroupId:selectedGroupId ?? null,
      template:template,
      side: side
    });

  console.log('selected element ',selectedElement, 'mode', isIsolationMode);


  const {
    currentLock: currentTextLock,
    toggle: currentTextToggle,
    setLockType: setTextLockType,
  } = useSafeLock(selectedTextId, "position", template, side, setTemplate);
  
  const {
    currentLock: currentImageLock,
    toggle: currentImageToggle,
    setLockType: setImagetLockType,
  } = useSafeLock(selectedImageId, "position", template, side, setTemplate);
  

  const {
    currentLock: currentGroupLock,
    toggle: currentGroupToggle,
    setLockType: setGroupLockType,
  } = useSafeLock(selectedGroupId, "position", template, side, setTemplate);


  const type=role ?? selectedElement?.type;

  let lockProps;
if (type === "group") {
  lockProps = {
    currentLock: currentGroupLock,
    onToggleLock: currentGroupToggle,
    onChangeLockType: setGroupLockType,
  };
} else if (selectedElement?.type === "image") {
  lockProps = {
    currentLock: currentImageLock,
    onToggleLock: currentImageToggle,
    onChangeLockType: setImagetLockType,
  };
} else if (selectedElement?.type === "text") {
  lockProps = {
    currentLock: currentTextLock,
    onToggleLock: currentTextToggle,
    onChangeLockType: setTextLockType,
  };
} else {
  lockProps = {
    currentLock: "none" as LockType,
    onToggleLock: () => {},
    onChangeLockType: () => {},
  };
}


const overlayPos= useUnifiedOverlayPosition(selectedElement, domPos, inputPosition, boundingBox)


const isMarqueeSelection = !selectedElement && selectedIds.length > 1;


  

  

  if (!selectedDualTemplate) {
    return <div className="loader text-center pt-32 text-muted">Preparing design ritual…</div>;
  }

 
  const card = { width: template.width, height: template.height };

  




  //console.log('selectedElement', selectedElement)

  
  return (
    <>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>

<TabContext.Provider value={[activeTab, setActiveTab]}>
      {/* 🧭 Sidebar Tabs + Panel */}
      <div
        style={{
          position: 'absolute',
          top: 54,
          left: 0,
          width: activeTab ? 385 : 60,
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 50
        }}
      >
        {/* Tabs */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 60,
            height: '100vh',
            pointerEvents: 'auto'
          }}
        >
          <SidebarTabs
          SidebarTabsRef={SidebarTabsRef}
        
          hasInitializedZoom={hasInitializedZoom}
          tone={template.tone}
           SIDEBAR_WIDTH={SIDEBAR_WIDTH}
           PANEL_WIDTH={PANEL_WIDTH}
          setStageStyle={setStageStyle}
          recenterCanvas={recenterCanvas}
        />
        </div>

        {/* Panel */}
        {activeTab && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 60,
              width: 280,
              height: '100vh',
              pointerEvents: 'auto'
            }}
          >
           <SidebarPanel
           PanelRef={PanelRef}
           tone={template.tone}
           PANEL_WIDTH={PANEL_WIDTH}
           handleTemplateSelect={handleTemplateSelect}
           resetDesign={resetDesign}
           onClose={() => {
                 console.log('closingn...', activeTab)
                 setActiveTab(null);
                hasInitializedZoom.current = false;
            }}
/>

          </div>
        )}
      </div>
    </TabContext.Provider>

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

    {/* 🧭 Sidebar Tabs */}
  


    

<PreviewModal
  entry={previewEntry}
  snapshots={snapshotArchive}
  isOpen={isPreviewing}
  onClose={closePreview}
  handlePreview={handlePreview}
  zoom={zoom}
  setZoom={setZoom}
/>

      
      <CanvasControls
        setPreviewSrc={setPreviewSrc}
        snapshots={snapshots}
        snapshotArchive={snapshotArchive}
        designElements={designElements}
        template={template}
        canvasWidth={canvasBounds.width}
        canvasHeight={canvasBounds.height}
        cardX={canvasBounds.x}
        cardY={canvasBounds.y}
        mode={mode}
        modes={modes}
        setIsPreviewMode={setIsPreviewMode}
        setIsCollapsed={setIsCollapsed}
        setIsFullScreen={setIsFullScreen}
        toggleFullScreen={toggleFullScreen}
        isCollapsed={isCollapsed}
        isPreviewMode={isPreviewMode}
        faceMode={faceMode}
        setFaceMode={setFaceMode}
        setModes={setModes}
        side={side}
        activeTimestamp={activeTimestamp}
        setActiveTimestamp={setActiveTimestamp}
        brushSize={brushSize}
        selectedColor={selectedColor}
        showRulers={showRulers}
        showBleeds={showBleeds}
        showGrids={showGrids}
        bleedToggleDisabled={bleedToggleDisabled}
        selectedTextId={selectedTextId}
        selectedImageId={selectedImageId}
        stageSize={stageSize}
        zoom={zoom}
        initialZoomedOutValue={initialZoomedOutValue}
        hasInitializedZoom={hasInitializedZoom}
        setZoom={setZoom}
        setMode={setMode}
        setSide={setSide}
        setTemplate={actions.setTemplate}
        setSnapshotArchive={setSnapshotArchive}
        setShowRulers={setShowRulers}
        setShowBleeds={setShowBleeds}
        setShowGrids={setShowGrids}
        setBrushSize={setBrushSize}
        setShowBackground={setShowBackground}
        setShowReflectionModal={setShowReflectionModal}
        setShowCommentModal={setShowCommentModal}
        setShowShareModal={setShowShareModal}
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
        createPageTemplate={createPageTemplate}
        setCanvasReady={setCanvasReady}
        duplicatePage={duplicatePage}
        captureFrontAndBack={captureFrontAndBack}
        setHasChanged={setHasChanged}
        hasChanged={hasChanged}
        setPageAdded={setPageAdded}
        setShowPages={setShowPages}
        showPages={showPages}
        footerClusterRef={footerClusterRef}
        topBarRef={topBarRef}
        sideBarRef={sideBarRef}
        
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




{mode === 'painting' && (
  
    <CardGridBackground
     x={position.x}
     y={position.y}
      width={template.width}
      height={template.height}
      zoom={zoom}
      cellSize={cellSize}
      stroke={template.tone === 'dark' ? '#444' : '#f0f0f0'}
      cols={cols}
      rows={rows}
      side={side}
      getCellColor={(col: number, row: number) => {
        const index = row * cols + col;
        return gridColors?.[index] || '#000000';
      }}
      previewColor={selectedColor}
      onAverageColorChange={setDynamicBackground}
      onCellPaint={handleCellPaint}
      style={overlayStyle}
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

   

  




      {template && snapshots.back !== null && snapshots.front !== null &&  showPages==true && (
                  <ThumbnailStrip
                    stripRef={stripRef}
                    activeSide={side}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    showPages={showPages}
                    isPreviewMode={isPreviewMode}
                    activeTimestamp={activeTimestamp}
                    template={template}
                    snapshots={snapshotArchive}
                    setDocumentTemplates={setDocumentTemplates}
                    onSelect={async (entry, index) => {
                      const { side: page, timestamp, template: snapshotTemplate } = entry;
                    
                      /*unstable_batchedUpdates(() => {
                        setActiveIndex(index);
                      });*/
                    
                      if (hasChanged) {
                        const updatedTemplate = { ...template };
                        updatedTemplate[page] = template[page];
                    
                        const captured = await captureFrontAndBack();
                        const updatedImage = side === 'front' ? captured.front : captured.back;
                    
                        unstable_batchedUpdates(() => {
                          setSnapshotArchive(prev =>
                            prev.map(e =>
                              e.timestamp === activeTimestamp && e.side === side
                                ? { ...e, image: updatedImage, template: updatedTemplate }
                                : e
                            )
                          );
                        });
                      }
                    
                      const normalized = normalizeDualTemplate(snapshotTemplate);
                    
                      unstable_batchedUpdates(() => {
                        setTemplate(normalized);
                      });
                    
                      if (timestamp !== activeTimestamp || page !== side) {
                        renderToCanvas(normalized, setTemplate, setMode, page, () => {
                          unstable_batchedUpdates(() => {
                            setSide(page);
                            setActiveTimestamp(timestamp);
                          });
                        });
                      }
                    }}
                    onAddPage={() => createPageTemplate(1)}
                    onDuplicatePage={() => {
                      setPageAdded(true);
                      setCanvasReady(true);
                    }}
                  />
                )}



     
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


{showToolbar && inputPosition &&  mode === 'card' && (
  <div ref={textToolbarRef} id="text-toolbar">
    <TextToolbarOverlay
      template={template}
      side={side}
      selectedTextId={selectedTextId}
      toolbarRef={textToolbarRef}
      selectedFont={selectedFont}
      onFontChange={onFontChange}
      selectedColor={selectedColor}
      onColorChange={onColorChange}
      onFontSizeChange={onFontSizeChange}
      selectedFontSize={selectedFontSize}
      isBold={isBold}
      isItalic={isItalic}
      setShowCommentModal={setShowCommentModal}
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
      kovaTextAlign={kovaTextAlign}
      toggleMultiline={toggleMultiline}
      toggleUnderline={toggleUnderline}
      isMultiline={isMultiline}
      isUnderline={isUnderline}
      textAlign={textAlign}
      mode={mode}
      offset={activeTab?PANEL_WIDTH+SIDEBAR_WIDTH:0}
      />



      


  </div>
)}

{showToolbar && (
  <>
  <TextOverlayInput
  textAreaRef={textAreaRef}
  template={template}
  toolbarRef={toolbarRef}
  inputPosition={inputPosition}
  editingText={editingText}
  onTextChange={onTextChange}
  onTextBlur={()=>{}}
  selectedFont={selectedFont}
  selectedFontSize={selectedFontSize}
  setSelectedFontSize={actions.setSelectedFontSize}
  onFontSizeChange={onFontSizeChange}
  selectedColor={selectedColor}
  isMultiline={isMultiline}
  isUnderline={isUnderline}
  isBold={isBold}
  isItalic={isItalic}
  textAlign={konvaText?.align() as 'left' | 'center' | 'right'}
  width={konvaText?.width() ?? 0}
  height={konvaText?.height() ?? 0}
  lineHeight={konvaText?.lineHeight()}
  zoom={zoom}
  tone={template.tone as tone}
  konvaText={konvaText}
  currentLock={currentTextLock as LockType}
  
/>







</>
)}




{showShareModal && (
  <ShareModal
  isOpen={showShareModal}
  onClose={() => setShowShareModal(false)}
  isPreviewMode={isPreviewMode}
  shareLink={"www.giftcraft.com/generatedLink/userId/templateId/designId/"}
  accessLevel={accessLevel}
  onAccessChange={setAccessLevel}
  onInvite={handleInvite}
  />
)}

{showReflectionModal && (
  <ReflectionModal 
    isOpen={true}
    konvaStageRef={stageRef}
    reflections={reflections}
    onClose={() => setShowReflectionModal(false)}
  />
)}



{showCommentModal && (
  <CommentModal
  template={template}
  side={side}
  selectedTextId={selectedTextId}
    isOpen={true}
    designId={template.id}
    elementId={elementId}
    createdBy="tobias" // Replace with actual user context
    onClose={() => setShowCommentModal(false)}
    onSubmitSuccess={() => {
      // Refresh reflections
      fetch(`/api/reflections?designId=${template.id}`)
        .then(res => res.json())
        .then(data => setReflections(data));
    }}
  />
)}





{selectedImageId && mode==="card" && (
<>

<ImageToolbarOverlay 
setPreviewSrc={setPreviewSrc}
previewSrc={previewSrc}
cardGridGroupRef={cardGridGroupRef}
selectedImageId={selectedImageId}
handleOnUploadImage={handleOnUploadImage}
tone={template.tone}
template={template}
setTemplate={setTemplate}
side={side}
recordSnapshot={recordSnapshot}
setTransformModeActive={setTransformModeActive}
setCropMode={setModeActive}
onToggleCropMode={setModeActive}
setShowCommentModal={setShowCommentModal}
imageRef={imageRef}
cropRegion={cropRegion}
canvasBounds={canvasBounds}
mode={mode}
imagebarRef={imagebarRef}
/>


</>

   )}



   {(selectedElement || selectedIds.length > 1) && (
    <>
    <TextOverlayControls
  elementId={isMarqueeSelection ? null : selectedElement?.id ?? null}
  position={isMarqueeSelection ? boundingBox?.stage ?? {x:0,y:0} : overlayPos}
  currentLock={isMarqueeSelection ? "none" as LockType : lockProps.currentLock}
  onToggleLock={isMarqueeSelection ? () => {} : lockProps.onToggleLock}
  onChangeLockType={isMarqueeSelection ? () => {} : lockProps.onChangeLockType}
  onDuplicate={isMarqueeSelection ? () => {} : duplicatedElement}
  onDelete={isMarqueeSelection ? () => {} : deleteElementById}
  textControlsRef={textControlsRef}
  isMarqueeActive={isMarqueeSelection}
  elementsGrouped={elementsGrouped}
  groupSelectedElements={groupSelectedElements}
  setElementsGrouped={setElementsGrouped}
  selectedGroupId={selectedGroupId}
  isIsolationMode={isIsolationMode}
  length={selectedIds.length}
  tone={template.tone as tone}
/>


    </>
   )}





      

     
      {showExportModal && (
        <ExportRitualModal
          snapshots={snapshots}
          tone={template.tone as "minimal" | "reflective" | "warm" | "playful"}
          onClose={() => setShowExportModal(false)}
        />
      )}


      
    </div>


    


   </div>

    </>
  );
}
