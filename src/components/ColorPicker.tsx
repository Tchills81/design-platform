'use client';

import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
  size?: number;
  style?: React.CSSProperties;
  id?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onChange,
  size = 40,
  style,
  id
}) => {
  return (
    <input
      id={id}
      type="color"
      value={selectedColor}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: size,
        height: size,
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        padding: 0,
        background: 'transparent',
        ...style
      }}
    />
  );
};

export default ColorPicker;
