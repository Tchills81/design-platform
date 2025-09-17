import React, { useState } from 'react';
import { GroupedSnapshot } from '../utils/groupSnapshotsByTemplate';

interface Props {
  card: GroupedSnapshot;
}

const CompleteCardPreview: React.FC<Props> = ({ card }) => {
  const [isOpenFront, setIsOpenFront] = useState(false);
  const [isOpenBack, setIsOpenBack] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex space-x-6">
        {/* Front ↔ InsideFront */}
        <div className="relative w-[200px] h-[250px] perspective">
          <div
            className="w-full h-full relative transition-transform duration-700 transform-style-preserve-3d"
            style={{ transform: isOpenFront ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* Front */}
            <img
              src={card.front?.image}
              alt="Front"
              className="absolute w-full h-full rounded shadow-md backface-hidden"
              style={{ zIndex: 2 }}
            />
            {/* Inside Front */}
            <img
              src={card.insideFront?.image}
              alt="Inside Front"
              className="absolute w-full h-full rounded shadow-md transform rotateY(180deg) backface-hidden"
              style={{ zIndex: 1 }}
            />
          </div>
        </div>

        {/* Back ↔ InsideBack */}
        <div className="relative w-[200px] h-[250px] perspective">
          <div
            className="w-full h-full relative transition-transform duration-700 transform-style-preserve-3d"
            style={{ transform: isOpenBack ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* Back */}
            <img
              src={card.back?.image}
              alt="Back"
              className="absolute w-full h-full rounded shadow-md backface-hidden"
              style={{ zIndex: 2 }}
            />
            {/* Inside Back */}
            <img
              src={card.insideBack?.image}
              alt="Inside Back"
              className="absolute w-full h-full rounded shadow-md transform rotateY(180deg) backface-hidden"
              style={{ zIndex: 1 }}
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setIsOpenFront(prev => !prev)}
          className="px-3 py-1 bg-indigo-200 hover:bg-indigo-300 rounded text-sm font-medium transition"
        >
          {isOpenFront ? '🔄 Close Front' : '📖 Open Front'}
        </button>
        <button
          onClick={() => setIsOpenBack(prev => !prev)}
          className="px-3 py-1 bg-indigo-200 hover:bg-indigo-300 rounded text-sm font-medium transition"
        >
          {isOpenBack ? '🔄 Close Back' : '📖 Open Back'}
        </button>
      </div>
    </div>
  );
};

export default CompleteCardPreview;
