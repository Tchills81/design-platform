import FloatingToolbar from "@/src/components/FloatingToolbar";
import TextToolbar from "@/src/components/TextToolbar";
import { CanvasMode } from "@/src/types/CanvasMode";
import { useSelectedElement } from '@/src/components/elements/useSelectedElement';
import { DualTemplate } from "@/src/types/template";

export interface TextToolbarOverlayProps {
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  //setTextAlign: React.Dispatch<React.SetStateAction<'left' | 'center' | 'right'>>;
  kovaTextAlign: (align: "left" | "center" | "right") => void;
  toggleMultiline: () => void;
  toggleUnderline: () => void;
  textAlign:"left" | "center" | "right";
  isMultiline:boolean;
  isUnderline:boolean;
  showToolbar: boolean;
  inputPosition: { x: number; y: number } | null;
  width?:number;
  height?:number;
  lineHeight?:number;
  mode: CanvasMode;
  selectedFont: string;
  selectedColor: string;
  selectedFontSize: number;
  selectedTextId?: string | null;
  template:DualTemplate | null;
  side:'front' | 'back';
  isBold: boolean;
  isItalic: boolean;
  editingText: string;
  tone: string;
  offset: number;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
  onFontSizeChange: (size: number) => void;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onTextChange: (text: string) => void;
  onTextBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  setShowCommentModal:React.Dispatch<React.SetStateAction<boolean>>;
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
  side,
  template,
  selectedTextId,
  setShowCommentModal,
  onFontChange,
  onColorChange,
  onFontSizeChange,
  onToggleBold,
  onToggleItalic,
  onTextChange,
  onTextBlur,
  onAddText,
  onRemoveText,
  exitEditingMode,
  //setTextAlign,
  kovaTextAlign,
  toggleMultiline,
  toggleUnderline,
  isMultiline,
  isUnderline,
  textAlign,
  offset
}: TextToolbarOverlayProps) {
  if (!showToolbar || !inputPosition || mode !== "card") return null;

  const { selectedElement, role } = useSelectedElement({
    selectedImageId: null,
    selectedTextId: selectedTextId,
    template:template,
    side: side
  });

  

  return (
    <FloatingToolbar position={inputPosition}>
      <div id="text-toolbar" ref={toolbarRef}>
        <TextToolbar
          selectedFont={selectedFont}
          selectedColor={selectedColor}
          selectedFontSize={selectedFontSize}
          isBold={isBold}
          isItalic={isItalic}
          offset={offset}
          role={role ?? undefined}
          tone={tone}
          toggleCommentModal={()=>{setShowCommentModal(true);}}
          onFontChange={onFontChange}
          onColorChange={onColorChange}
          onFontSizeChange={onFontSizeChange}
          onToggleBold={onToggleBold}
          onToggleItalic={onToggleItalic}
          
         
          onAddText={onAddText}
          onRemoveText={onRemoveText}
          exitEditingMode={exitEditingMode}
          onAlignChange={(align: 'left' | 'center' | 'right')=>{ kovaTextAlign(align); }}
          onToggleMultiline={()=>{toggleMultiline()}}
          onToggleUnderline={()=>{ toggleUnderline()}}
          onLineHeightChange={()=>{}}
          onWidthChange={()=>{ }}
          isMultiline={isMultiline}
          isUnderlined={isUnderline}
          textAlign={textAlign}
        />
      </div>
    </FloatingToolbar>
  );
}
