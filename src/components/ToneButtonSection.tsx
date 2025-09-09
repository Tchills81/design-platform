import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ToneButtonSectionProps {
  label: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}

export function ToneButtonSection({ label, children, initiallyOpen = true }: ToneButtonSectionProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-2 py-1 text-sm font-semibold uppercase tracking-wide rounded bg-white shadow-sm hover:shadow-md transition"
      >
        <span>{label}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="mt-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 px-1">
          {children}
        </div>
      )}
    </div>
  );
}
