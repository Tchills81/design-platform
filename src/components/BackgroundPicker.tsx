import { useState } from 'react';
import decorations from '../data/decorations';
import backgrounds from '../data/backgrounds';
import { TemplateElement } from '../types/template';
import { isTextElement } from '../types/template';

export function BackgroundPicker({ onSelect }: { onSelect: (el: TemplateElement) => void }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (background: TemplateElement) => {
    console.log('🎀 Decoration selected:', background);
    onSelect(background);
  };

  return (
    <div className="fixed top-40 left-20 w-48 bg-white rounded shadow-lg z-50 transition-all duration-300 ease-in-out">

      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-2 font-semibold text-medium bg-gray-100 hover:bg-gray-200 rounded-t"
      >
        {isOpen ? 'Hide Backgrounds ▲' : 'Show Backgrounds ▼'}
      </button>

      {/* Scrollable Grid */}
      {isOpen && (
        <div className="max-h-64 overflow-y-auto p-4 grid grid-cols-1 gap-4 sticky top-0 bg-gray-100 z-10">
          {backgrounds.map((background) => {
            if (isTextElement(background)) return null;

            return (
              <button
                key={background.id}
                onClick={() => handleClick(background)}
                className="hover:scale-105 transition transform"
              >
                <img
                  src={background.src}
                  alt={background.role ?? 'decoration'}
                  className="w-16 h-16 object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
