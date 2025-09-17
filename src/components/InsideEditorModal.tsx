'use client';
import React from 'react';
import InsideEditorView from './InsideEditorView';
type ToneType = 'warm' | 'reflective' | 'minimal' | 'neutral' | 'festive' | 'elegant' | 'playful';

interface InsideEditorModalProps {
  tone?: ToneType;
  onClose: () => void;
  onSave: (message: string) => void;
}

const InsideEditorModal: React.FC<InsideEditorModalProps> = ({ tone = 'neutral', onClose, onSave }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">


      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl animate-fadeIn relative">
        <InsideEditorView
          tone={tone}
          onSave={(msg) => {
            onSave(msg);
            onClose();
          }}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sm text-gray-500 hover:text-gray-700"
          aria-label="Close editor"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InsideEditorModal;
