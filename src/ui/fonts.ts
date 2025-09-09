// ui/fonts.ts
import { Inter, Roboto_Mono, Open_Sans, Playfair_Display } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const allFonts = [
  {
    name: 'Inter',
    className: '--font-inter', // Tailwind or CSS variable class
    key: 'inter',              // Logical key for dropdown and canvas
    family: 'Inter'            // Actual font name for Konva
  },
  {
    name: 'Roboto Mono',
    className: '--font-roboto-mono',
    key: 'robotoMono',
    family: 'Roboto Mono'
  },
  {
    name: 'Open Sans',
    className: '--font-open-sans',
    key: 'openSans',
    family: 'Open Sans'
  },
  {
    name: 'Playfair Display',
    className: '--font-playfair',
    key: 'playfair',
    family: 'Playfair Display'
  }
];

