import { useState } from "react";
import Tooltip from "./Tooltip";
import { toneClasses, toneFocusClasses, toneActiveClasses } from "../types/tone";

interface ToneButtonProps {
  label?: string;
  icon?: React.ReactNode;
  tone?: string;
  onClick: () => void;
  title?: string;
  isActive?: boolean | null;
  fontSize?: string;
  disabled?: boolean;
}

export const ToneButton: React.FC<ToneButtonProps> = ({
  label,
  icon,
  tone = "neutral",
  onClick,
  title,
  isActive,
  disabled,
  fontSize = "text-sm",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const toneClass = isActive ? toneActiveClasses[tone] : toneClasses[tone];
  const focusClass = toneFocusClasses[tone];
  const fontSizeClass = fontSize;
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 ${fontSizeClass} 
          font-medium rounded-md transition duration-200 ease-in-out focus:outline-none 
          focus:ring-2 focus:ring-offset-2 animate-fadeIn pulseSave 
          ${toneClass} ${focusClass} ${disabledClass}`}
      >
        {icon}
        {label && <span>{label}</span>}
      </button>

      
    </div>
  );
};
