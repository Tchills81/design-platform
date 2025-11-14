import { useRef } from 'react';
import { TemplateCategoryMap, TemplateSize } from '../enumarations/TemplateSize';
import { TemplateSizeLabel } from '../enumarations/TemplateSizeLabel';
import { toneClasses } from '../types/tone';
import { useSeasonalTone } from '../themes/useSeasonalTone';
import { StepBackIcon, StepForwardIcon } from 'lucide-react';
import React from 'react';

const categoryImages: Partial<Record<TemplateSize, string>> = {
  [TemplateSize.CARD_LANDSCAPE]: '/images/categories/card.jpg',
  [TemplateSize.FLYER_PORTRAIT]: '/images/categories/flyer.jpg',
  [TemplateSize.INVITE_A6]: '/images/categories/invite.jpg',
  [TemplateSize.POSTER_PORTRAIT]: '/images/categories/poster.jpg',
  [TemplateSize.GREETING_SQUARE]: '/images/categories/greeting.jpg'
};

export const CategoryStrip = React.memo(function CategoryStrip({
  selectedType,
  setSelectedType,
  toneBySize = {}
}: {
  selectedType: string;
  setSelectedType: (type: string) => void;
  toneBySize?: Record<string, string>;
}) {
  const { backgroundClass } = useSeasonalTone();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative w-full max-w-screen-xl mx-auto overflow-hidden px-4">
        {/* ⬅️ Left Arrow */}
        <button 
          onClick={() => scrollBy(-200)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-gray-700 rounded-full shadow px-2 py-1 hover:bg-gray-100"
        >
          <StepBackIcon />
        </button>

        {/* ➡️ Right Arrow */}
        <button
          onClick={() => scrollBy(200)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-gray-700 rounded-full shadow px-2 py-1 hover:bg-gray-100"
        >
          <StepForwardIcon />
        </button>

        {/* Scrollable Strip */}
        <div
          ref={scrollRef}
          className="overflow-x-scroll whitespace-nowrap scroll-smooth px-8"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            height: '120px'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {Object.entries(TemplateSizeLabel).map(([key, label]) => {
            const typedKey = key as TemplateSize;
            const imageUrl = categoryImages[typedKey];
            const categoryKey = TemplateCategoryMap[typedKey] ?? key.split('-')[0];
            const tone = toneBySize?.[categoryKey] ?? 'neutral';
            const toneClass = toneClasses[tone] ?? 'bg-gray-300 text-white';

            console.log('Rendering category', categoryKey, 'with toneClass:', toneClass, 'and categoryKey:', categoryKey);

            return (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`inline-block mr-4 rounded-l-full overflow-hidden shadow-2xs transition transform hover:scale-105 ${
                  selectedType === key ? 'ring-2 ring-white' : ''
                } ${toneClass}`}
                style={{
                  width: '25%',
                  height: '100px'
                }}
              >
                <div className={toneClass}>
                  {label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default CategoryStrip;
