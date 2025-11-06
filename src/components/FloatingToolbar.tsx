'use client';

import { ReactNode, useEffect, useState } from 'react';

interface FloatingToolbarProps {
  position: { x: number; y: number };
  children: ReactNode;
}

export default function FloatingToolbar({ position, children }: FloatingToolbarProps) {
  const [style, setStyle] = useState({ left: 0, top: 0, width:'' });

  useEffect(() => {
    // Offset to position toolbar slightly below and right of the selected text
    const offsetX = 50;
    const offsetY = 20;

    setStyle({
      left: position.x + offsetX,
      top: position.y + offsetY,
      width:'100%'
    });
  }, [position]);

  return (
    <div
      className="absolute z-50 rounded-lg  border-gray-200 px-4 py-2 flex flex-wrap items-center gap-3"
      style={style}
    >
      {children}
    </div>
  );
}
