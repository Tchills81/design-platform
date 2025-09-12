import { ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import { ToneButton } from './ToneButton';

interface AddImageButtonProps {
  tone: string;
  fontSize?: string;
  onUpload: (src: string, role: 'background' | 'element') => void;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({
  tone,
  fontSize = 'text-sm',
  onUpload,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [role, setRole] = useState<'background' | 'element'>('background');

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setPreviewSrc(src);
    };

    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!previewSrc) return;
    onUpload(previewSrc, role);
    setPreviewSrc(null);
    setRole('background');
  };

  return (
    <>
      <ToneButton
        fontSize={fontSize}
        icon={<ImagePlus size={18} />}
        label="Add Image"
        tone={tone}
        isActive={false}
        onClick={() => inputRef.current?.click()}
      />
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />

      {previewSrc && (
       <div
       style={{
         marginTop: '1rem',
         padding: '1rem',
         border: '1px solid #ccc',
         borderRadius: '8px',
         background: '#f9f9f9',
         position: 'absolute', // or 'fixed' if it's a modal
         top: '50%',
         left: '50%',
         transform: 'translate(-50%, -50%)',
         zIndex: 10000,
         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
       }}
     >
          <img src={previewSrc} alt="Preview" style={{ maxWidth: '100%', borderRadius: '6px' }} />
          <div style={{ marginTop: '1rem' }}>
            <label style={{ marginRight: '0.5rem' }}>Use as:</label>
            <select value={role} onChange={(e) => setRole(e.target.value as 'background' | 'element')}>
              <option value="background">Background Image</option>
              <option value="element">Image Element</option>
            </select>
          </div>

          <button
            onClick={handleConfirm}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#333',
              color: '#fff',
              borderRadius: '6px',
            }}
          >
            Confirm Upload
          </button>
        </div>
      )}
    </>
  );
};
