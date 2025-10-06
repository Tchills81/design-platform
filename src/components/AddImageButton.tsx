import { ImagePlus, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface AddImageButtonProps {
  tone: string;
  fontSize?: string;
  onUpload: (src: string, role: 'background' | 'element') => void;
  context?: 'design' | 'import';
  importedAsset?: {
    src: string;
    role: 'background' | 'element';
  };
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({
  tone,
  fontSize = 'text-sm',
  onUpload,
  context = 'import',
  importedAsset,
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

  const handleCancel = () => {
    setPreviewSrc(null);
    setRole('background');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={() => inputRef.current?.click()}
        className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-lg font-inter text-sm hover:bg-yellow-200 transition"
      >
        {context === 'design' ? 'Add Asset' : '📤 Upload Asset to Begin'}
      </button>

      

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleUpload}
      />

      {previewSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative animate-fade-in">
            <button
              onClick={handleCancel}
              className="absolute top-3 right-3 text-muted hover:text-ceremonial"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-serif text-ceremonial mb-4 text-center">
              🖼️ Preview Your Asset
            </h3>

            <img
              src={previewSrc}
              alt="Preview"
              className="rounded-lg mb-4 max-h-64 mx-auto"
            />

            <div className="mb-4 text-center">
              <label className="mr-2 font-inter text-sm text-muted">Use as:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'background' | 'element')}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="background">Background Image</option>
                <option value="element">Image Element</option>
              </select>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-yellow-100 text-yellow-800 py-2 rounded-lg hover:bg-yellow-200 transition"
            >
              Confirm Upload
            </button>
          </div>
        </div>
      )}

      {context === 'import' && previewSrc === null && importedAsset && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-serif text-ceremonial mb-2">🎉 Uploaded Asset</h3>
          <img
            src={importedAsset.src}
            alt="Uploaded Asset"
            className="rounded-lg max-w-xs mx-auto shadow-md"
          />
          <p className="text-muted font-inter mt-2 text-sm">
            Role: <strong>{importedAsset.role}</strong>
          </p>
        </div>
      )}
    </div>
  );
};
