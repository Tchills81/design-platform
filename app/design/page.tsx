// /app/design/page.tsx
'use client';
import dynamic from 'next/dynamic';
const CanvasWrapper = dynamic(() => import('@/src/canvas/CanvasWrapper'), { ssr: false });

export default function DesignPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Inter', position: 'relative' }}>
      <CanvasWrapper />
    </main>
  );
}
