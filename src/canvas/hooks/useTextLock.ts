import { TemplateElement, DualTemplate, TemplateFace } from "@/src/types/template";

// Type guard to ensure we're working with a valid TemplateFace
function isTemplateFace(value: unknown): value is TemplateFace {
  return (
    typeof value === "object" &&
    value !== null &&
    "elements" in value &&
    Array.isArray((value as any).elements)
  );
}

interface UseTextLockProps {
  id: string | null;
  lockedTextIds: Set<string>;
  setLockedTextIds: (next: Set<string>) => void;
  template: DualTemplate | null;
  setTemplate: (next: DualTemplate) => void;
  side: keyof DualTemplate;
}

export function useTextLock({
  id,
  lockedTextIds,
  setLockedTextIds,
  template,
  setTemplate,
  side,
}: UseTextLockProps) {
  const face = template?.[side];
  const locked = !!(id && lockedTextIds.has(id));

  const toggle = () => {
    if (!id || !template || !isTemplateFace(face)) return;

    // Update ephemeral lock state
    const nextLocked = new Set(lockedTextIds);
    nextLocked.has(id) ? nextLocked.delete(id) : nextLocked.add(id);
    setLockedTextIds(nextLocked);

    // Update persistent template lock state
    const updatedElements = face.elements.map((el: TemplateElement) =>
      el.id === id ? { ...el, locked: !locked } : el
    );

    const updatedTemplate: DualTemplate = {
      ...template,
      [side]: {
        ...face,
        elements: updatedElements,
      },
    };

    setTemplate(updatedTemplate);
  };

  // Debug logs for expressive clarity
  console.log("🔍 useTextLock invoked");
  console.log("🆔 selectedTextId:", id);
  console.log("🔒 lockedTextIds:", Array.from(lockedTextIds));
  console.log("📄 template:", template);
  console.log("🎭 side:", side);
  console.log("🧩 face:", isTemplateFace(face) ? face : "Invalid face");
  console.log("🧩 locked:", locked);

  return { locked, toggle };
}
