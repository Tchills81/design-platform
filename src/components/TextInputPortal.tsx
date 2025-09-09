'use client';

import ReactDOM from 'react-dom';
import React from 'react';
import { log } from 'console';

interface TextInputPortalProps {
  value: string;
  position: { x: number; y: number } | null;
  font: string;
  size: number;
  color: string;
  isBold: boolean;
  isItalic: boolean;

  onChange: (val: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;

 
}

const TextInputPortal: React.FC<TextInputPortalProps> = ({
  
  value,
  position,
  font,
  size,
  color,
  onChange,
  onBlur,
  isBold,
  isItalic
  
}) => {
  const portalRoot = document.getElementById('canvas-portal');
  if (!portalRoot) return null;

  if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
    return null;
  }
  
  return ReactDOM.createPortal(
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      style={{
        position: 'absolute',
        top: position.y + size * 2, // Appears just below the text baseline
        left: position.x,
        fontSize: size,
        fontFamily: font,
        color,
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        background: '#ffffff',
        border: 'none',
        outline: 'none',
        pointerEvents: 'auto',
        minWidth: 100,
        padding: '0.25rem 0.5rem',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
        
      }}
      autoFocus
      id="text-input-overlay"
      aria-label="Text input"
      title="Edit text"
    />,
    portalRoot
  );
  
};

export default TextInputPortal;
