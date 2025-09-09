// components/PaintingToolbar.tsx

import React from 'react';

type PaintingToolbarProps = {
  brushColor: string;
  brushSize: number;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
};

const PaintingToolbar: React.FC<PaintingToolbarProps> = ({
  brushColor,
  brushSize,
  onColorChange,
  onSizeChange
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
        background: 'white',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}
    >
      <label className="block mb-2 text-sm font-medium">Brush Color</label>
      <input
        type="color"
        value={brushColor}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-8 h-8 border rounded-full cursor-pointer mb-4"
      />

      <label className="block mb-2 text-sm font-medium">Brush Size</label>
      <input
        type="range"
        min={1}
        max={50}
        value={brushSize}
        onChange={(e) => onSizeChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
};

export default PaintingToolbar;
