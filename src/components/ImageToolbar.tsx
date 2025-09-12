import React, { useState } from 'react';
import { ToggleCheckbox } from './ToggleCheckbox';
import { ToneButton } from './ToneButton';
import { AddImageButton } from './AddImageButton';
import { Crop, XIcon, Type } from 'lucide-react';
import { ImageTools, TemplateSideKey } from '../utils/imageTools';
import { DualTemplate } from '../types/template';

type ImageToolbarProps = {
  selectedElementId: string | null;
  handleOnUploadImage: (src: string, role: 'background' | 'element') => void;
  
  setTransformModeActive?: (enabled: boolean) => void
  
  tone: string;
  side: TemplateSideKey;
  setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>> 
  recordSnapshot: () => void;
  onToggleCropMode?: (enabled: boolean) => void;
  setCropMode: (enabled: boolean) => void;
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
  
}) => {
  const isElementSelected = !!selectedElementId;
  const [isCropMode, setIsCropMode] = useState(false);
  

  const handleResizeClick = () => {
    if (!selectedElementId || !setTransformModeActive) return;
    setTransformModeActive(true); // triggers <CardSideLayer showTransformer={true} />
  };
  

  const handleCropClick = () => {
    if (!selectedElementId) return;
    setIsCropMode(true)
    setCropMode(true)
  };

  const handleRemoveClick = () => {
    if (!selectedElementId) return;
    ImageTools.remove(selectedElementId, side, setTemplate, recordSnapshot);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-50 r
      ounded-xl shadow-lg px-4 py-5 min-w-[340px] font-sans flex flex-col gap-4">
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
        tone={tone}
        fontSize="text-sm"
        isActive={false}
        onClick={handleCropClick}
        disabled={!isElementSelected}
      />

      <ToneButton
        label="Remove"
        icon={<XIcon size={18} />}
        tone={tone}
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
            onToggleCropMode(next);
          }}
        />
      )}
    </div>
  );
};

export default ImageToolbar;
