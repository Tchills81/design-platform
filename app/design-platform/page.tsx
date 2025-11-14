// /app/design/page.tsx
'use client';
import dynamic from 'next/dynamic';
import ToneAwareLogo from '@/src/components/ToneAwareLogo';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';

const DesignPlatformPage = dynamic(() => import('@/src/canvas/design-platform-page'), { ssr: false });



export default function DesignPage() {
  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();
  
  return (
    
        
      <DesignPlatformPage />
   
  );
}
