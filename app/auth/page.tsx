'use client';
import { useRouter } from 'next/navigation';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';
import AuthButton from '@/src/components/AuthButton';
import { signIn } from 'next-auth/react';

export default function AuthGateway() {
  const { heroText, backgroundClass, season } = useSeasonalTone();
  const router = useRouter();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 ${backgroundClass} fade-in`} >
      <h1 className="text-4xl font-serif text-ceremonial mb-4">🎨 {heroText}</h1>
      <p className="text-muted text-center max-w-xl mb-8 font-inter">
        Sign in to begin your expressive journey. Your assets, templates, and design history await.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
  <AuthButton
    provider="GitHub"
    icon="/icons/github.svg"
    onClick={() => signIn('github')}
    tone="primary"
  />
  <AuthButton
    provider="Apple"
    icon="/icons/apple.svg"
    onClick={() => signIn('apple')}
    tone="apple"
  />
  <AuthButton
    provider="Email"
    icon="/icons/email.svg"
    onClick={() => router.push('/auth/email')}
    tone="reflective"
  />
</div>


      <div className="mt-12 text-xs text-muted font-inter">
        Seasonal mode: <strong>{season}</strong> 🎄 | Tone: <strong>Ceremonial</strong>
      </div>
    </div>
  );
}
