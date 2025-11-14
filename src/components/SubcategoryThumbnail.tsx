// src/components/elements/SubcategoryThumbnail.tsx
import React from 'react';

interface SubcategoryThumbnailProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const SubcategoryThumbnail: React.FC<SubcategoryThumbnailProps> = ({
  id,
  label,
  isActive,
  onClick
}) => {
  return (
    <button
      key={id}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
