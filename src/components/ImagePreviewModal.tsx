import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  src: string;
  role: 'background' | 'element';
  onConfirm: (role: 'background' | 'element') => void;
  onCancel: () => void;
  onRoleChange: (role: 'background' | 'element') => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  src,
  role,
  onConfirm,
  onCancel,
  onRoleChange,
}) => {
  return (
    <div className=" pointer-events-auto cursor-grab fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="bg-white  rounded-xl shadow-xl p-6 w-full max-w-md relative animate-fade-in">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-muted hover:text-ceremonial"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-serif text-ceremonial mb-4 text-center">
          🖼️ Preview Your Asset
        </h3>

        <img
          src={src}
          alt="Preview"
          className="rounded-lg mb-4 max-h-64 mx-auto"
        />

        <div className="mb-4 text-center">
          <label className="mr-2 font-inter text-sm text-muted">Use as:</label>
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value as 'background' | 'element')}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm"
          >
            <option value="background">Background Image</option>
            <option value="element">Image Element</option>
          </select>
        </div>

        <button
          onClick={() => onConfirm(role)}
          className="w-full bg-yellow-100 text-yellow-800 py-2 rounded-lg hover:bg-yellow-200 transition"
        >
          Confirm Upload
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
