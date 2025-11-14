// src/components/elements/getIconElementItems.ts

import { ElementItem } from '@/src/types/template';
import { getElementSubcategory } from '@/src/utils/getElementSubcategory';




export function getIconElementItems(): ElementItem[] {
  const ICON_REGISTRY = [
    { id: 'sun', label: 'Sun', emoji: '☀️' },
    { id: 'moon', label: 'Moon', emoji: '🌙' },
    { id: 'star', label: 'Star', emoji: '⭐' },
    { id: 'heart', label: 'Heart', emoji: '❤️' },
    { id: 'flower', label: 'Flower', emoji: '🌸' },
    { id: 'sparkle', label: 'Sparkle', emoji: '✨' },
    { id: 'fire', label: 'Fire', emoji: '🔥' },
    { id: 'leaf', label: 'Leaf', emoji: '🍃' },
    { id: 'cloud', label: 'Cloud', emoji: '☁️' },
    { id: 'wave', label: 'Wave', emoji: '🌊' },
    { id: 'rainbow', label: 'Rainbow', emoji: '🌈' },
    { id: 'lightning', label: 'Lightning', emoji: '⚡' },
    { id: 'snowflake', label: 'Snowflake', emoji: '❄️' },
    { id: 'globe', label: 'Globe', emoji: '🌍' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'camera', label: 'Camera', emoji: '📷' },
    { id: 'star-struck', label: 'Star-Struck', emoji: '🤩' },
    { id: 'magic', label: 'Magic', emoji: '🪄' },
    { id: 'gem', label: 'Gem', emoji: '💎' },
    { id: 'peace', label: 'Peace', emoji: '✌️' }
  ];

  return ICON_REGISTRY.map((icon) => ({
    id: icon.id,
    label: icon.label,
    category: getElementSubcategory('icon'),
    preview: (
      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xl">
        {icon.emoji}
      </div>
    ),
    // 🧠 Optional: could be used in insertText or insertElementFromDesign
    emoji: icon.emoji,
    role: 'symbol'
  })) as ElementItem[];
}

