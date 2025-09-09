'use client';

import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';

interface CropOverlayPortalProps {
  position: { x: number; y: number };
  size: { width: number; height: number };
  onConfirm: (crop: { x: number; y: number; width: number; height: number }) => void;
  onCancel?: () => void;
}

const CropOverlayPortal: React.FC<CropOverlayPortalProps> = ({
  position,
  size,
  onConfirm,
  onCancel
}) => {
  const portalRoot = document.getElementById('canvas-portal');
  const [cropBox, setCropBox] = useState({ ...position, ...size });

  useEffect(() => {
    setCropBox({ ...position, ...size });
  }, [position, size]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel?.();
      if (e.key === 'Enter') onConfirm(cropBox);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cropBox]);

  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="crop-overlay"
      style={{
        position: 'absolute',
        top: cropBox.y,
        left: cropBox.x,
        width: cropBox.width,
        height: cropBox.height,
        border: '2px dashed #0077CC',
        background: 'rgba(255,255,255,0.1)',
        resize: 'both',
        overflow: 'hidden',
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
      onDoubleClick={() => onConfirm(cropBox)}
    >
      <div
        style={{
          position: 'absolute',
          bottom: -36,
          right: 0,
          display: 'flex',
          gap: '8px'
        }}
      >
        <button onClick={() => onConfirm(cropBox)}>✅ Confirm</button>
        <button onClick={onCancel}>❌ Cancel</button>
      </div>
    </div>,
    portalRoot
  );
};

export default CropOverlayPortal;
