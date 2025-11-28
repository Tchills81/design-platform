import { LockType } from "@/src/types/access";
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

interface UseLockProps {
  id: string | null;
  lockType: LockType; // default type to toggle against
  template: DualTemplate | null;
  setTemplate: (next: DualTemplate) => void;
  side: keyof DualTemplate;
}

export function useLock({
  id,
  lockType,
  template,
  setTemplate,
  side,
}: UseLockProps) {
  const face = template?.[side];
  const safeFace = isTemplateFace(face) ? face : null;

  // Compute current lock state safely
  const element = safeFace?.elements.find((el: TemplateElement) => el.id === id);
  const currentLock: LockType = element?.lockType ?? "none";

  const toggle = () => {
    if (!id || !template || !safeFace) return;

    const updatedElements = safeFace.elements.map((el: TemplateElement) =>
      el.id === id
        ? { ...el, lockType: currentLock === lockType ? "none" : lockType }
        : el
    );

    const updatedTemplate: DualTemplate = {
      ...template,
      [side]: { ...safeFace, elements: updatedElements },
    };

    setTemplate(updatedTemplate);
  };

  const setLockType = (type: LockType) => {
    if (!id || !template || !safeFace) return;

    const updatedElements = safeFace.elements.map((el: TemplateElement) =>
      el.id === id ? { ...el, lockType: type } : el
    );

    const updatedTemplate: DualTemplate = {
      ...template,
      [side]: { ...safeFace, elements: updatedElements },
    };

    setTemplate(updatedTemplate);
  };

  /* Debug logs for expressive clarity
  console.log("🔍 useLock invoked");
  console.log("🆔 selectedTextId:", id);
  console.log("📄 template:", template);
  console.log("🎭 side:", side);
  console.log("🧩 face:", safeFace ?? "Invalid face");
  console.log("🧩 currentLock:", currentLock);*/

  return { currentLock, toggle, setLockType };
}
