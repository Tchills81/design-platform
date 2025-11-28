// useSelectionShortcuts.ts
import { useEffect } from 'react';

export function useSelectionShortcuts({
  clearSelection,
  addSelection,
  elements,
}: {
  clearSelection: () => void;
  addSelection: (id: string) => void;
  elements: { id: string }[];
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Esc → clear
      if (e.key === 'Escape') {
        clearSelection();
      }

      // Cmd/Ctrl + A → select all
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        elements.forEach(el => addSelection(el.id));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clearSelection, addSelection, elements]);
}
