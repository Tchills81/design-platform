import { Sparkles, Type } from 'lucide-react';

export type ElementCategory = {
  id: string;
  label: string;
  preview: React.ReactNode;
};

export const ELEMENT_CATEGORIES: ElementCategory[] = [
  {
    id: 'shapes',
    label: 'Shapes',
    preview: (
      <div className="w-10 h-10 bg-sky-500 rounded-md flex items-center justify-center text-white text-xl">
        ◼️
      </div>
    )
  },
  {
    id: 'icons',
    label: 'Icons',
    preview: (
      <div className="w-10 h-10 bg-amber-500 rounded-md flex items-center justify-center text-white text-xl">
        ⭐
      </div>
    )
  },
  {
    id: 'text',
    label: 'Text',
    preview: (
      <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center text-white text-xl">
        <Type className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'stickers',
    label: 'Stickers',
    preview: (
      <div className="w-10 h-10 bg-pink-500 rounded-md flex items-center justify-center text-white text-xl">
        🎉
      </div>
    )
  },
  {
    id: 'frames',
    label: 'Frames',
    preview: (
      <div className="w-10 h-10 bg-purple-500 rounded-md flex items-center justify-center text-white text-xl">
        🖼️
      </div>
    )
  }
];


export const TEXT_SUBCATEGORIES = [
  { id: 'heading', label: 'Headings' },
  { id: 'subheading', label: 'Subheadings' },
  { id: 'body', label: 'Body Text' },
  { id: 'quote', label: 'Quotes' },
  { id: 'label', label: 'Labels' }
];


  export const SHAPE_SUBCATEGORIES = [
    { id: 'lines', label: 'Lines' },
    { id: 'stars', label: 'Stars' },
    { id: 'hearts', label: 'Hearts' },
    { id: 'arrows', label: 'Arrows' },
    { id: 'flowers', label: 'Flowers' }
  ];
  
  