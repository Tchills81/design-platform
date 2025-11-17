import { DualTemplate, TemplateElement } from '@/src/types/template';

export const useSelectedElement = ({
  selectedImageId,
  selectedTextId,
  template,
  side
}: {
  selectedImageId: string | null;
  selectedTextId?: string | null;
  template: DualTemplate | null;
  side: 'front' | 'back';
}) => {
  const elements = template?.[side]?.elements ?? [];

  const selectedElement =
    elements.find(el => el.id === selectedImageId) ??
    elements.find(el => el.id === selectedTextId) ??
    null;

  const isShape = selectedElement?.type === 'shape';
  const isFrame = isShape && selectedElement?.shapeType?.startsWith('frame');
  const isImage = selectedElement?.type === 'image';
  const isText = selectedElement?.type === 'text';

  return {
    selectedElement,
    isShape,
    isFrame,
    isImage,
    isText,
    type: selectedElement?.type ?? null,
    role: selectedElement?.role ?? null,
    shapeType: selectedElement?.shapeType ?? null
  };
};
