import { KonvaEventObject } from 'konva/lib/Node';

interface ShiftClickSelectionProps {
  addSelection: (id: string) => void;
  selectOnly: (id: string) => void;
  selectedIds: string[];
}

export function useShiftClickSelection({
  addSelection,
  selectOnly,
  selectedIds,
}: ShiftClickSelectionProps) {
  const handleElementClick = (e: KonvaEventObject<MouseEvent>, id: string) => {

   
    
    if (e.evt.shiftKey) {
        console.log('Shift key held down during click');
      addSelection(id); // ✅ accumulate instead of toggle
    } else {
        console.log('No Shift key during click');
      selectOnly(id);
    }

    e.cancelBubble = true; // ✅ prevent Stage dismissal firing after element click

    // console.log('useShiftClickSelection', 'selectedIds', selectedIds);
  };

  return { handleElementClick };
}
