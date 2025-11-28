'use client';

import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  size?: number;
  style?: React.CSSProperties;
  id?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onChange,
  disabled,
  size = 40,
  style,
  id
}) => {
  return (
    <input
      id={id}
      type="color"
      value={selectedColor}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none border px-3 py-2 rounded-md bg-white text-sm shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
