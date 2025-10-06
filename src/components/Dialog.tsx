// components/ui/Dialog.tsx
import React from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Dialog({ open, onClose, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-[400px] max-w-full p-4 animate-fadeIn">
        {children}
      </div>
      <button
        className="absolute top-4 right-4 text-white"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
