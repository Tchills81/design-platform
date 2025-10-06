import { type Tab } from "../types/Tab";

interface ToneButtonProps {
  label?: string;
  icon?: React.ReactNode;
  tone?: string;
  onClick: () => void;
  title?: string; // Tooltip text
  isActive?: boolean | null;
  fontSize?: string;
  disabled?:boolean;
}

const toneFocusClasses: Record<string, string> = {
  warm: 'focus:ring-yellow-500',
  reflective: 'focus:ring-blue-500',
  minimal: 'focus:ring-gray-400',
  neutral: 'focus:ring-gray-600',
};

const toneClasses: Record<string, string> = {
  warm: 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 shadow-yellow-300',
  reflective: 'text-blue-600 bg-blue-100 hover:bg-blue-200 shadow-blue-300',
  minimal: 'text-gray-500 bg-gray-100 hover:bg-gray-200 shadow-gray-300',
  neutral: 'text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-gray-300',
  green: 'bg-green-500 text-white shadow-md',
  danger: 'bg-red-500 text-white shadow-md',
  calm: 'bg-teal-500 text-white shadow-md',
  bold: 'bg-purple-600 text-white shadow-md',

  // 🎄 Newly added tones
  festive: 'text-red-700 bg-red-100 hover:bg-red-200 shadow-red-300',
  soft: 'text-pink-600 bg-pink-100 hover:bg-pink-200 shadow-pink-300',
  elegant: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 shadow-indigo-300',
  playful: 'text-orange-600 bg-orange-100 hover:bg-orange-200 shadow-orange-300'
};


const toneActiveClasses: Record<string, string> = {
  warm: 'bg-yellow-500 text-white shadow-md',
  reflective: 'bg-blue-500 text-white shadow-md',
  minimal: 'bg-gray-500 text-white shadow-md',
  neutral: 'bg-gray-600 text-white shadow-md',
  green: 'bg-green-500 text-white shadow-md',
  danger: 'bg-red-500 text-white shadow-md',
  calm: 'bg-teal-500 text-white shadow-md',
  bold: 'bg-purple-600 text-white shadow-md'
};


export const ToneButton: React.FC<ToneButtonProps> = ({
  label,
  icon,
  tone = 'neutral',
  onClick,
  title,
  isActive,
  disabled,
  fontSize = "text-sm"
}) => {
  const toneClass = isActive
    ? toneActiveClasses[tone]
    : toneClasses[tone];

  const focusClass = toneFocusClasses[tone];
  const fontSizeClass = fontSize;

  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  return (
    <button
      onClick={onClick}
      title={title ?? label}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-1.5 ${fontSizeClass} 
        font-medium rounded-md transition duration-200 ease-in-out focus:outline-none 
        focus:ring-2 focus:ring-offset-2 animate-fadeIn pulseSave 
        ${toneClass} ${focusClass} ${disabledClass}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

