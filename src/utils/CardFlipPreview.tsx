'use client';
import React, { useState } from 'react';

interface CardFlipPreviewProps {
  frontSnapshot: string | null;
  backSnapshot: string | null;
}

const CardFlipPreview: React.FC<CardFlipPreviewProps> = ({ frontSnapshot, backSnapshot }) => {
  const [flipped, setFlipped] = useState(false);

  if (!frontSnapshot || !backSnapshot) {
    return <div>🛑 Missing snapshots for flip preview</div>;
  }

  return (
    <div className="card-flip-container" onClick={() => setFlipped(!flipped)}>
      <div className={`card-flip ${flipped ? 'flipped' : ''}`}>
        <div className="card-face front">
          <img src={frontSnapshot} alt="Front of card" className="card-image" />
        </div>
        <div className="card-face back">
          <img src={backSnapshot} alt="Back of card" className="card-image" />
        </div>
      </div>
    </div>
  );
};

export default CardFlipPreview;
