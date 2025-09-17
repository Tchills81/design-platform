// ui/fonts.ts
import {
  Inter,
  Roboto_Mono,
  Open_Sans,
  Playfair_Display,
  Montserrat,
  Mountains_of_Christmas,
} from 'next/font/google';

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

export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});



export const allFonts = [
  {
    name: 'Inter',
    className: '--font-inter',
    key: 'inter',
    family: 'Inter',
  },
  {
    name: 'Roboto Mono',
    className: '--font-roboto-mono',
    key: 'robotoMono',
    family: 'Roboto Mono',
  },
  {
    name: 'Open Sans',
    className: '--font-open-sans',
    key: 'openSans',
    family: 'Open Sans',
  },
  {
    name: 'Playfair Display',
    className: '--font-playfair',
    key: 'playfair',
    family: 'Playfair Display',
  },
  {
    name: 'Montserrat',
    className: '--font-montserrat',
    key: 'montserrat',
    family: 'Montserrat',
  },


  {
    name: 'Mountains of Christmas',
    className: '--font-mountains-of-christmas',
    key: 'mountainsOfChristmas',
    family: 'Mountains of Christmas',
  },
];

  


  

