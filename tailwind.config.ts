import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],       // Primary clarity font
        serif: ['Fraunces', 'serif'],         // Ceremonial headings
        mono: ['Roboto Mono', 'monospace'],   // Utility/debug panels
      },
      colors: {
        primary: '#3B82F6',      // clarity, guidance
        accent: '#F59E0B',       // creative energy
        ceremonial: '#8B5CF6',   // legacy, reflection
        neutral: '#F3F4F6',      // calm background
        ink: '#1F2937',          // readable text
        whisper: '#FAFAFA',      // lightest background
        muted: '#6B7280',        // secondary text
        tone: {
          reflective: '#DBEAFE',
          warm: '#FEF3C7',
          minimal: '#F3F4F6',
        },
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.05)',
        glow: '0 0 0 3px rgba(139, 92, 246, 0.3)', // ceremonial glow
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      spacing: {
        'fluid': 'clamp(1rem, 2vw, 2rem)', // responsive padding
      },
      fontSize: {
        'hero': 'clamp(2rem, 5vw, 3.5rem)', // ceremonial heading
      },
      gridTemplateColumns: {
        'gallery': 'repeat(auto-fill, minmax(280px, 1fr))',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseSave: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.05)', opacity: 0.6 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        pulseSave: 'pulseSave 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
