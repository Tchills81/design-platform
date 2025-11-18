import React from 'react';

interface ResizeHandleProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
  style: React.CSSProperties;
  toneColor: string;
  onMouseDown: (e: React.MouseEvent, position: ResizeHandleProps['position']) => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ position, style, toneColor, onMouseDown }) => {
  const isRect = position === 'left' || position === 'right';
  const transformBase = isRect ? 'translateY(-50%) rotate(90deg)' : 'scale(1)';
  const transformHover = isRect ? 'translateY(-50%) rotate(90deg) scale(1.1)' : 'scale(1.1)';

  return (
    <div
      style={{
        ...style,
        background: isRect ? toneColor : style.background,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseDown={(e) => onMouseDown(e, position)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 6px ${toneColor}`;
        e.currentTarget.style.transform = transformHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 2px rgba(0,0,0,0.2)';
        e.currentTarget.style.transform = transformBase;
      }}
    />
  );
};

export default ResizeHandle;
