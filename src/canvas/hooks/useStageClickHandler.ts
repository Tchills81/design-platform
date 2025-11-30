import { useCallback, RefObject } from "react";
import Konva from "konva";
import { DualTemplate } from "@/src/types/template";

// Adjust this union to match the actual keys of DualTemplate
type Side = 'front' | 'back'; // e.g. "left" | "right"

interface StageClickHandlerProps {
  stageRef: RefObject<Konva.Stage>;

  // Template state
  template: DualTemplate;
  side: Side;
  selectedTextId: string | null;
  pendingStyle: Record<string, any>;

  // Konva text overlay
  konvaText: Konva.Text | null;

  // Handlers object (your custom callbacks)
  handlers: {
    setSelectedTextId: (id: string | null) => void;
    setSelectedImageId: (id: string | null) => void;
    setSelectedGroupId: (id: string | null) => void;
    handleElementClick: (e: Konva.KonvaEventObject<MouseEvent>, id: string) => void;
    _handleTextClick: (node: Konva.Text, tabActive: boolean) => void;
    onFontSizeChange: (size: number) => void;
    setSelectedFont: (font: string) => void;
    setSelectedColor: (color: string) => void;
    setIsolationMode: (active: boolean) => void;
  };

  // Clear/reset functions
  clearAll: (options: Record<string, boolean>) => void;

  // State setters
  setTemplate: (
    updater: (prev: DualTemplate | null) => DualTemplate
  ) => void;
  setPendingStyle: (style: Record<string, any>) => void;
  setElementId: (id: string) => void;

  // Selection helpers
  addSelection: (id: string) => void;
  toggleSelection: (id: string) => void;
  selectOnly: (id: string) => void;
}

export function useStageClickHandler(props: StageClickHandlerProps) {
  const {
    stageRef,
    template,
    side,
    selectedTextId,
    pendingStyle,
    konvaText,
    handlers,
    clearAll,
    setTemplate,
    setPendingStyle,
    setElementId,
    addSelection,
    toggleSelection,
    selectOnly,
  } = props;

  return useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // --- DOM overlay checks ---
      const { clientX, clientY } = e.evt;
      const domTarget = document.elementFromPoint(clientX, clientY);
      const overlayEl = document.getElementById("text-overlay");
      const overImageBar = document.getElementById("image-tool-bar");

      if (overlayEl?.contains(domTarget) || overImageBar?.contains(domTarget)) {
        return; // ignore clicks inside overlays/toolbars
      }

      // --- Konva node checks ---
      const clickedNode = e.target;
      if (!clickedNode) return;

      const className = clickedNode.getClassName?.();
      const nodeName = clickedNode.name?.();
      const isStage = clickedNode === e.target.getStage();
      const isRect = className === "Rect";
      const isText = className === "Text";
      const isImage = className === "Image";
      const isShape = nodeName === "Shape";
      const isFrame = nodeName === "Frame";
      const isIsolationRect = nodeName === "isolationRectangle";
      const isTransformer = className === "Transformer";

      const isBackgroundRect =
        isRect &&
        !isShape &&
        !isFrame &&
        clickedNode.parent?.getClassName?.() === "Group" &&
        clickedNode.parent?.parent?.getClassName?.() === "Layer";

      const shouldShowTransform = isImage || isShape || isFrame;
      const shouldDismiss = isStage || isBackgroundRect;
      const isUnknown =
        !isImage &&
        !isShape &&
        !isFrame &&
        !isTransformer &&
        !isStage &&
        !isRect &&
        !isText;

      // --- Handle Text click ---
      if (clickedNode instanceof Konva.Text) {
        const node = clickedNode as Konva.Text;

        clearAll({
          clearImageSelection: true,
          resetTransform: true,
          setModeInactive: true,
        });

        handlers.setSelectedTextId(node.id());
        handlers.handleElementClick(e, node.id());

        if (!e.evt.shiftKey) {
          handlers._handleTextClick(node, true);
          handlers.onFontSizeChange(node.fontSize());
          handlers.setSelectedFont(node.fontFamily());
          handlers.setSelectedColor(node.fill() as string);
        }

        setElementId(node.id());
        return;
      }

      // --- Handle Image click ---
      if (clickedNode instanceof Konva.Image) {
        const node = clickedNode as Konva.Image;

        clearAll({
          clearTextSelection: true,
          hideToolbar: true,
          resetInput: true,
          resetKonvaText: true,
        });

        handlers.setSelectedImageId(node.id());
        handlers.setSelectedGroupId(null);
        handlers.handleElementClick(e, node.id());

        if (!e.evt.shiftKey) handlers.setSelectedImageId(node.id());
        setElementId(node.id());
        return;
      }

      // --- Handle Isolation rectangle ---
      if (isIsolationRect && e.evt.detail !== 2) {
        handlers.setIsolationMode(false);
        e.cancelBubble = true;
        return;
      }

      // --- Dismiss selection ---
      if (shouldDismiss || isUnknown) {
        clearAll({
          clearStoreSelection: true,
          clearImageSelection: true,
          clearTextSelection: true,
          hideToolbar: true,
          resetInput: true,
          resetKonvaText: true,
          resetTransform: true,
          setModeInactive: true,
        });
        return;
      }

      // --- Apply pending style to selected text ---
      if (shouldShowTransform && selectedTextId && template?.[side]?.elements) {
        const updatedElements = template[side].elements.map((el) =>
          el.id === selectedTextId && el.type === "text"
            ? { ...el, ...pendingStyle }
            : el
        );

        setTemplate((prev) => ({
          ...prev!,
          [side]: {
            ...prev![side],
            elements: updatedElements,
          },
        }));

        setPendingStyle({});
      }

      // --- Select and show transform ---
      if (shouldShowTransform) {
        const selectedId = clickedNode.id?.();
        if (selectedId) {
          if (e.evt.shiftKey) {
            addSelection(selectedId);
          } else if (e.evt.ctrlKey || e.evt.metaKey) {
            toggleSelection(selectedId);
          } else {
            selectOnly(selectedId);
          }
          handlers.setSelectedImageId(selectedId);
        }

        konvaText?.visible(true);
        konvaText?.getLayer()?.batchDraw();
      }
    },
    [
      stageRef,
      template,
      side,
      selectedTextId,
      pendingStyle,
      konvaText,
      handlers,
      clearAll,
      setTemplate,
      setPendingStyle,
      setElementId,
      addSelection,
      toggleSelection,
      selectOnly,
    ]
  );
}
