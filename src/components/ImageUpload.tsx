import { useRef } from 'react';

import { TemplateElement } from '../types/template';

interface ImageUploadProps {
  tone: string;
  onUpload: (element: TemplateElement) => void;
  trigger?: React.ReactNode; // Optional custom trigger (e.g. button)
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ tone, onUpload, trigger }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;

      const newImageElement: TemplateElement = {
        type: 'image',
        id: `img-${Date.now()}`,
        src,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
        tone,
      };

      onUpload(newImageElement);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <div onClick={() => inputRef.current?.click()} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
    </>
  );
};
