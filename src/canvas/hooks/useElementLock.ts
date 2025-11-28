import { useSelectedElement } from "@/src/components/elements/useSelectedElement";
import { LockType } from "@/src/types/access";
import { DualTemplate, TemplateElement } from "@/src/types/template";


export function useSelectedElementLock({
  selectedImageId,
  selectedTextId,
  template,
  side,
}: {
  selectedImageId?: string | null;
  selectedTextId: string ;
  template: DualTemplate | null;
  side?: 'front' | 'back';
}) {
  const { selectedElement, role, lockType } = useSelectedElement({
    selectedImageId: selectedImageId ?? null,
    selectedTextId:selectedTextId,
    template:template ?? null,
    side:side ?? 'front',
  });

  const currentLock: LockType | undefined = lockType ?? undefined;

  const isPositionLocked =
    currentLock === "position" || currentLock === "full" || currentLock === "hierarchical";

  const isFullyLocked =
    currentLock === "full" || currentLock === "hierarchical";

  const isReplaceOnly = currentLock === "replace";

  const isStyleLocked = currentLock === "style";

  return {
    selectedElement,
    role,
    currentLock,
    isPositionLocked,
    isFullyLocked,
    isReplaceOnly,
    isStyleLocked,
  };
}
