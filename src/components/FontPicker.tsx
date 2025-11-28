import React from 'react';

import { allFonts } from '../ui/fonts';

type FontDropdownProps = {
  selectedFont: string;
  onChange: (fontFamily: string) => void;
  disabled?: boolean;
};

export const FontDropdown: React.FC<FontDropdownProps> = ({ selectedFont, disabled,onChange }) => {

 // console.log("FontDropdown - disabled:", disabled);
  return (
    <div className="relative inline-block" >
      <select
       disabled={disabled}
      
        value={selectedFont}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none border px-3 py-2 rounded-md bg-white text-sm shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
