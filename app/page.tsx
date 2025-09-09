'use client';
/**
 * Build the most emotionally intelligent, modular, and scalable design platform in the
 *  world—where enterprise meets empathy and every design is a journey worth remembering.”
 */

import dynamic from 'next/dynamic';



//const KonvaCanvas = dynamic(() => import('../src/canvas/KonvaCanvas'), { ssr: false });
const KonvaCanvas = dynamic(() => import('../src/components/temp'), { ssr: false });

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Inter', position: 'relative' }}>   

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
   
      
  {/* Header content */}

  

  
      {/* Render the canvas */}
      <KonvaCanvas />

      {/* Portal target for DOM overlays */}
      <div
        id="canvas-portal"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10
        }}
      />
    </main>
  );
}
