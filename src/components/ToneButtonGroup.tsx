import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';


interface ToneButtonGroupProps {
  children: React.ReactNode;
  tone?: 'primary' | 'accent' | 'ceremonial' | 'neutral';
}

export default function ToneButtonGroup({ children, tone = 'neutral' }: ToneButtonGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [height, setHeight] = useState<string | undefined>('auto');
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = () => {
    if (isExpanded && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
      setTimeout(() => setHeight('0px'), 10);
    } else {
      setHeight('auto');
    }
    setIsExpanded((prev) => !prev);
  };

  const toneBg = {
    primary: 'bg-blue-50',
    accent: 'bg-amber-50',
    ceremonial: 'bg-purple-50',
    neutral: 'bg-gray-50',
  };

  const toneText = {
    primary: 'text-blue-600',
    accent: 'text-amber-600',
    ceremonial: 'text-purple-600',
    neutral: 'text-gray-700',
  };

  return (
    <div
    className={`absolute top-4 left-10 z-10 px-4 py-3 rounded-xl 
      shadow-soft transition-all duration-300 font-inter ${toneBg[tone]}`}
  >
    <div className="flex items-center justify-between gap-4 mb-2">
      <div className="flex gap-4 overflow-x-auto whitespace-nowrap">
        {children}
      </div>
    </div>
  
    <div
      ref={contentRef}
      style={{
        maxHeight: isExpanded ? '1000px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.4s ease-in-out',
      }}
    >
      {/* Optional expanded content goes here */}
    </div>
  </div>
  
  
  );
}
