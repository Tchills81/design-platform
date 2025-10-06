import SidebarSection from "./SidebarSection";
import { CanvasMode } from "../types/CanvasMode";
import { tone } from "../types/tone";
import { DualTemplate } from "../types/template";
import { ToneButton } from "./ToneButton";
import {Book, BookOpen, CopyPlus} from 'lucide-react';


interface FaceSectionSwitcherProps {
  tone: tone;
  availableModes: CanvasMode[];
  activeMode: CanvasMode;
  template: DualTemplate | null;
  lastSavedTemplate:DualTemplate | null;
  setLastSavedTemplate:(template:DualTemplate | null)=>void;
  handleTemplateSelect:(tpl:DualTemplate)=>void;
  onSelectMode: (mode: CanvasMode) => void;
  onAddInsideFace?: () => void;
}

export default function FaceSectionSwitcher({
    tone,
    availableModes,
    activeMode,
    onSelectMode,
    onAddInsideFace,
    template,
    lastSavedTemplate,
    setLastSavedTemplate,
    handleTemplateSelect
  }: FaceSectionSwitcherProps) {
    const hasInside = availableModes.includes("insideFront") || availableModes.includes("insideBack");
    const hasFrontBack = availableModes.includes("front") || availableModes.includes("back");
    const insideFaces = availableModes.filter(mode => mode.startsWith("inside"));
    const frontBackFaces = availableModes.filter(mode => mode === "front" || mode === "back");

    const showAddInsideButton = hasFrontBack && !hasInside && onAddInsideFace;
    const totalFaces = availableModes.length;


    const isInside = activeMode.startsWith("inside");
    const isFront = activeMode.endsWith("Front");
    const isBack = activeMode.endsWith("Back");

    const activeLabel = isInside
          ? `Inside ${isFront ? "Front" : "Back"}`
          : `Face ${isFront ? "Front" : "Back"}`;


  
    return (
      <SidebarSection label="Faces" isOpen={true}>
        <>

        {!hasInside && onAddInsideFace && (
        

        <ToneButton 
            icon={<CopyPlus/>} 
            label='Add Inside Dual' 
            tone={template?.tone}
           
            onClick={() =>  onAddInsideFace()} 
          />
          
        
      )}

      {hasInside && (
        <div className="flex flex-col gap-2 mt-2">
        <div className="flex flex-wrap gap-2">
          <ToneButton 
            icon={<BookOpen />} 
            label={`Inside Faces (${insideFaces.length}/${totalFaces})`} 
            tone={template?.tone}
            disabled={activeMode === "insideFront" || activeMode === "insideBack"}
            onClick={() => onSelectMode("insideFront")} 
          />
          
          {hasFrontBack && (
            <ToneButton 
              icon={<Book />} 
              label={`Front & Back (${frontBackFaces.length}/${totalFaces})`} 
              tone={template?.tone}
              disabled={activeMode === "front" || activeMode === "back"}
              onClick={() => onSelectMode("front")}
            />
          )}
        </div>
      
        <span className="text-xs text-neutral-500 mt-1">
          Active: {activeLabel}
        </span>
      </div>
      
      )}
        </>
        
      </SidebarSection>
    );
  }
  