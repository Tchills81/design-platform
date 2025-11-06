'use client';

import React from 'react';
import { FontDropdown } from './FontPicker';
import ColorPicker from './ColorPicker';
import { FontSizeDropdown } from './FontSizeDropdown';
import { ToneButton } from './ToneButton';

import {
  Type,
  X as XIcon,
  WrapText,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  StretchHorizontal,
  Bold,
  Italic,
  ListPlus
} from 'lucide-react';
import { tone } from '../types/tone';

interface TextToolbarProps {
  isMultiline: boolean;
  onToggleMultiline: () => void;
  isUnderlined: boolean;
  onToggleUnderline: () => void;
  textAlign: 'left' | 'center' | 'right';
  onAlignChange: (align: 'left' | 'center' | 'right') => void;
  textWidth?: number;
  onWidthChange?: (val: number) => void;
  lineHeight?: number;
  onLineHeightChange?: (val: number) => void;
  selectedFont: string;
  selectedFontSize: number;
  onFontChange: (font: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onFontSizeChange: (newSize: number) => void;
  exitEditingMode: (e?: React.MouseEvent) => void;
  isBold: boolean;
  isItalic: boolean;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  tone: string;
  onAddText?: () => void;
  onRemoveText?: () => void;
  toggleCommentModal: () => void;
  selectedTextId?: string | null;
}

const TextToolbar: React.FC<TextToolbarProps> = ({
  selectedFont,
  onFontChange,
  selectedColor,
  selectedFontSize,
  onColorChange,
  onFontSizeChange,
  exitEditingMode,
  isBold,
  isItalic,
  onToggleBold,
  onToggleItalic,
  tone,
  onAddText,
  onRemoveText,
  toggleCommentModal,
  selectedTextId,
  isMultiline,
  isUnderlined,
  textAlign,
  onAlignChange,
  onToggleMultiline,
  onToggleUnderline,
  textWidth,
  onWidthChange,
  lineHeight,
  onLineHeightChange,
}) => {
  return (
    <div
    className="absolute z-50 left-1/2 top-0 -translate-x-1/2 
      flex items-center gap-1 px-4 py-2 bg-white rounded-xl shadow-xl border border-gray-200 
      whitespace-nowrap overflow-x-auto max-w-[90vw]"
  >
 {/* Font & Style */}
      <FontDropdown selectedFont={selectedFont} onChange={onFontChange} />
      <FontSizeDropdown selectedSize={selectedFontSize} onChange={onFontSizeChange} />
      <ColorPicker selectedColor={selectedColor} onChange={onColorChange} />
      <ToneButton icon={<Bold size={16} />} label="" isActive={isBold} onClick={onToggleBold} tone={tone} />
      <ToneButton icon={<Italic size={16} />} label="" isActive={isItalic} onClick={onToggleItalic} tone={tone} />
      <ToneButton icon={<Underline size={16} />} label="" isActive={isUnderlined} onClick={onToggleUnderline} tone={tone} />
      <ToneButton icon={<WrapText size={16} />} label="" isActive={isMultiline} onClick={onToggleMultiline} tone={tone} />

      {/* Alignment */}
      <ToneButton icon={<AlignLeft size={16} />} label="" isActive={textAlign === 'left'} onClick={() => onAlignChange('left')} tone={tone} />
      <ToneButton icon={<AlignCenter size={16} />} label="" isActive={textAlign === 'center'} onClick={() => onAlignChange('center')} tone={tone} />
      <ToneButton icon={<AlignRight size={16} />} label="" isActive={textAlign === 'right'} onClick={() => onAlignChange('right')} tone={tone} />

      {/* Comment & Exit */}
      
      <ToneButton icon={<XIcon size={16} />} label="Close" onClick={exitEditingMode} tone={tone} />

      {/* Width & Line Height */}
      {isMultiline && (
        <div className="flex items-center gap-4 ml-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <StretchHorizontal size={16} />
            Width
            <input
              type="range"
              min={100}
              max={600}
              value={textWidth ?? 240}
              onChange={(e) => onWidthChange?.(parseInt(e.target.value))}
              className="w-32 accent-indigo-500"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            Line Height
            <input
              type="range"
              min={1}
              max={2}
              step={0.1}
              value={lineHeight ?? 1.4}
              onChange={(e) => onLineHeightChange?.(parseFloat(e.target.value))}
              className="w-24 accent-indigo-500"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default TextToolbar;
