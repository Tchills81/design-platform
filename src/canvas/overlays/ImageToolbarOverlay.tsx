'use client';

import ImageToolbar from "@/src/components/ImageToolbar";
import Konva from "konva";
import { DualTemplate } from "@/src/types/template";
import { CanvasMode } from "@/src/types/CanvasMode";
import { RefObject, useState } from "react";
import { motion } from "framer-motion";
import { Group } from "konva/lib/Group";

export interface ImageToolbarOverlayProps {
  selectedImageId: string | null;
  mode: CanvasMode;
  tone: string;
  side: 'front' | 'back';
  imageRef: RefObject<Konva.Image | null>;
  cropRegion: { x: number; y: number; width: number; height: number };
  canvasBounds: { x: number; y: number; width: number; height: number };
  imagebarRef: RefObject<HTMLDivElement | null>;
  cardGridGroupRef: RefObject<Group | null>;

  handleOnUploadImage: (src: string, role: 'background' | 'element') => void;
  setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>;
  setShowCommentModal:React.Dispatch<React.SetStateAction<boolean>>;
  recordSnapshot: () => void;
  setTransformModeActive: (active: boolean) => void;
  setCropMode: (active: boolean) => void;
  onToggleCropMode: (active: boolean) => void;
  previewSrc: string | null;
  setPreviewSrc:React.Dispatch<React.SetStateAction<string | null>>;
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
  setShowCommentModal,
  setCropMode,
  onToggleCropMode,
  cardGridGroupRef,
  previewSrc,
  setPreviewSrc
}: ImageToolbarOverlayProps) {
  if (!selectedImageId || mode !== 'card') return null;

  return (
    <div className="fixed inset-0 flex items-center justify-end pointer-events-none z-50">
      
        <ImageToolbar
        setPreviewSrc={setPreviewSrc}
        previewSrc={previewSrc}
        imagebarRef={imagebarRef}
        cardGridGroupRef={cardGridGroupRef}
          selectedElementId={selectedImageId}
          handleOnUploadImage={handleOnUploadImage}
          tone={tone}
          setTemplate={setTemplate}
          side={side}
          recordSnapshot={recordSnapshot}
          setTransformModeActive={setTransformModeActive}
          setCropMode={setCropMode}
          onToggleCropMode={onToggleCropMode}
          toggleCommentModal={()=>{setShowCommentModal(true)}}
          imageRef={imageRef}
          cropRegion={cropRegion}
          canvasBounds={canvasBounds}
        />
       
      
    </div>
  );
}
