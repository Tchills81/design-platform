
import { useElementTone } from '../elements/useElementTone';
import { toneToFont } from '@/src/types/tone';

export const useTextStylePayload = ({
  role,
  tone,
  shapeType
}: {
  role: string | null;
  tone: string | null;
  shapeType?: string | null;
}) => {
  const { textColor, highlight, fontFamily } = useElementTone({ role, tone, shapeType });

  const roleToSize: Record<string, number> = {
    heading: 32,
    subheading: 24,
    quote: 20,
    body: 16,
    caption: 14,
    cta: 18
  };

  const roleToWeight: Record<string, number> = {
    heading: 700,
    subheading: 600,
    quote: 400,
    body: 400,
    caption: 400,
    cta: 600
  };

  const fontSize = role ? roleToSize[role] ?? 16 : 16;
  const fontWeight = role ? roleToWeight[role] ?? 400 : 400;

  return {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight: 1.4,
    fill: textColor,
    highlight
  };
};
