import { useState } from 'react';
import { tone, toneClasses } from '../types/tone';

type ToneSelectProps = {
  selectedTone: string;
  setSelectedTone: (tone: string) => void;
};

const toneIcons: Record<tone, string> = {
  festive: '🎉',
  neutral: '⚪',
  primary: '🧱',
  accent: '✨',
  ceremonial: '🕯️',
  reflective: '🌙',
  elegant: '💎',
  minimal: '▫️'
};


const toneFonts: Record<tone, string> = {
    festive: "'Comic Neue', cursive",
    neutral: "'Inter', sans-serif",
    primary: "'Roboto Slab', serif",
    accent: "'Raleway', sans-serif",
    ceremonial: "'Cormorant Garamond', serif",
    reflective: "'Spectral', serif",
    elegant: "'Playfair Display', serif",
    minimal: "'Helvetica Neue', sans-serif"
  };
  



export function ToneSelect({ selectedTone, setSelectedTone }: ToneSelectProps) {
  const [open, setOpen] = useState(false);
  const tones = Object.keys(toneClasses) as tone[];

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Filter by tone</label>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm text-left ${
          selectedTone !== 'all' ? toneClasses[selectedTone] : 'bg-white text-gray-700'
        }`}
      >
        {selectedTone === 'all'
          ? 'All Tones'
          : `${toneIcons[selectedTone.toLowerCase() as tone]} ${selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)}`}
      </button>

      {open && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            marginTop: '0.25rem',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          <li
            onClick={() => {
              setSelectedTone('all');
              setOpen(false);
            }}
            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:font-semibold hover:animate-pulse cursor-pointer bg-white"
          >
            All Tones
          </li>
          {tones.map((toneKey) => (
            <li
            key={toneKey}
            onClick={() => {
              setSelectedTone(toneKey);
              setOpen(false);
            }}
            className={`px-3 py-2 text-xl cursor-pointer bg-white hover:bg-gray-100 hover:font-semibold hover:animate-pulse ${toneClasses[toneKey]}`}
            style={{ fontFamily: toneFonts[toneKey] }}
          >
            <span className="mr-2 font-semibold">{toneIcons[toneKey]}</span>
            {toneKey.charAt(0).toUpperCase() + toneKey.slice(1)}
          </li>
          ))}
        </ul>
      )}
    </div>
  );
}
