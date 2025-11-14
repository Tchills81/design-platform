import { tone } from "@/src/types/tone";

interface ShapeThumbnailProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    tone:tone
  }
  
  export function ShapeThumbnail({ icon, label, onClick, tone }: ShapeThumbnailProps) {
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all
          hover:shadow-md hover:scale-105
          ${tone === 'accent' ? 'border-pink-300 bg-pink-50' : 'border-gray-200 bg-white'}`}
      >
        <div className="w-12 h-12 flex items-center justify-center text-xl text-white bg-sky-500 rounded-md">
          {icon}
        </div>
        <span className="text-xs mt-2 text-gray-700">{label}</span>
      </button>
    );
  }
  