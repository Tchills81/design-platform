'use client';
import { useState, useEffect, useRef } from 'react';

interface FoldedCardPreviewProps {
  frontSnapshot: string;
  backSnapshot: string;
  width?: number;
  height?: number;
  tone?: string;
  textClass?: string;
}

const FoldedCardPreview: React.FC<FoldedCardPreviewProps> = ({
  frontSnapshot,
  backSnapshot,
  width = 320,
  height = 220,
  tone = 'neutral',
  textClass = 'text-gray-700'
}) => {
  const [flipped, setFlipped] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const flipSoundRef = useRef<HTMLAudioElement | null>(null);

  // Preload sound
  useEffect(() => {
    flipSoundRef.current = new Audio('/assets/sounds/flipcard.mp3');
    flipSoundRef.current.volume = 0.6;
  }, []);

  // Auto flip once on mount
  useEffect(() => {
    if (!hasPlayed) {
      setFlipped(true);
      flipSoundRef.current?.play();
      const timeout = setTimeout(() => {
        setFlipped(false);
        setHasPlayed(true);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [hasPlayed]);

  // Manual flip handler
  const handleFlip = () => {
    setFlipped((prev) => !prev);
    if (flipSoundRef.current) {
      flipSoundRef.current.currentTime = 0;
      flipSoundRef.current.play();
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div
        className={`folded-card-preview shadow-lg rounded overflow-hidden ${
          flipped ? 'flipped' : ''
        }`}
        style={{ width, height }}
        onClick={handleFlip}
      >
        <div className="folded-card-inner">
          <div className="folded-card-front">
            <img src={frontSnapshot} alt="Front of card" className="w-full h-full object-contain" />
          </div>
          <div className="folded-card-back">
            <img src={backSnapshot} alt="Back of card" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
      <p className={`text-sm mt-2 text-center ${textClass}`}>
        This is what someone will see when they receive it.
      </p>
    </div>
  );
};

export default FoldedCardPreview;
