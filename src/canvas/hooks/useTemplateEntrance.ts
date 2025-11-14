import { useCanvasStore } from '../store/createCanvasStore';
import { DualTemplate } from '@/src/types/template';
import { TemplateDocument } from '@/src/types/template';

export function useTemplateEntrance() {
  const {
    setTemplate,
    setLastSavedTemplate,
    setDocumentTemplates,
    setDualFaces,
    setHistory,
    setFuture,
    setHasChanged,
    setMaxPageCount,
    setMode,
    setFaceMode,
    setViewMode,
    setZoom,
    setInitialZoomedOutValue,
    setHasInitializedZoom,
    setScrollPosition,
    setAnimatedCells,
    setShowToolbar,
    setShowGallery,
    setShowExportModal,
    setShowPages,
    setInsideMessage,
    setActiveTab,
    setIsCollapsed,
    setActiveIndex,
    setIsTransitioningTemplate,
    setTransformMode,
  } = useCanvasStore();

  return (
    template: DualTemplate,
    documents: TemplateDocument[] = [],
    maxPages: number = 2
  ) => {
    // 🎨 Hydrate template
    setTemplate(template);
    setLastSavedTemplate(template);
    setDualFaces([template]);
    setDocumentTemplates(documents);
    setMaxPageCount(maxPages);
    setHistory([]);
    setFuture([]);
    setHasChanged(false);

    // 🧭 Reset mode
    setMode('card');
    setFaceMode('front');
    setViewMode('default');

    // 📐 Reset layout
    setZoom(1);
    setInitialZoomedOutValue(1);
    setHasInitializedZoom(false);
    setScrollPosition({ x: 0, y: 0 });

    // 🧰 Reset UI overlays
    setShowToolbar(false);
    setShowGallery(false);
    setShowExportModal(false);
    setShowPages(false);
    setInsideMessage(null);

    // 🧠 Reset context
    setActiveTab(null);
    setIsCollapsed(true);
    setActiveIndex(null);
    setIsTransitioningTemplate(false);
    setTransformMode(null);

    // ✨ Clear animations
    setAnimatedCells(new Set());
  };
}
