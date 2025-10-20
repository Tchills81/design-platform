// utils/hashTemplateFace.ts
import { TemplateFace } from '@/src/types/template';

export function hashTemplateFace(face: TemplateFace): string {
  // 🧩 Step 1: Extract stable design-relevant fields
  const { card, elements } = face;

  // 🧩 Step 2: Create a stable string representation
  const serialized = JSON.stringify({ card, elements });

  // 🧩 Step 3: Hash using a simple checksum
  let hash = 0;
  for (let i = 0; i < serialized.length; i++) {
    const char = serialized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return hash.toString();
}
