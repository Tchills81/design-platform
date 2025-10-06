'use client';

import FloatingToolbar from "@/src/components/FloatingToolbar";
import ImageToolbar from "@/src/components/ImageToolbar";
import Konva from "konva";
import { DualTemplate } from "@/src/types/template";
import { CanvasMode } from "@/src/types/CanvasMode";
import { RefObject } from "react";

export interface ImageToolbarOverlayProps {
  selectedImageId: string | null;
  mode: CanvasMode;
  tone: string;
  side: 'front' | 'back';
  imageRef: RefObject<Konva.Image | null>;
  cropRegion: { x: number; y: number; width: number; height: number };
  canvasBounds: { x: number; y: number; width: number; height: number };
  imagebarRef: RefObject<HTMLDivElement | null>;
  handleOnUploadImage: (src: string, role: 'background' | 'element') => void;
  setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>;
  recordSnapshot: () => void;
  setTransformModeActive: (active: boolean) => void;
  setCropMode: (active: boolean) => void;
  onToggleCropMode: (active: boolean) => void;
}

export default function ImageToolbarOverlay({
  selectedImageId,
  mode,
  tone,
  side,
  imageRef,
  cropRegion,
  canvasBounds,
  imagebarRef,
  handleOnUploadImage,
  setTemplate,
  recordSnapshot,
  setTransformModeActive,
  setCropMode,
  onToggleCropMode
}: ImageToolbarOverlayProps) {
  if (!selectedImageId || mode !== 'card') return null;

  const position = {
    x: canvasBounds.x + canvasBounds.width + 200, // 24px offset from canvas edge
    y: canvasBounds.y + canvasBounds.height/2 -200 // center vertically, adjust for toolbar height
  };

  return (
    <FloatingToolbar position={position}>
      <div ref={imagebarRef} id="image-toolbar">
        <ImageToolbar
          selectedElementId={selectedImageId}
          handleOnUploadImage={handleOnUploadImage}
          tone={tone}
          setTemplate={setTemplate}
          side={side}
          recordSnapshot={recordSnapshot}
          setTransformModeActive={setTransformModeActive}
          setCropMode={setCropMode}
          onToggleCropMode={onToggleCropMode}
          imageRef={imageRef}
          cropRegion={cropRegion}
          canvasBounds={canvasBounds}
        />
      </div>
    </FloatingToolbar>
  );
}
