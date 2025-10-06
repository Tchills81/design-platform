'use client';

import React from 'react';
import { FontDropdown } from './FontPicker';
import ColorPicker from './ColorPicker';
import { FontSizeDropdown } from './FontSizeDropdown';
import { ToneButton } from './ToneButton';
import { ToggleCheckbox } from './ToggleCheckbox';
import { Type, X as XIcon } from 'react-feather';


import { allFonts } from '../ui/fonts';

interface TextToolbarProps {
  editingText: string;
  onTextChange: (val: string) => void;
  onTextBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

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
  selectedTextId
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
    <div className="grid grid-cols-[auto_auto_auto_auto_auto_1fr] items-center gap-3">

      <FontDropdown selectedFont={selectedFont} onChange={onFontChange} />
      <ToggleCheckbox label="Bold" checked={isBold} onToggle={onToggleBold} tone={tone} />
      <ToggleCheckbox label="Italic" checked={isItalic} onToggle={onToggleItalic} tone={tone} />
      <ColorPicker selectedColor={selectedColor} onChange={onColorChange} />
      <FontSizeDropdown selectedSize={selectedFontSize} onChange={onFontSizeChange} />
    </div>
  
    {/* Text Input */}
    <input
      type="text"
      value={editingText}
      onChange={(e) => onTextChange(e.target.value)}
      onBlur={onTextBlur}
      className={`w-full px-3 py-2 rounded-md border border-gray-300 shadow-inner text-[${selectedFontSize}px] font-[${isBold ? 'bold' : 'normal'}] ${
        isItalic ? 'italic' : ''
      }`}
      style={{ fontFamily: selectedFont, color: selectedColor }}
      autoFocus
      aria-label="Text input"
      title="Edit text"
    />
  
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
