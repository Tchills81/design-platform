interface IconButtonProps {
    icon: React.ReactNode;
    tone?: string;
    onClick: () => void;
    title?: string; // Tooltip text
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
  };
  
  export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    tone = 'neutral',
    onClick,
    title
  }) => {
    const toneClass = toneClasses[tone];
    const focusClass = toneFocusClasses[tone];
  
    return (
      <button
        onClick={onClick}
        title={title}
        className={`p-2 rounded-md transition duration-200 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${toneClass} ${focusClass}`}
      >
        {icon}
      </button>
    );
  };
  