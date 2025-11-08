import React, { RefObject, useState } from 'react';
import { ToggleCheckbox } from './ToggleCheckbox';
import { ToneButton } from './ToneButton';
import { AddImageButton } from './AddImageButton';
import { Crop, XIcon, Type, Check, PlusIcon, ListPlusIcon, ImageUpscaleIcon, TrashIcon} from 'lucide-react';
import { ImageTools, TemplateSideKey } from '../utils/imageTools';
import { DualTemplate } from '../types/template';
import Konva from 'konva';
import { cropRenderedRegion } from '../utils/cropRenderedRegion';
import { supportedShapeTypes } from './elements/shapes/types';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';
import { Group } from 'konva/lib/Group';
import ImagePreviewModal from './ImagePreviewModal';

type ImageToolbarProps = {
  selectedElementId: string | null;
  handleOnUploadImage: (src: string, role: 'background' | 'element') => void;
  setTransformModeActive?: (enabled: boolean) => void;
  tone: string;
  side: TemplateSideKey;
  setTemplate: React.Dispatch<React.SetStateAction<DualTemplate | null>>;
  toggleCommentModal:()=>void;
  recordSnapshot: () => void;
  onToggleCropMode?: (enabled: boolean) => void;
  setCropMode: (enabled: boolean) => void;
  imageRef?: any;
  imagebarRef: RefObject<HTMLDivElement | null>;
  cropRegion?: { x: number; y: number; width: number; height: number };
  canvasBounds?: { x: number; y: number };
  cardGridGroupRef: RefObject<Group| null>;
  previewSrc: string | null;
  setPreviewSrc:React.Dispatch<React.SetStateAction<string | null>>;
  
  
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
  toggleCommentModal,
  setCropMode,
  imageRef,
  imagebarRef,
  cropRegion,
  canvasBounds,
  cardGridGroupRef,
  previewSrc,
  setPreviewSrc
  
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
    if (
      !imageRef?.current ||
      !cropRegion ||
      !cardGridGroupRef?.current ||
      !selectedElementId
    ) return;
  
    const layer = imageRef.current.getLayer();
    const croppedSrc = layer ? cropRenderedRegion(layer, cropRegion) : null;
    if (!croppedSrc) return;
  
    // 🧭 Get canvas transform info
    const group = cardGridGroupRef?.current;
    const groupPos = group.getAbsolutePosition(); // includes centering offset
    const scale = group.scaleX(); // assuming uniform scaling
  
    // 🧮 Convert screen crop to canvas coordinates
    const canvasX = (cropRegion.x - groupPos.x) / scale;
    const canvasY = (cropRegion.y - groupPos.y) / scale;
    const canvasWidth = cropRegion.width / scale;
    const canvasHeight = cropRegion.height / scale;
  
    setTemplate(prev => {
      if (!prev) return prev;
      const updatedElements = prev[side]?.elements.map(el => {
        if (el.id === selectedElementId) {
          return {
            ...el,
            src: croppedSrc,
            size: {
              width: canvasWidth,
              height: canvasHeight,
            },
            position: {
              x: canvasX,
              y: canvasY,
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

 
  const [previewRole, setPreviewRole] = useState<'background' | 'element'>('background');
  
  const showColorPicker =
  isElementSelected &&
  imageRef?.current &&
  supportedShapeTypes.includes(imageRef.current.getClassName());
  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();


  return (
    <>
    <div ref={imagebarRef}  id='image-tool-bar'
    className={` pointer-events-auto cursor-grab absolute z-100 left-1/2 top-20 -translate-x-1/2 
      flex items-center gap-1 px-1 py-1 bg-white rounded-xl shadow-xl border border-gray-200 
      whitespace-nowrap overflow-x-auto max-w-[90vw] ${backgroundClass}`}
    >
      <AddImageButton
  tone={tone}
  context="design"
  onUpload={(src) => {
   
    setPreviewSrc(src);
    }}
/>
      <ToneButton
        label="Resize"
        icon={<ImageUpscaleIcon size={18} />}
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
        icon={<TrashIcon size={18} />}
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
  
      <ToneButton
        label="Add Reflection"
        icon={<ListPlusIcon size={18} />}
        tone={tone}
        fontSize="text-sm"
        isActive={false}
        onClick={toggleCommentModal}
        disabled={!isElementSelected}
      />
  
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
    </div>

    <div>

    {previewSrc && (
  <ImagePreviewModal
    src={previewSrc}
    role={previewRole}
    onRoleChange={setPreviewRole}
    onCancel={() => {
      setPreviewSrc(null);
      setPreviewRole('background');
    }}
    onConfirm={(role) => {

      console.log('previewSrc', previewSrc.slice(previewSrc.length-5, previewSrc.length), 'role', role);
      handleOnUploadImage(previewSrc, role);
      setPreviewSrc(null);
      setPreviewRole('background');
    }}
  />
)}

    </div>

</>
   
  );
  
};

export default ImageToolbar;
