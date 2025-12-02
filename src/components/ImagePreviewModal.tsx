import React from 'react';
import { X } from 'lucide-react';
import RoleSelect from './RoleSelect';

interface ImagePreviewModalProps {
  previewUploadRef: React.RefObject<HTMLDivElement | null>;
  src: string;
  role: 'background' | 'element';
  onConfirm: (role: 'background' | 'element') => void;
  onCancel: () => void;
  onRoleChange: (role: 'background' | 'element') => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  previewUploadRef,
  src,
  role,
  onConfirm,
  onCancel,
  onRoleChange,
}) => {
  return (
    <div ref={previewUploadRef} className=" pointer-events-auto cursor-grab fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
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

<RoleSelect
  value={role}
  onChange={onRoleChange}
  className="mt-2"
/>

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
