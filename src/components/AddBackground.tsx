import { ImagePlus } from 'lucide-react';
import { useRef } from 'react';
import { ToneButton } from './ToneButton';

interface AddBackgroundButtonProps {
  tone: string;
  fontSize?: string;
  onUpload: (src: string) => void;
}

export const AddBackgroundButton: React.FC<AddBackgroundButtonProps> = ({
  tone,
  fontSize = 'text-sm',
  onUpload,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      onUpload(src);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <ToneButton
        fontSize={fontSize}
        icon={<ImagePlus size={18} />}
        label="Add Background"
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
    </>
  );
};
