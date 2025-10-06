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
      left: position.x,
      top: position.y+50
    });
  }, [position]);

  return (
    <div
      className="absolute z-30 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-3 flex gap-2"
      style={{ left: style.left, top: style.top }}
    >
      {children}
    </div>
  );
}
