import React, { useState } from 'react';
import { ToggleCheckbox } from './ToggleCheckbox';
import { ToneButton } from './ToneButton';
import { AddImageButton } from './AddImageButton';
import { Crop, XIcon, Type, Check } from 'lucide-react';
import { ImageTools, TemplateSideKey } from '../utils/imageTools';
import { DualTemplate } from '../types/template';
import Konva from 'konva';
import { cropRenderedRegion } from '../utils/cropRenderedRegion';
import { supportedShapeTypes } from './elements/shapes/types';

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
  imageRef?: any;
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
  const [color, setColor] = useState('#f43f5e');

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
    if (!imageRef?.current || !cropRegion || !canvasBounds || !selectedElementId) return;
    const layer = imageRef.current?.getLayer();
    const croppedSrc = layer ? cropRenderedRegion(layer, cropRegion) : null;
    if (!croppedSrc) return;

    setTemplate(prev => {
      if (!prev) return prev;
      const updatedElements = prev[side]?.elements.map(el => {
        if (el.id === selectedElementId) {
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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);

    if (!selectedElementId) return;

    setTemplate(prev => {
      if (!prev) return prev;
      const updatedElements = prev[side]?.elements.map(el => {
        if (el.id === selectedElementId) {
          return {
            ...el,
            fill: newColor
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
  };

  console.log('shapeType', (imageRef?.current.getClassName()));
  
  const showColorPicker =
  isElementSelected &&
  imageRef?.current &&
  supportedShapeTypes.includes(imageRef.current.getClassName());


  return (
    <div className="absolute top-1/2 right-4 -translate-x-1/2 z-50 bg-gray-50
     rounded-xl shadow-lg px-4 py-5 min-w-[250px] font-inter flex flex-col gap-4">
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

      {showColorPicker && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Fill Color:</label>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-8 h-8 border rounded cursor-pointer"
          />
        </div>
      )}

       <div className="text-xs text-gray-500 text-center pt-2 select-none">
        Drag this toolbar anywhere
      </div>
    </div>
  );
};

export default ImageToolbar;
