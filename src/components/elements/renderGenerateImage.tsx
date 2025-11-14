import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ToneButton } from '../ToneButton';



export function GenerateImagePanel({ onGenerate }: { onGenerate: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="px-3 pt-4 space-y-3">
      <h2 className="text-base font-semibold text-foreground">Generate Image</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <ToneButton
        label="Generate"
        icon={<Sparkles size={18} />}
        tone="accent"
        fontSize="text-sm"
        isActive={false}
        onClick={() => {
          if (prompt.trim()) {
            onGenerate(prompt.trim());
          }
        }}
      />
    </div>
  );
}
