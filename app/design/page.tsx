// /app/design/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';
const CanvasWrapper = dynamic(() => import('@/src/canvas/CanvasWrapper'), { ssr: false });



export default function DesignPage() {
  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();
  return (
    <main style={{ padding: '2rem', fontFamily: 'Inter', position: 'relative' }} className={`relative min-h-screen px-6 py-8 ${backgroundClass}`}>
      <CanvasWrapper />
    </main>
  );
}
