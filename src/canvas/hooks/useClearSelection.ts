
import Konva from 'konva';
import { RefObject } from 'react';

interface UseClearSelectionParams {
  setShowToolbar: (b: boolean) => void;
  setInputPosition: (pos: { x: number; y: number } | null) => void;
  setKonvaText: (k: Konva.Text | null) => void;

  // Legacy single-selection setters (optional)
  setSelectedTextId?: (id: string | null) => void;
  setSelectedImageId?: (id: string | null) => void;

  // Optional UI refs to sync height before dismissal
  textAreaRef?: RefObject<HTMLTextAreaElement | null>;
  konvaText?: Konva.Text | null;

  // Optional transform/mode resets
  resetTransformMode?: () => void;
  setModeActive?: (b: boolean) => void;
  clearSelection:() => void;

  // 🔑 New isolation setters
  setIsolationMode?: (b: boolean) => void;
  setSelectedGroupId?: (id: string | null) => void;
}

export type ClearOptions = {
  clearStoreSelection?: boolean; // default true
  clearTextSelection?: boolean;  // default false; set to true in global click dismissal
  clearImageSelection?: boolean; // default false; set to true in stage dismissal
  hideToolbar?: boolean;         // default true
  resetInput?: boolean;          // default true
  resetKonvaText?: boolean;      // default true (after syncing height)
  resetTransform?: boolean;      // default false; stage dismissal sets true
  setModeInactive?: boolean;  
  isIsolationMode?:boolean;   // default false; stage dismissal sets true
  
};

export function useClearSelection(params: UseClearSelectionParams) {
  const {
    setShowToolbar,
    setInputPosition,
    setKonvaText,
    setSelectedTextId,
    setSelectedImageId,
    textAreaRef,
    konvaText,
    resetTransformMode,
    setModeActive,
    clearSelection,
  } = params;

 

  const clearAll = (opts: ClearOptions = {}) => {
    const {
      clearStoreSelection = true,
      clearTextSelection = false,
      clearImageSelection = false,
      hideToolbar = true,
      resetInput = true,
      resetKonvaText = true,
      resetTransform = false,
      setModeInactive = false,
    } = opts;

    // 1) Store multi-selection
    if (clearStoreSelection) {
      clearSelection();
    }

    // 2) Legacy single-selection
    if (clearTextSelection && setSelectedTextId) {
      setSelectedTextId(null);
    }
    if (clearImageSelection && setSelectedImageId) {
      setSelectedImageId(null);
    }

    // 3) Overlay UI
    if (hideToolbar) setShowToolbar(false);
    if (resetInput){
        if (konvaText?.visible && textAreaRef) {
            // 🧠 Sync Konva height to overlay before dismissal
            if (textAreaRef.current) {
              const overlayHeight = textAreaRef.current.offsetHeight;
              konvaText.height(overlayHeight);
              
            }
          
            konvaText.visible(true);
            konvaText.getLayer()?.batchDraw();
          }
  
         setInputPosition(null);
    }


    if(resetKonvaText)
        setKonvaText(null);

    

    // 5) Transform/mode
    if (resetTransform && resetTransformMode) resetTransformMode();
    if (setModeInactive && setModeActive) setModeActive(false);

    if (opts.isIsolationMode) {
        console.log('clearing isIsolationMode')
        if (params.setIsolationMode) params.setIsolationMode(false);
        if (params.setSelectedGroupId) params.setSelectedGroupId(null);
      }
  };

  return { clearAll };
}
