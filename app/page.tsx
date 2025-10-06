'use client';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';
import Link from 'next/link';
import ToneAwareLogo from '@/src/components/ToneAwareLogo';
import Image from 'next/image';

export default function FrontPage() {
  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();

  return (
    <main className={`relative min-h-screen px-6 py-8 ${backgroundClass}`}>
      {/* Top Bar */}
      <div className="absolute top-6 left-6 fade-in">
        <ToneAwareLogo size={64} />
      </div>

      

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center pt-32 fade-in">
        <h1 className="text-5xl font-serif text-ceremonial tracking-wide">
          🪄 {heroText}
        </h1>
        <p className="text-lg text-muted font-inter mt-2">
          Every design is a legacy. Every click, a ceremony.
        </p>
        <div className="w-12 h-1 mx-auto bg-ceremonial rounded-full mt-4 animate-pulse" />
      </div>



      <div className="absolute top-6 right-6 flex flex-row items-center gap-4 fade-in">
  
 
  <Link href="/guest" className="btn-reflective link-fade" >Continue as Guest</Link>
  <Link href="/onboarding" className="btn-accent link-fade">Explore Seasonal Ritual</Link>
  <Link href="/design" className="btn-primary link-fade">{cta}</Link>
  <Link href="/import" className="btn-primary link-fade">Upload</Link>
  <Link href="/templates" className="btn-accent link-fade">Browse</Link>
  <Link href="/auth" className="btn-muted">Sign Up / Login</Link>
</div>



      {/* Seasonal Preview */}
      <div className="mt-16 text-center text-muted text-sm fade-in">
        <p>Coming soon: <strong>{nextSeason.heroText}</strong></p>
        <Image src={nextSeason.logo} alt="Next Season Logo" width={48} height={48} />
      </div>
    </main>
  );
}
