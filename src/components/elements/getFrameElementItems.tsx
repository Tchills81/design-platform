import { ElementItem } from '@/src/types/template';
import { getElementSubcategory } from '@/src/utils/getElementSubcategory';

export function getFrameElementItems(): ElementItem[] {
  const FRAME_REGISTRY = [
    { id: 'frame-basic', label: 'Basic Frame', stroke: '#1e293b', style: 'solid' },
    { id: 'frame-dashed', label: 'Dashed Frame', stroke: '#64748b', style: 'dashed' },
    { id: 'frame-rounded', label: 'Rounded Frame', stroke: '#334155', style: 'rounded' }
  ];

  return FRAME_REGISTRY.map((frame) => ({
    id: frame.id,
    label: frame.label,
    category: getElementSubcategory('frame'),
    preview: (
      <div
        className={`w-8 h-8 border-2 ${
          frame.style === 'dashed'
            ? 'border-dashed'
            : frame.style === 'rounded'
            ? 'rounded-md'
            : 'rounded-sm'
        }`}
        style={{ borderColor: frame.stroke }}
      />
    ),
    stroke: frame.stroke,
    style: frame.style,
    role: 'symbol'
  })) as ElementItem[];
}
