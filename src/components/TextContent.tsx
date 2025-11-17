import { useState } from 'react';
import { TonePaletteSelector } from './text/TonePaletteSelector';
import { TextRoleButtons } from './text/TextRoleButtons';
import { tone } from '../types/tone';
import { ToneFontPreview } from './text/ToneFontPreview';


export function TextContent() {
  const [selectedTone, setSelectedTone] = useState('quiet');

  return (
    <div className="flex flex-col gap-4">
      
      <TonePaletteSelector selectedTone={selectedTone} onSelectTone={setSelectedTone} />
      <ToneFontPreview tone={selectedTone as tone} />
      <TextRoleButtons tone={selectedTone as tone} />
     
    </div>
  );
  
}
