import React, { useState } from 'react';
import { GroupedSnapshot } from '../utils/groupSnapshotsByTemplate';

interface Props {
  card: GroupedSnapshot;
  onExit?: () => void;
}

const CompleteCardPreview: React.FC<Props> = ({ card, onExit }) => {
  const [isOpenFront, setIsOpenFront] = useState(false);
  const [isOpenBack, setIsOpenBack] = useState(false);
  const [zoomedFace, setZoomedFace] = useState<'front' | 'insideFront' | 'back' | 'insideBack' | null>(null);



  const getZoomScale = (faceWidth: number, faceHeight: number) => {
    const padding = 80; // pixels to leave around the zoomed face
    const maxWidth = window.innerWidth - padding;
    const maxHeight = window.innerHeight - padding;
  
    const scaleX = maxWidth / faceWidth;
    const scaleY = maxHeight / faceHeight;


  
    return Math.min(scaleX, scaleY);
  };



  const scale = getZoomScale(card.front?.width ?? 1, card.front?.height ?? 1);
  

  const canvasWidth = card.front?.width || 300;
  const canvasHeight = card.front?.height || 400;

  const containerStyle = {
    width: canvasWidth,
    height: canvasHeight,
    perspective: '1000px',
  };

  const faceStyle = {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
  };

  const renderZoomedFace = () => {
    const faceMap = {
      front: card.front,
      insideFront: card.insideFront,
      back: card.back,
      insideBack: card.insideBack,
    };
  
    const face = zoomedFace ? faceMap[zoomedFace] : null;
    if (!face) return null;
  
    const scale = getZoomScale(face.width ?? 1, face.height ?? 1);
    const scaledWidth = face.width ?? 1 * scale;
    const scaledHeight = face.height ?? 1 * scale;
  
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: scaledWidth,
            height: scaledHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={face.image}
            alt={zoomedFace || ''}
            style={{
              width: face.width,
              height: face.height,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.10s ease-in-out fadeIn',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </div>
    );
  };
  
  
  

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Zoom Mode */}
      {zoomedFace ? (
        <>
          {renderZoomedFace()}
          <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setZoomedFace(null)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#93c5fd',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              🔙 Return to Dual View
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Dual Panels */}
          <div style={{ display: 'flex', gap: '2rem', transform: 'scale(0.85)', transformOrigin: 'center' }}>
            {/* Front ↔ InsideFront */}
            <div style={containerStyle}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.7s ease',
                  transform: isOpenFront ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div style={{ ...faceStyle, transform: 'rotateY(0deg)', zIndex: 2 }}>
                  <img src={card.front?.image} alt="Front" style={imageStyle} onClick={() => setZoomedFace('front')} />
                </div>
                <div style={{ ...faceStyle, transform: 'rotateY(180deg)', zIndex: 1 }}>
                  <img src={card.insideFront?.image} alt="Inside Front" style={imageStyle} onClick={() => setZoomedFace('insideFront')} />
                </div>
              </div>
            </div>

            {/* Back ↔ InsideBack */}
            <div style={containerStyle}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.7s ease',
                  transform: isOpenBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div style={{ ...faceStyle, transform: 'rotateY(0deg)', zIndex: 2 }}>
                  <img src={card.back?.image} alt="Back" style={imageStyle} onClick={() => setZoomedFace('back')} />
                </div>
                <div style={{ ...faceStyle, transform: 'rotateY(180deg)', zIndex: 1 }}>
                  <img src={card.insideBack?.image} alt="Inside Back" style={imageStyle} onClick={() => setZoomedFace('insideBack')} />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Controls */}
          <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setIsOpenFront(prev => !prev)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#c7d2fe',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              {isOpenFront ? '🔄 Close Front' : '📖 Open Front'}
            </button>

            <button
              onClick={() => setIsOpenBack(prev => !prev)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#c7d2fe',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              {isOpenBack ? '🔄 Close Back' : '📖 Open Back'}
            </button>

            {onExit && (
              <button
                onClick={onExit}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f87171',
                  color: '#fff',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                ❌ Exit Preview
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CompleteCardPreview;
