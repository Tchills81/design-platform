import FloatingToolbar from "@/src/components/FloatingToolbar";
import TextToolbar from "@/src/components/TextToolbar";
import { CanvasMode } from "@/src/types/CanvasMode";

export interface TextToolbarOverlayProps {
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  showToolbar: boolean;
  inputPosition: { x: number; y: number } | null;
  mode: CanvasMode;
  selectedFont: string;
  selectedColor: string;
  selectedFontSize: number;
  isBold: boolean;
  isItalic: boolean;
  editingText: string;
  tone: string;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
  onFontSizeChange: (size: number) => void;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onTextChange: (text: string) => void;
  onTextBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onAddText: () => void;
  onRemoveText: () => void;
  exitEditingMode: () => void;
}

export default function TextToolbarOverlay({
  toolbarRef,
  showToolbar,
  inputPosition,
  mode,
  selectedFont,
  selectedColor,
  selectedFontSize,
  isBold,
  isItalic,
  editingText,
  tone,
  onFontChange,
  onColorChange,
  onFontSizeChange,
  onToggleBold,
  onToggleItalic,
  onTextChange,
  onTextBlur,
  onAddText,
  onRemoveText,
  exitEditingMode
}: TextToolbarOverlayProps) {
  if (!showToolbar || !inputPosition || mode !== "card") return null;

  return (
    <FloatingToolbar position={inputPosition}>
      <div id="text-toolbar" ref={toolbarRef}>
        <TextToolbar
          selectedFont={selectedFont}
          selectedColor={selectedColor}
          selectedFontSize={selectedFontSize}
          isBold={isBold}
          isItalic={isItalic}
          editingText={editingText}
          tone={tone}
          onFontChange={onFontChange}
          onColorChange={onColorChange}
          onFontSizeChange={onFontSizeChange}
          onToggleBold={onToggleBold}
          onToggleItalic={onToggleItalic}
          onTextChange={onTextChange}
          onTextBlur={onTextBlur}
          onAddText={onAddText}
          onRemoveText={onRemoveText}
          exitEditingMode={exitEditingMode}
        />
      </div>
    </FloatingToolbar>
  );
}
