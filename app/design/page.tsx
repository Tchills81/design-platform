// /app/design/page.tsx
'use client';
import dynamic from 'next/dynamic';
import ToneAwareLogo from '@/src/components/ToneAwareLogo';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';

const CanvasWrapper = dynamic(() => import('@/src/canvas/CanvasWrapper'), { ssr: false });



export default function DesignPage() {
  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();
  
  return (
    <main className={`${backgroundClass}`} style={{ padding: '2rem', fontFamily: 'Inter', position: 'relative' }}>
        {/* Top Bar */}
        
      <CanvasWrapper />
    </main>
  );
}
