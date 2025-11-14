


import { palettes } from '@/src/types/tone';
import { tone } from '@/src/types/tone';

export function getToneDefaults(tone: tone) {
  const fill = palettes[tone]?.[0] ?? '#cccccc';

  const font =
    tone === 'ceremonial' ? 'Georgia, serif' :
    tone === 'minimal' ? '--font-inter' :
    tone === 'elegant' ? 'Playfair Display, serif' :
    '--font-sans';

  const size =
    tone === 'elegant' ? { width: 160, height: 160 } :
    tone === 'primary' ? { width: 100, height: 100 } :
    { width: 120, height: 120 };
  const stroke=fill;

  return { fill, font, size, stroke };
}
