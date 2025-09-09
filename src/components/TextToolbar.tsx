'use client';

import React from 'react';
import { FontDropdown } from './FontPicker';
import ColorPicker from './ColorPicker';
import { FontSizeDropdown } from './FontSizeDropdown';

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
  position?: { x: number; y: number };
  canvasWidth?: number;
  canvasHeight?: number;
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
  position,
  canvasWidth = 1000,
  canvasHeight = 800
}) => {
  const toolbarWidth = 320;
  const toolbarHeight = 100;

  const safeX = typeof position?.x === 'number' ? position.x : 0;
  const safeY = typeof position?.y === 'number' ? position.y : 0;

  const clampedX = Math.max(0, Math.min(safeX, canvasWidth - toolbarWidth));
  const clampedY = Math.max(0, Math.min(safeY, canvasHeight - toolbarHeight));

  return (
    <div
      id="text-toolbar"
      style={{
        position: 'absolute',
        top: 16, // Fixed distance from top of viewport or canvas container
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: '#fff',
        padding: '0.75rem 1rem',
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        minWidth: 320
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <FontDropdown selectedFont={selectedFont} onChange={onFontChange} />
        <ColorPicker selectedColor={selectedColor} onChange={onColorChange} />
        <FontSizeDropdown selectedSize={selectedFontSize} onChange={onFontSizeChange} />

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <input type="checkbox" checked={isBold} onChange={onToggleBold} />
          <span style={{ fontWeight: 'bold' }}>B</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <input type="checkbox" checked={isItalic} onChange={onToggleItalic} />
          <span style={{ fontStyle: 'italic' }}>I</span>
        </label>

        <button className="toolbar-close-button" onClick={exitEditingMode}>
          ✕ Close
        </button>
      </div>

      <input
        type="text"
        value={editingText}
        onChange={(e) => onTextChange(e.target.value)}
        onBlur={onTextBlur}
        style={{
          fontSize: selectedFontSize,
          fontFamily: selectedFont,
          color: selectedColor,
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          background: '#fff',
          border: '1px solid #ccc',
          outline: 'none',
          padding: '0.25rem 0.5rem',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
          width: '100%',
          borderRadius: 4
        }}
        autoFocus
        aria-label="Text input"
        title="Edit text"
      />
    </div>
  );
};

export default TextToolbar;
