import React from 'react';

import { allFonts } from '../ui/fonts';

type FontDropdownProps = {
  selectedFont: string;
  onChange: (fontFamily: string) => void;
};

export const FontDropdown: React.FC<FontDropdownProps> = ({ selectedFont, onChange }) => {
  return (
    <div className="relative inline-block">
      <select
        value={selectedFont}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none border px-3 py-2 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {allFonts.map((font) => (
          <option
            key={font.key}
            value={font.family}
            style={{ fontFamily: font.family }}
          >
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};
