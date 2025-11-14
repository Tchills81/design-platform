// src/components/elements/getTextElementItems.ts

import { ElementItem } from '@/src/types/template';

import { getElementSubcategory } from '@/src/utils/getElementSubcategory';

export function getTextElementItems(): ElementItem[] {
  const TEXT_PRESETS = [
    { id: 'heading', label: 'Heading', previewText: 'Big Title' },
    { id: 'subheading', label: 'Subheading', previewText: 'Smaller Subtitle' },
    { id: 'body', label: 'Body Text', previewText: 'This is a paragraph of text.' },
    { id: 'quote', label: 'Quote', previewText: '“Design is a story.”' },
    { id: 'label', label: 'Label', previewText: 'Tag' }
  ];

  return TEXT_PRESETS.map((preset) => ({
    id: preset.id,
    label: preset.label,
    category: getElementSubcategory('text'),
    preview: (
      <div className="w-full h-12 bg-white border rounded-md flex items-center justify-center text-sm font-medium text-gray-800">
        {preset.previewText}
      </div>
    )
  }));
}
