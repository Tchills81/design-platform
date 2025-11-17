'use client';

import React from 'react';
import { FontDropdown } from './FontPicker';
import ColorPicker from './ColorPicker';
import { FontSizeDropdown } from './FontSizeDropdown';
import { ToneButton } from './ToneButton';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';
import { useFontPairing } from './text/useFontPairing';

import {
  X as XIcon,
  WrapText,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  TypeIcon,
  TrashIcon
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
  role?: string;
  onAddText?: () => void;
  onRemoveText?: () => void;
  toggleCommentModal: () => void;
  selectedTextId?: string | null;
  offset: number;
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
  role,
  onAddText,
  onRemoveText,
  offset = 0,
  selectedTextId,
  isMultiline,
  isUnderlined,
  textAlign,
  onAlignChange,
  onToggleMultiline,
  onToggleUnderline
}) => {
  const { backgroundClass } = useSeasonalTone();
  const offsetClass = offset === 0 ? 'left-1/2' : 'left-2/3';

  console.log('TextToolbar rendered with tone:', tone, 'and role:', role);
  
  const fontSuggestions = useFontPairing(role, tone);

  return (
    <div
      className={`absolute z-50 ${offsetClass} top-12 -translate-x-1/2 
        flex items-center gap-1 px-1 py-1 bg-white rounded-xl shadow-xl border border-gray-200 
        whitespace-nowrap overflow-x-auto max-w-[90vw] ${backgroundClass}`}
    >
      {/* Font Pairing Suggestions */}
      {fontSuggestions.length > 0 && (
        <div className="flex gap-2 items-center px-2">
          {fontSuggestions.map(font => (
            <button
              key={font}
              onClick={() => onFontChange(font)}
              className="text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100"
            >
              {font}
            </button>
          ))}
        </div>
      )}

      {/* Font & Style */}
      <ToneButton
        icon={<TypeIcon />}
        label="Add text"
        onClick={() => onAddText?.()}
        tone={tone}
      />

      <ToneButton
        icon={<TrashIcon />}
        label=""
        onClick={() => onRemoveText?.()}
        tone={tone}
        isActive={!!selectedTextId}
      />

      <FontDropdown selectedFont={selectedFont} onChange={onFontChange} />
      <FontSizeDropdown selectedSize={selectedFontSize} onChange={onFontSizeChange} />
      <ColorPicker selectedColor={selectedColor} onChange={onColorChange} />

      <ToneButton icon={<Bold size={16} />} label="" isActive={isBold} onClick={onToggleBold} tone={tone} title="Bold" />
      <ToneButton icon={<Italic size={16} />} label="" isActive={isItalic} onClick={onToggleItalic} tone={tone} title="Italic" />
      <ToneButton icon={<Underline size={16} />} label="" isActive={isUnderlined} onClick={onToggleUnderline} tone={tone} title="Underline" />
      <ToneButton icon={<WrapText size={16} />} label="" isActive={isMultiline} onClick={onToggleMultiline} tone={tone} />

      {/* Alignment */}
      <ToneButton icon={<AlignLeft size={16} />} label="" isActive={textAlign === 'left'} onClick={() => onAlignChange('left')} tone={tone} title="Align left" />
      <ToneButton icon={<AlignCenter size={16} />} label="" isActive={textAlign === 'center'} onClick={() => onAlignChange('center')} tone={tone} title="Align center" />
      <ToneButton icon={<AlignRight size={16} />} label="" isActive={textAlign === 'right'} onClick={() => onAlignChange('right')} tone={tone} title="Align right" />

      {/* Comment & Exit */}
      <ToneButton icon={<XIcon size={16} />} label="" onClick={exitEditingMode} tone={tone} title="Close" />
    </div>
  );
};

export default TextToolbar;
