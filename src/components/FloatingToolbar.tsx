// src/components/FloatingToolbar.tsx
import { ReactNode, useEffect, useState } from 'react';

interface FloatingToolbarProps {
  position: { x: number; y: number };
  children: ReactNode;
}

export default function FloatingToolbar({ position, children }: FloatingToolbarProps) {
  const [style, setStyle] = useState({ left: 0, top: 0 });

  useEffect(() => {
    setStyle({
      left: position.x+50,
      top:  position.y
    });
  }, [position]);

  return (
    <div
      className="absolute z-30 top-0.5 bottom-0.5 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-3 flex gap-2"
      
    >
      {children}
    </div>
  );
}
