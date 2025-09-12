import { useState, useCallback } from 'react';

type ElementType = 'image' | 'text' | 'shape' | null;

export function useTransformMode() {
  const [transformState, setTransformState] = useState<{
    active: boolean;
    elementId: string | null;
    elementType: ElementType;
  }>({
    active: false,
    elementId: null,
    elementType: null,
  });

  const activateTransformMode = useCallback((elementId: string, elementType: ElementType) => {
    setTransformState({
      active: true,
      elementId,
      elementType,
    });
  }, []);

  const resetTransformMode = useCallback(() => {
    setTransformState({
      active: false,
      elementId: null,
      elementType: null,
    });
  }, []);

  return {
    transformModeActive: transformState.active,
    activeElementId: transformState.elementId,
    activeElementType: transformState.elementType,
    activateTransformMode,
    resetTransformMode,
  };
}

