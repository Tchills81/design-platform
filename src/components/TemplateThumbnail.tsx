// components/TemplateThumbnail.tsx

import { TemplateDocument, UnifiedTemplate } from '../types/template';
import { tone } from '../types/tone';

type TemplateThumbnailProps = {
  template: UnifiedTemplate;
  tone: tone;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
};

export default function TemplateThumbnail({
  template,
  tone,
  onClick,
  size = 'medium'
}: TemplateThumbnailProps) {
  const sizeClasses = {
    small: 'w-32 h-44 text-xs',
    medium: 'w-40 h-56 text-sm',
    large: 'w-48 h-64 text-base'
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-md bg-sky-50 hover:bg-sky-100 border border-sky-200 p-2 text-left ${sizeClasses[size]}`}
    >
      <strong className="block text-sky-800">{template.document?.name}</strong>
      <p className="text-sky-600">{template.document?.sizeLabel}</p>
    </button>
  );
}
