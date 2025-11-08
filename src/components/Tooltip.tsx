// src/components/Tooltip.tsx
'use client';

import React from 'react';

interface TooltipProps {
  text: string;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ text, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-full mt-1 px-2 py-1 font-semibold font-inter text-xs text-white bg-gray-800 rounded shadow-md whitespace-nowrap z-50">
      {text}
    </div>
  );
};

export default Tooltip;
