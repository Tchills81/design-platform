import FloatingToolbar from "@/src/components/FloatingToolbar";
import TextToolbar from "@/src/components/TextToolbar";
import { CanvasMode } from "@/src/types/CanvasMode";

export interface TextToolbarOverlayProps {
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  setTextAlign: React.Dispatch<React.SetStateAction<'left' | 'center' | 'right'>>;
  setIsMultline: React.Dispatch<React.SetStateAction<boolean>>
  setIsUnderline: React.Dispatch<React.SetStateAction<boolean>>
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
  setTextAlign,
  setIsUnderline,
  setIsMultline,
  isMultiline,
  isUnderline,
  textAlign,
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
          onAlignChange={(align: 'left' | 'center' | 'right')=>{ setTextAlign(align); }}
          onToggleMultiline={()=>{setIsMultline(prev=>!prev)}}
          onToggleUnderline={()=>{ setIsUnderline(prev=>!prev)}}
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
