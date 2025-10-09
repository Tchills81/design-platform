'use client';

import ImageToolbar from "@/src/components/ImageToolbar";
import Konva from "konva";
import { DualTemplate } from "@/src/types/template";
import { CanvasMode } from "@/src/types/CanvasMode";
import { RefObject, useState } from "react";
import { motion } from "framer-motion";

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

  return (
    <div className="fixed inset-0 flex items-center justify-end pointer-events-none z-50">
      <motion.div
        ref={imagebarRef}
        id="image-toolbar"
        className="pointer-events-auto cursor-grab bg-white shadow-lg rounded-xl p-4 flex flex-col gap-3 mb-[10vh] mr-6"
        drag
        dragMomentum={false}
      >
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
       
      </motion.div>
    </div>
  );
}
