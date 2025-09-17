import React, { useState } from 'react';
import { ToggleCheckbox } from './ToggleCheckbox';
import { ToneButton } from './ToneButton';
import { AddImageButton } from './AddImageButton';
import { Crop, XIcon, Type, Check } from 'lucide-react';
import { ImageTools, TemplateSideKey } from '../utils/imageTools';
import { DualTemplate } from '../types/template';

import Konva from 'konva';

import { cropImageFromNode } from './cropImageFromNode';

import { cropRenderedRegion } from '../utils/cropRenderedRegion';


type ImageToolbarProps = {
  selectedElementId: string | null;
  handleOnUploadImage: (src: string, role: 'background' | 'element') => void;
  setTransformModeActive?: (enabled: boolean) => void;
  tone: string;
  side: TemplateSideKey;
  setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>;
  recordSnapshot: () => void;
  onToggleCropMode?: (enabled: boolean) => void;
  setCropMode: (enabled: boolean) => void;

  imageRef?: React.RefObject<Konva.Image | null>; // pass this from parent
  cropRegion?: { x: number; y: number; width: number; height: number };
  canvasBounds?: { x: number; y: number };
};

const ImageToolbar: React.FC<ImageToolbarProps> = ({
  selectedElementId,
  handleOnUploadImage,
  tone,
  side,
  setTemplate,
  recordSnapshot,
  onToggleCropMode,
  setTransformModeActive,
  setCropMode,
  imageRef,
  cropRegion,
  canvasBounds,
}) => {
  const isElementSelected = !!selectedElementId;
  const [isCropMode, setIsCropMode] = useState(false);

  const handleResizeClick = () => {
    if (!selectedElementId || !setTransformModeActive) return;
    setTransformModeActive(true);
  };

  const handleCropClick = () => {
    if (!selectedElementId) return;
    setIsCropMode(true);
    setCropMode(true);
    onToggleCropMode?.(true);
  };

  const handleRemoveClick = () => {
    if (!selectedElementId) return;
    ImageTools.remove(selectedElementId, side, setTemplate, recordSnapshot);
  };

  

  const handleCropConfirm = () => {


    console.log("imageRef?.current", imageRef?.current, 
        "cropRegion", cropRegion, 
        "selectedElementId", selectedElementId,
       "canvasBounds", canvasBounds)
    
     //console.log("imageRef?.current", imageRef?.current, "cropRegion", cropRegion, "selectedElementId", selectedElementId)
    if (!imageRef?.current || !cropRegion || !canvasBounds || !selectedElementId) return;

    

    const layer = imageRef.current?.getLayer();
    const croppedSrc = layer ? cropRenderedRegion(layer, cropRegion) : null;
    if (!croppedSrc) return;

    setTemplate(prev => {
      if (!prev) return prev;

      const updatedElements = prev[side]?.elements.map(el => {
        if (el.id === selectedElementId && el.type === 'image') {
          return {
            ...el,
            src: croppedSrc,
            size: {
              width: cropRegion.width,
              height: cropRegion.height,
            },
            position: {
              x: cropRegion.x - canvasBounds.x,
              y: cropRegion.y - canvasBounds.y,
            },
          };
        }
        return el;
      });

      return {
        ...prev,
        [side]: {
          ...prev[side],
          elements: updatedElements,
        },
      };
    });

    recordSnapshot();
    setIsCropMode(false);
    setCropMode(false);
    onToggleCropMode?.(false);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-50 rounded-xl shadow-lg px-4 py-5 min-w-[340px] font-sans flex flex-col gap-4">
      <AddImageButton tone={tone} onUpload={handleOnUploadImage} />

      <ToneButton
        label="Resize"
        icon={<Type size={18} />}
        tone={tone}
        fontSize="text-sm"
        isActive={false}
        onClick={handleResizeClick}
        disabled={!isElementSelected}
      />

      <ToneButton
        label="Crop"
        icon={<Crop size={18} />}
        tone="green"
        fontSize="text-sm"
        isActive={isCropMode}
        onClick={handleCropClick}
        disabled={!isElementSelected}
      />

      {isCropMode && (
        <ToneButton
          label="Confirm Crop"
          icon={<Check size={18} />}
          tone={tone}
          fontSize="text-sm"
          isActive={false}
          onClick={handleCropConfirm}
          disabled={!imageRef?.current || !cropRegion}
        />
      )}

      <ToneButton
        label="Remove"
        icon={<XIcon size={18} />}
        tone="danger"
        fontSize="text-sm"
        isActive={false}
        onClick={handleRemoveClick}
        disabled={!isElementSelected}
      />

      {onToggleCropMode && (
        <ToggleCheckbox
          tone={tone}
          label="Crop Mode"
          checked={isCropMode}
          onToggle={() => {
            const next = !isCropMode;
            setIsCropMode(next);
            setCropMode(next);
            onToggleCropMode(next);
          }}
        />
      )}
    </div>
  );
};

export default ImageToolbar;
