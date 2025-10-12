'use client';

import React from 'react';
import { FontDropdown } from './FontPicker';
import ColorPicker from './ColorPicker';
import { FontSizeDropdown } from './FontSizeDropdown';
import { ToneButton } from './ToneButton';
import { ToggleCheckbox } from './ToggleCheckbox';

import SidebarSection from './SidebarSection';
import SidebarModule from './SidebarModule';
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

  editingText: string;
  onTextChange: (val: string) => void;
  onTextBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;

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
  toggleCommentModal:()=>void;
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
  const isTextSelected = !!selectedTextId;

  return (
    <SidebarModule tone={tone as tone}>
      {/* Close Button */}
      
      <div className="flex  gap-4 justify-end mb-2 align-middle">
      <ToneButton 
       icon={<ListPlus size={16} />} 
       label="Add Reflection" isActive={isItalic}
       onClick={toggleCommentModal}
       tone={tone} />
      <ToneButton icon={<XIcon size={16} />} label="" isActive={isItalic} onClick={exitEditingMode} tone={tone} />
      </div>

      {/* Style Text Section */}
      <SidebarSection label="Style Text">
        <div className="flex gap-3 flex-wrap justify-center mt-4 animate-fadeIn">
          <FontDropdown selectedFont={selectedFont} onChange={onFontChange} />
          <ToneButton icon={<Bold size={16} />} label="Bold" isActive={isBold} onClick={onToggleBold} tone={tone} />
          <ToneButton icon={<Italic size={16} />} label="Italic" isActive={isItalic} onClick={onToggleItalic} tone={tone} />
          <ColorPicker selectedColor={selectedColor} onChange={onColorChange} />
          <FontSizeDropdown selectedSize={selectedFontSize} onChange={onFontSizeChange} />
        </div>
      </SidebarSection>

      {/* Layout Section */}
      <SidebarSection label="Layout">
        <div className="flex gap-3 flex-wrap justify-center mt-4 animate-fadeIn">
          <ToneButton icon={<WrapText size={16} />} label="" isActive={isMultiline} onClick={onToggleMultiline} tone={tone} />
          <ToneButton icon={<Underline size={16} />} label="" isActive={isUnderlined} onClick={onToggleUnderline} tone={tone} />

          
  <ToneButton
    icon={<AlignLeft size={16} />}
    label="Left"
    isActive={textAlign === 'left'}
    onClick={() => onAlignChange('left')}
    tone={tone}
  />
  <ToneButton
    icon={<AlignCenter size={16} />}
    label="Center"
    isActive={textAlign === 'center'}
    onClick={() => onAlignChange('center')}
    tone={tone}
  />
  <ToneButton
    icon={<AlignRight size={16} />}
    label="Right"
    isActive={textAlign === 'right'}
    onClick={() => onAlignChange('right')}
    tone={tone}
  />


        </div>

        {/* Width & Line Height */}
        {isMultiline && (
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <StretchHorizontal size={16} />
                Width
              </label>
              <input
                type="range"
                min={100}
                max={600}
                value={textWidth ?? 240}
                onChange={(e) => onWidthChange?.(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
               
                Line Height
              </label>
              <input
                type="range"
                min={1}
                max={2}
                step={0.1}
                value={lineHeight ?? 1.4}
                onChange={(e) => onLineHeightChange?.(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        )}
      </SidebarSection>

      {/* Text Input Section */}
      <SidebarSection label="Edit Text">
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
      </SidebarSection>

      {/* Action Buttons */}
      <SidebarSection label="Actions">
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
      </SidebarSection>
    </SidebarModule>
  );
};

export default TextToolbar;
