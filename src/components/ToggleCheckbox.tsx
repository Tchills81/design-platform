interface ToggleCheckboxProps {
    label: string;
    checked: boolean;
    onToggle: () => void;
    tone?: string;
    disabled?: boolean;
  }
  
  const toneFocusClasses: Record<string, string> = {
    warm: 'focus:ring-yellow-500',
    reflective: 'focus:ring-blue-500',
    minimal: 'focus:ring-gray-400',
    neutral: 'focus:ring-gray-600',
  };
  
  const toneTextClasses: Record<string, string> = {
    warm: 'text-yellow-700',
    reflective: 'text-blue-600',
    minimal: 'text-gray-500',
    neutral: 'text-gray-700',
  };
  
  export const ToggleCheckbox: React.FC<ToggleCheckboxProps> = ({
    label,
    checked,
    onToggle,
    tone = 'neutral',
    disabled = false
  }) => {
    const focusClass = toneFocusClasses[tone] ?? toneFocusClasses['neutral'];
    const textClass = toneTextClasses[tone] ?? toneTextClasses['neutral'];
    const opacityClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
    return (
      <label
        className={`flex items-center gap-2 text-sm mr-4 ${textClass} ${opacityClass}`}
        title={disabled ? 'Disabled during zoom' : `Toggle ${label.toLowerCase()}`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={disabled ? undefined : onToggle}
          disabled={disabled}
          className={`accent-current w-4 h-4 focus:outline-none focus:ring-2 focus:ring-offset-2 ${focusClass}`}
        />
        <span className="select-none">{label}</span>
      </label>
    );
  };
  