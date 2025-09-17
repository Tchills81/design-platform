import { useState } from 'react';
import decorations from '../data/decorations';
import { TemplateElement } from '../types/template';
import { isTextElement } from '../types/template';

export function DecorationPicker({ onSelect }: { onSelect: (el: TemplateElement) => void }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (decoration: TemplateElement) => {
    console.log('🎀 Decoration selected:', decoration);
    onSelect(decoration);
  };

  return (
    <div className="fixed top-40 right-5 w-48 bg-white rounded shadow-lg z-50 transition-all duration-300 ease-in-out">

      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 rounded-t"
      >
        {isOpen ? 'Hide Decorations ▲' : 'Show Decorations ▼'}
      </button>

      {/* Scrollable Grid */}
      {isOpen && (
        <div className="max-h-64 overflow-y-auto p-4 grid grid-cols-1 gap-4 sticky top-0 bg-gray-100 z-10">
          {decorations.map((decoration) => {
            if (isTextElement(decoration)) return null;

            return (
              <button
                key={decoration.id}
                onClick={() => handleClick(decoration)}
                className="hover:scale-105 transition transform"
              >
                <img
                  src={decoration.src}
                  alt={decoration.role ?? 'decoration'}
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
