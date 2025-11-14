import { useState } from 'react';
import { tone } from '../types/tone';
import { shapeType } from '../types/template';

import { getShapeElementItems } from './elements/getShapeElementItems';
import { getIconElementItems } from './elements/getIconElementItems';
import { getStickerElementItems } from './elements/getStickerElementItems';
import { getTextElementItems } from './elements/getTextElementItems';
import { getFrameElementItems } from './elements/getFrameElementItems';

import { ELEMENT_CATEGORIES, SHAPE_SUBCATEGORIES } from './elements/elementCategories';
import { CategoryThumbnail } from './elements/CategoryThumbnail';
import { ShapeThumbnail } from './elements/ShapeThumbnail';
import { SubcategoryThumbnail } from './SubcategoryThumbnail';
import { useInsertElement } from '../canvas/hooks/useInsertElement';

export interface ElementPanelContentProps {
  tone: tone;
}

export function ElementPanelContent({ tone }: ElementPanelContentProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    insertShape,
    insertText,
    insertIcon,
    insertSticker,
    insertFrame
  } = useInsertElement();

  const renderSearchBar = () => (
    <div className="px-3 pt-4">
      <input
        type="text"
        placeholder="Search shapes, icons, text..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const renderCategoryGrid = () => (
    <div className="px-3 pt-4 space-y-2">
      <h2 className="text-base font-semibold text-foreground mb-2">Browse Categories</h2>
      <div className="grid grid-cols-2 gap-4">
        {ELEMENT_CATEGORIES.map((cat) => (
          <CategoryThumbnail
            key={cat.id}
            id={cat.id}
            label={cat.label}
            preview={cat.preview}
            isActive={activeCategory === cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setActiveSubcategory(null);
              setSearchQuery('');
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderSubcategoryStrip = () => (
    <div className="flex gap-2 overflow-x-auto px-3 py-2">
      {SHAPE_SUBCATEGORIES.map((sub) => (
        <SubcategoryThumbnail
          key={sub.id}
          id={sub.id}
          label={sub.label}
          isActive={activeSubcategory === sub.id}
          onClick={() => setActiveSubcategory(sub.id)}
        />
      ))}
    </div>
  );

  const renderShapeItems = () => {
    const items = getShapeElementItems()
      .filter((el) =>
        activeSubcategory ? el.category === activeSubcategory : true
      )
      .filter((el) =>
        searchQuery ? el.label.toLowerCase().includes(searchQuery.toLowerCase()) : true
      );

    return (
      <div className="px-3 pt-4 space-y-2">
        <h2 className="text-base font-semibold text-foreground mb-2">Shapes</h2>
        {renderSubcategoryStrip()}
        <div className="grid grid-cols-3 gap-4 pt-2">
          {items.map((el) => (
            <ShapeThumbnail
              key={el.id}
              icon={el.preview}
              label={el.label}
              onClick={() => insertShape(el.id as shapeType, { tone })}
              tone={tone}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderIconItems = () => {
    const items = getIconElementItems().filter((el) =>
      searchQuery ? el.label.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

    return (
      <div className="px-3 pt-4 space-y-2">
        <h2 className="text-base font-semibold text-foreground mb-2">Icons</h2>
        <div className="grid grid-cols-3 gap-4 pt-2">
          {items.map((el) => (
            <ShapeThumbnail
              key={el.id}
              icon={el.preview}
              label={el.label}
              onClick={() =>
                insertIcon(
                  el,
                  {tone} 
                )
              }
              tone={tone}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderStickerItems = () => {
    const items = getStickerElementItems().filter((el) =>
      searchQuery ? el.label.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

    return (
      <div className="px-3 pt-4 space-y-2">
        <h2 className="text-base font-semibold text-foreground mb-2">Stickers</h2>
        <div className="grid grid-cols-3 gap-4 pt-2">
          {items.map((el) => (
            <ShapeThumbnail
              key={el.id}
              icon={el.preview}
              label={el.label}
              onClick={() =>
                insertSticker(
                  el,
                   {tone} 
                )
              }
              tone={tone}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTextItems = () => {
    const items = getTextElementItems().filter((el) =>
      searchQuery ? el.label.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

    return (
      <div className="px-3 pt-4 space-y-2">
        <h2 className="text-base font-semibold text-foreground mb-2">Text</h2>
        <div className="grid grid-cols-2 gap-4 pt-2">
          {items.map((el) => (
            <ShapeThumbnail
              key={el.id}
              icon={el.preview}
              label={el.label}
              onClick={() => insertText(el.label, { tone })}
              tone={tone}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderFrameItems = () => {
    const items = getFrameElementItems().filter((el) =>
      searchQuery ? el.label.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

    return (
      <div className="px-3 pt-4 space-y-2">
        <h2 className="text-base font-semibold text-foreground mb-2">Frames</h2>
        <div className="grid grid-cols-3 gap-4 pt-2">
          {items.map((el) => (
            <ShapeThumbnail
              key={el.id}
              icon={el.preview}
              label={el.label}
              onClick={() => insertFrame(el.id as shapeType)}
              tone={tone}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-y-auto max-h-full space-y-4">
      {renderSearchBar()}
      {!activeCategory && renderCategoryGrid()}
      {activeCategory === 'shapes' && renderShapeItems()}
      {activeCategory === 'icons' && renderIconItems()}
      {activeCategory === 'stickers' && renderStickerItems()}
      {activeCategory === 'text' && renderTextItems()}
      {activeCategory === 'frames' && renderFrameItems()}
    </div>
  );
}
