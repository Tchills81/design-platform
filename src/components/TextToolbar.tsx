'use client';

import React from 'react';
import { FontDropdown } from './FontPicker';
import ColorPicker from './ColorPicker';
import { FontSizeDropdown } from './FontSizeDropdown';
import { ToneButton } from './ToneButton';
import { ToggleCheckbox } from './ToggleCheckbox';
import { allFonts } from '../ui/fonts';

// Lucide icons
import {
  Type,
  X as XIcon,
  WrapText,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  StretchHorizontal,
  LineSquiggleIcon,
  Bold,
  Italic,
} from 'lucide-react';

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

  editingText: string;
  onTextChange: (val: string) => void;
  onTextBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;

  selectedFont: string;
  selectedFontSize: number;
  onFontChange: (font: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onFontSizeChange: (newSize: number) => void;

  exitEditingMode?: (e?: React.MouseEvent) => void;

  isBold: boolean;
  isItalic: boolean;
  onToggleBold: () => void;
  onToggleItalic: () => void;

  tone: string;
  onAddText?: () => void;
  onRemoveText?: () => void;
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
  editingText,
  onTextBlur,
  onTextChange,
  tone,
  onAddText,
  onRemoveText,
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
  const isTextSelected = !!selectedTextId;

  const resolvedFont = allFonts.find(f => f.key === selectedFont)?.family || 'Inter';

  return (
    <div
      id="text-toolbar"
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50
      bg-gray-50 rounded-xl shadow-lg px-4 py-5 min-w-[340px] font-sans flex flex-col gap-4"
    >
      {/* Close Button */}
      <div className="flex justify-end">
        <button
          onClick={exitEditingMode}
          className="text-sm text-gray-800 hover:scale-95 transition-transform"
          title="Close toolbar"
        >
          ✕
        </button>
      </div>

      {/* Styling Controls */}
      <div className="grid grid-cols-[auto_auto_auto_auto_auto_1fr] items-center gap-3 ">
        <FontDropdown selectedFont={selectedFont} onChange={onFontChange} />
        <ToneButton icon={<Bold size={16} />} label="Bold" isActive={isBold} onClick={onToggleBold} tone={tone} />
        <ToneButton icon={<Italic size={16} />} label="Italic" isActive={isItalic} onClick={onToggleItalic} tone={tone} />
        <ColorPicker selectedColor={selectedColor} onChange={onColorChange} />
        <FontSizeDropdown selectedSize={selectedFontSize} onChange={onFontSizeChange} />
      </div>

      {/* Layout Controls */}
      <div className="grid grid-cols-[auto_auto_auto_auto_auto_auto] items-center gap-3">
        <ToneButton icon={<WrapText size={16} />} label="Multiline" isActive={isMultiline} onClick={onToggleMultiline} tone={tone} />
        <ToneButton icon={<Underline size={16} />} label="Underline" isActive={isUnderlined} onClick={onToggleUnderline} tone={tone} />

        <div className="flex gap-1">
          <button
            onClick={() => onAlignChange('left')}
            className={`p-1 rounded-md border ${textAlign === 'left' ? 'bg-gray-200' : 'bg-white'}`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => onAlignChange('center')}
            className={`p-1 rounded-md border ${textAlign === 'center' ? 'bg-gray-200' : 'bg-white'}`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => onAlignChange('right')}
            className={`p-1 rounded-md border ${textAlign === 'right' ? 'bg-gray-200' : 'bg-white'}`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>
      </div>

      {/* Width & Line Height (if multiline) */}
      {isMultiline && (
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="flex items-center gap-2 text-sm">
            <StretchHorizontal size={16} />
            Width
          </label>
          <input
            type="range"
            min={100}
            max={600}
            value={textWidth ?? 240}
            onChange={(e) => onWidthChange?.(parseInt(e.target.value))}
          />

          <label className="flex items-center gap-2 text-sm">
            <LineSquiggleIcon size={16} />
            Line Height
          </label>
          <input
            type="range"
            min={1}
            max={2}
            step={0.1}
            value={lineHeight ?? 1.4}
            onChange={(e) => onLineHeightChange?.(parseFloat(e.target.value))}
          />
        </div>
      )}

      {/* Text Input */}
      <textarea
  value={editingText}
  onChange={(e) => onTextChange(e.target.value)}
  onBlur={onTextBlur}
  rows={4}
  className={`w-full px-3 py-2 rounded-md border border-gray-300 shadow-inner resize-none text-[${selectedFontSize}px] font-[${isBold ? 'bold' : 'normal'}] ${
    isItalic ? 'italic' : ''
  }`}
  style={{ fontFamily: selectedFont, color: selectedColor }}
  autoFocus
  aria-label="Text input"
  title="Edit text"
></textarea>


      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <ToneButton
          fontSize="text-sm"
          icon={<Type size={18} />}
          label="Add Text"
          tone={tone}
          isActive={true}
          onClick={onAddText ?? (() => {})}
        />
        <ToneButton
          fontSize="text-sm"
          icon={<XIcon size={18} />}
          label="Remove Text"
          tone={tone}
          isActive={isTextSelected}
          onClick={onRemoveText ?? (() => {})}
          title={!isTextSelected ? 'Select a text element to remove' : undefined}
        />
      </div>
    </div>
  );
};

export default TextToolbar;
