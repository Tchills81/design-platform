import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import { ELEMENT_LIBRARY } from '@/lib/elements';
import { useCanvasStore } from '../store/createCanvasStore';
import type { DesignElement } from '@/src/types/DesignElement';
import { shapeType } from '@/src/types/template';

export function useInsertShape() {
  const setDesignElement = useCanvasStore((s) => s.setDesignElement);

  const insertShape = useCallback((shapeType: string, options?: { tone?: string; x?: number; y?: number }) => {
    const preset = ELEMENT_LIBRARY.find(
      (el) => el.type === 'shape' && el.shapeType === shapeType
    );

    const id = uuid();
    const fill = options?.tone === 'accent' ? '#f43f5e' : '#0284c7';

    const element: DesignElement = {
      id,
      type: 'shape',
      shapeType:shapeType as shapeType,
      label: preset?.label ?? shapeType,
      x: options?.x ?? preset?.x ?? 200,
      y: options?.y ?? preset?.y ?? 200,
      width: preset?.width ?? 100,
      height: preset?.height ?? 100,
      fill,
      stroke: '#1e293b',
      strokeWidth: 1,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      name: 'Shape',
    };

    setDesignElement(element);
  }, [setDesignElement]);

  return { insertShape };
}
