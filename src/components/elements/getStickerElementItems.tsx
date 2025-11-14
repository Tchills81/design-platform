import { ElementItem } from '@/src/types/template';
import { getElementSubcategory } from '@/src/utils/getElementSubcategory';

export function getStickerElementItems(): ElementItem[] {
  const STICKER_REGISTRY = [
    { id: 'celebrate', label: 'Celebrate', emoji: '🎉' },
    { id: 'gift', label: 'Gift', emoji: '🎁' },
    { id: 'balloon', label: 'Balloon', emoji: '🎈' },
    { id: 'confetti', label: 'Confetti', emoji: '✨' },
    { id: 'cake', label: 'Cake', emoji: '🍰' },
    { id: 'party-hat', label: 'Party Hat', emoji: '🥳' },
    { id: 'sparkle-heart', label: 'Sparkle Heart', emoji: '💖' },
    { id: 'fireworks', label: 'Fireworks', emoji: '🎆' },
    { id: 'snowflake', label: 'Snowflake', emoji: '❄️' },
    { id: 'pumpkin', label: 'Pumpkin', emoji: '🎃' },
    { id: 'cheers', label: 'Cheers', emoji: '🥂' },
    { id: 'confetti-ball', label: 'Confetti Ball', emoji: '🎊' },
    { id: 'sparkles', label: 'Sparkles', emoji: '🌟' },
    { id: 'ribbon', label: 'Ribbon', emoji: '🎀' },
    { id: 'tada', label: 'Tada', emoji: '🎇' }
  ];

  return STICKER_REGISTRY.map((sticker) => ({
    id: sticker.id,
    label: sticker.label,
    category: getElementSubcategory('sticker'),
    preview: (
      <div className="w-8 h-8 bg-pink-100 rounded-md flex items-center justify-center text-xl">
        {sticker.emoji}
      </div>
    ),
    emoji: sticker.emoji,
    role: 'symbol'
  })) as ElementItem[];
}
