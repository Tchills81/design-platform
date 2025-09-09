'use client';

import React from 'react';

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  selectedColor,
  onSelect
}) => {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          style={{
            backgroundColor: color,
            width: 32,
            height: 32,
            borderRadius: 4,
            border: selectedColor === color ? '2px solid black' : 'none',
            cursor: 'pointer'
          }}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
