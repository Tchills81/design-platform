import { toneRegistry } from './toneRegistry';
import { motion } from 'framer-motion';

interface TonePaletteSelectorProps {
  selectedTone: string;
  onSelectTone: (tone: string) => void;
}

export function TonePaletteSelector({ selectedTone, onSelectTone }: TonePaletteSelectorProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <h4 className="text-sm font-semibold text-gray-600 ">Choose a Tone</h4>
      <div className="grid grid-cols-2 gap-2">
        {toneRegistry.map((tone, index) => (
          <motion.button
            key={tone.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
            onClick={() => {
              console.log(`Tone "${tone.key}" selected.`);
              
              onSelectTone(tone.key);
            }}
            className={`cursor-pointer rounded-lg p-3 text-left border transition-all hover:scale-[1.02] active:scale-[0.97] ${
              selectedTone === tone.key ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:shadow-sm'
            }`}
            style={{
              backgroundColor: '#ffffff',
              borderColor: tone.color,
              boxShadow: selectedTone === tone.key ? `0 0 0 3px ${tone.color}33` : undefined,
              color: tone.color
            }}
          >
            <div className="text-sm font-bold">{tone.label}</div>
            <div className="text-xs text-gray-500">{tone.description}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
