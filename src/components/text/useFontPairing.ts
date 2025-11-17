

import { FONT_PAIRS } from '@/src/ui/fonts';

export function useFontPairing(role?: string, tone?: string) {
  const match = FONT_PAIRS.find(pair =>
    pair.tone === tone || pair.roles.includes(role ?? '')
  );

  return match?.fonts ?? ['Inter'];
}
