
import { ElementItem } from '@/src/types/template';
import { supportedShapeTypes } from './shapes/types';

import { getElementSubcategory } from '@/src/utils/getElementSubcategory';

export function getShapeElementItems(): ElementItem[] {
  return Object.keys(supportedShapeTypes).map((key) => {
    let preview: React.ReactNode;

    switch (key) {
      case 'star':
        preview = (
          <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center text-white text-lg">
            ★
          </div>
        );
        break;
      case 'heart':
        preview = (
          <div className="w-8 h-8 bg-pink-500 rounded-md flex items-center justify-center text-white text-lg">
            ❤️
          </div>
        );
        break;
      case 'flower':
        preview = (
          <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center text-white text-lg">
            ✿
          </div>
        );
        break;
      case 'arrow':
        preview = (
          <div className="w-8 h-8 bg-sky-500 rounded-md flex items-center justify-center text-white text-lg">
            ➤
          </div>
        );
        break;
      case 'line':
        preview = (
          <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
            <div className="w-full h-0.5 bg-white" />
          </div>
        );
        break;
      default:
        preview = (
          <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center text-white text-sm">
            {key.charAt(0).toUpperCase()}
          </div>
        );
    }

    return {
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      category: getElementSubcategory('shape', key as any), // 🧠 symbolic grouping
      preview
    };
  });
}
