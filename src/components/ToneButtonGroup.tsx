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
      className={`absolute top-5 left-1/2 transform -translate-x-1/2 z-10 px-4 py-3 rounded-xl shadow-soft transition-all duration-300 ${toneBg[tone]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold tracking-wide uppercase ${toneText[tone]}`}>
          Design Controls
        </span>
        <button
          onClick={toggleExpanded}
          className="p-1.5 rounded-full border border-gray-300 hover:border-gray-500 transition duration-200 bg-white shadow-sm hover:shadow-md"
          title={isExpanded ? 'Collapse Controls' : 'Expand Controls'}
        >
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? '1000px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease-in-out',
        }}
      >
       <div className="flex gap-4 overflow-x-auto whitespace-nowrap pb-1">
        {children}
       </div>

      </div>
    </div>
  );
}
