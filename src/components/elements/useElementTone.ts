import { useMemo } from 'react';
import { palettes } from '@/src/types/tone';
import { toneToFont } from '@/src/types/tone'; // ✅ import font registry

export const useElementTone = ({
  role,
  tone,
  shapeType
}: {
  role: string | null;
  tone: string | null;
  shapeType?: string | null;
}) => {
  const payload = useMemo(() => {
    const roleToPalette: Record<string, keyof typeof palettes> = {
      accent: 'accent',
      container: 'neutral',
      message: 'reflective',
      cta: 'primary',
      background: 'minimal',
      logo: 'primary',
      hero: 'elegant',
      quote: 'reflective',
      reflection: 'reflective',
      badge: 'accent',
      divider: 'minimal',
      overlay: 'minimal',
      annotation: 'accent',
      watermark: 'minimal',
      heading: 'primary',
      subheading: 'neutral',
      body: 'neutral'
    };

    const toneToPalette: Record<string, keyof typeof palettes> = {
      quiet: 'soft',
      bold: 'primary',
      playful: 'accent',
      minimal: 'neutral',
      reflective: 'reflective',
      festive: 'accent',
      elegant: 'elegant',
      celebration: 'festive',
      suggestion: 'accent',
      concern: 'reflective',
      question: 'elegant'
    };

    const tonePaletteKey = tone ? toneToPalette[tone] : null;
    const rolePaletteKey = role ? roleToPalette[role] : null;
    const paletteKey = tonePaletteKey ?? rolePaletteKey ?? 'neutral';
    const resolvedPalette = palettes[paletteKey];

    const color = resolvedPalette[0] ?? '#6b7280';
    const highlight = resolvedPalette[2] ?? '#f3f4f6';

    const isLight = (hex: string) => {
      const c = hex.replace('#', '');
      const r = parseInt(c.substr(0, 2), 16);
      const g = parseInt(c.substr(2, 2), 16);
      const b = parseInt(c.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.7;
    };

    const textColor = isLight(highlight) ? '#111827' : '#f9fafb';
    const fontFamily = tone ? toneToFont[tone] ?? 'Inter' : 'Inter';

    return {
      color,
      highlight,
      textColor,
      fontFamily, // ✅ now included
      border: shapeType?.startsWith('frame') ? 'dashed' : 'solid',
      palette: resolvedPalette
    };
  }, [role, tone, shapeType]);

  return payload;
};
