interface CategoryThumbnailProps {
    id: string;
    label: string;
    preview: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
  }
  
  export  function CategoryThumbnail({ id, label, preview, isActive, onClick }: CategoryThumbnailProps) {
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-2 rounded-md border transition-all
          ${isActive ? 'border-sky-500 bg-sky-50' : 'border-transparent'}
          hover:shadow-md hover:scale-105`}
      >
        {preview}
        <span className="text-xs mt-1 text-gray-700">{label}</span>
      </button>
    );
  }
  