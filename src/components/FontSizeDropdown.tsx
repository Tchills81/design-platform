// components/FontSizeDropdown.tsx

import React from 'react';

type FontSizeDropdownProps = {
  selectedSize: number;
  onChange: (size: number) => void;
};

const fontSizes = Array.from({ length: 93 }, (_, i) => i + 8); // 8 to 100 inclusive


export const FontSizeDropdown: React.FC<FontSizeDropdownProps> = ({ selectedSize, onChange }) => {
  return (
    <select
      value={selectedSize}
      onChange={(e) => onChange(Number(e.target.value))}
      className="appearance-none border px-2 py-1 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {fontSizes.map((size) => (
        <option key={size} value={size}>
          {size}px
        </option>
      ))}
    </select>
  );
};
