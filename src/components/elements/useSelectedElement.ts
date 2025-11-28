import { DualTemplate, TemplateElement } from '@/src/types/template';

function findElementById(elements: TemplateElement[], id: string | null): TemplateElement | null {
  if (!id) return null;
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.type === "group" && Array.isArray(el.children)) {
      const child = findElementById(el.children, id);
      if (child) return child;
    }
  }
  return null;
}

export const useSelectedElement = ({
  selectedImageId,
  selectedTextId,
  selectedGroupId,
  template,
  side,
}: {
  selectedImageId: string | null;
  selectedTextId: string | null;
  selectedGroupId: string | null;
  template: DualTemplate | null;
  side: 'front' | 'back';
}) => {
  const elements = template?.[side]?.elements ?? [];

  // Resolve priority: group > image > text
  const selectedElement =
    findElementById(elements, selectedGroupId) ??
    findElementById(elements, selectedImageId) ??
    findElementById(elements, selectedTextId) ??
    null;

  const isShape = selectedElement?.type === 'shape';
  const isFrame = isShape && selectedElement?.shapeType?.startsWith('frame');
  const isImage = selectedElement?.type === 'image';
  const isText  = selectedElement?.type === 'text';
  const isGroup = selectedElement?.type === 'group';

  /*console.log(
    'elements', elements,
    'isShape', isShape,
    'isFrame', isFrame,
    'isImage', isImage,
    'isText', isText,
    'isGroup', isGroup,
    'id', selectedGroupId
  );*/

  return {
    selectedElement,
    isShape,
    isFrame,
    isImage,
    isText,
    isGroup,
    type: selectedElement?.type ?? null,
    role: selectedElement?.role ?? (isGroup ? 'group' : null),
    shapeType: selectedElement?.shapeType ?? null,
    lockType: selectedElement?.lockType ?? null,
  };
};
