'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';

export default function EmailAuth() {
  const [email, setEmail] = useState('');
  const { heroText, backgroundClass, season } = useSeasonalTone();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 ${backgroundClass} fade-in`} >
      <h1 className="text-3xl font-serif text-ceremonial mb-4">📩 Sign in with Email</h1>
      <p className="text-muted text-center mb-6 font-inter">Enter your email to begin your design journey.</p>

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full max-w-sm px-4 py-3 rounded-xl border border-gray-300 shadow font-inter"
      />

      <button
        onClick={() =>
          signIn('email', {
            email,
            redirect: true,
            callbackUrl: '/auth/verify'
          })
        }
        className="btn-primary mt-6"
      >
        Continue
      </button>

      <p className="mt-12 text-xs text-muted font-inter">Tone: <strong>Ceremonial</strong></p>
    </div>
  );
}
