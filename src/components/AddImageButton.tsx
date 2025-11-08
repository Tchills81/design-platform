import { ImageUpIcon } from 'lucide-react';
import { useRef } from 'react';
import { ToneButton } from './ToneButton';

interface AddImageButtonProps {
  tone: string;
  fontSize?: string;
  onUpload: (src: string) => void; // no role here
  context?: 'design' | 'import';
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({
  tone,
  fontSize = 'text-sm',
  onUpload,
  context = 'import',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;

      //console.log('handleUpload',  src)
      onUpload(src); // pass image src upward
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ToneButton
        label={context === 'design' ? 'Add Asset' : '📤 Upload Asset to Begin'}
        icon={<ImageUpIcon  />}
        tone={tone}
        fontSize={fontSize}
        onClick={() => inputRef.current?.click()}
      />

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
};
