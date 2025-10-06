'use client';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';
import { onboardingRoles } from './roles';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Link from 'next/link';

export default function OnboardingRitual() {
  const { heroText, backgroundClass, season, nextSeason } = useSeasonalTone();
  const { ref, visible } = useScrollReveal();

  return (
    <div className={`min-h-screen px-6 py-12 ${backgroundClass} fade-in`}>
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-serif text-ceremonial mb-4">🧭 Your {season} Design Ritual</h1>
        <p className="text-muted font-inter max-w-xl mx-auto mb-6">
          This season invites reflection, clarity, and expressive authorship. Choose your path to begin.
        </p>
      </header>

      {/* Role-Aware Entry Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
        {onboardingRoles.map((role, index) => (
          <Link
            key={role.id}
            href={role.action}
            className={`btn-${role.tone} link-fade`}
            style={{ animationDelay: `${0.2 + index * 0.2}s` }}
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-semibold">{role.title}</span>
              <span className="text-sm text-muted mt-1">{role.description}</span>
            </div>
          </Link>
        ))}
      </section>

      {nextSeason && (
  <section
    ref={ref}
    className={`mt-12 text-center text-muted text-sm scroll-reveal ${visible ? 'visible' : ''}`}
  >
    <p>Next ritual: <strong>{nextSeason.heroText}</strong></p>
    <img src={nextSeason.logo} alt="Next Season Logo" className="mx-auto mt-2 w-8 h-8" />
  </section>
)}

      {/* Footer */}
      <footer className="mt-6 text-xs text-muted text-center font-inter">
        Tone: <strong>Ceremonial</strong> | Season: <strong>{season}</strong>
      </footer>
    </div>
  );
}
