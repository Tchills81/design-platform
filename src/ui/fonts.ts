import {
  Inter,
  Roboto_Mono,
  Open_Sans,
  Playfair_Display,
  Montserrat,
  Mountains_of_Christmas,
  Comic_Neue,
  Anton,
  Cormorant_Garamond,
  Fredoka,
  Bebas_Neue,
  Quicksand,
  Crimson_Text,
  Spectral,
} from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
export const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono', display: 'swap' });
export const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans', display: 'swap' });
export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
export const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });
export const mountainsOfChristmas = Mountains_of_Christmas({ subsets: ['latin'], variable: '--font-mountains-of-christmas', display: 'swap', weight: ['400', '700'] });
export const comicNeue = Comic_Neue({ subsets: ['latin'], variable: '--font-comic-neue', display: 'swap', weight: ['400', '700'] });
export const anton = Anton({ subsets: ['latin'], variable: '--font-anton', display: 'swap', weight: ['400'] });
export const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', display: 'swap' });
export const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka', display: 'swap' });
export const bebas = Bebas_Neue({ subsets: ['latin'], variable: '--font-bebas-neue', display: 'swap', weight: ['400'] });
export const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand', display: 'swap' });
export const crimson = Crimson_Text({ subsets: ['latin'], variable: '--font-crimson-text', display: 'swap', weight: ['400', '700'] });
export const spectral = Spectral({ subsets: ['latin'], variable: '--font-spectral', display: 'swap', weight: ['400', '700'] });

export const allFonts = [
  { name: 'Inter', className: '--font-inter', key: 'inter', family: 'Inter' },
  { name: 'Roboto Mono', className: '--font-roboto-mono', key: 'robotoMono', family: 'Roboto Mono' },
  { name: 'Open Sans', className: '--font-open-sans', key: 'openSans', family: 'Open Sans' },
  { name: 'Playfair Display', className: '--font-playfair', key: 'playfair', family: 'Playfair Display' },
  { name: 'Montserrat', className: '--font-montserrat', key: 'montserrat', family: 'Montserrat' },
  { name: 'Mountains of Christmas', className: '--font-mountains-of-christmas', key: 'mountainsOfChristmas', family: 'Mountains of Christmas' },
  { name: 'Comic Neue', className: '--font-comic-neue', key: 'comicNeue', family: 'Comic Neue' },
  { name: 'Anton', className: '--font-anton', key: 'anton', family: 'Anton' },
  { name: 'Cormorant Garamond', className: '--font-cormorant', key: 'cormorant', family: 'Cormorant Garamond' },
  { name: 'Fredoka', className: '--font-fredoka', key: 'fredoka', family: 'Fredoka' },
  { name: 'Bebas Neue', className: '--font-bebas-neue', key: 'bebas', family: 'Bebas Neue' },
  { name: 'Quicksand', className: '--font-quicksand', key: 'quicksand', family: 'Quicksand' },
  { name: 'Crimson Text', className: '--font-crimson-text', key: 'crimson', family: 'Crimson Text' },
  { name: 'Spectral', className: '--font-spectral', key: 'spectral', family: 'Spectral' },
];



// ui/fontPairings.ts
export const FONT_PAIRS = [
  {
    label: 'Playful Whimsy',
    fonts: ['Comic Neue', 'Fredoka'],
    tone: 'playful',
    roles: ['heading', 'cta']
  },
  {
    label: 'Quiet Modern',
    fonts: ['IBM Plex Sans', 'Inter'],
    tone: 'quiet',
    roles: ['body', 'subheading']
  },
  {
    label: 'Bold Display',
    fonts: ['Anton', 'Bebas Neue'],
    tone: 'bold',
    roles: ['heading', 'cta']
  },
  {
    label: 'Elegant Serif',
    fonts: ['Cormorant Garamond', 'Playfair Display'],
    tone: 'elegant',
    roles: ['quote', 'heading']
  },
  {
    label: 'Festive Display',
    fonts: ['Mountains of Christmas', 'Fredoka'],
    tone: 'festive',
    roles: ['cta']
  },
  {
    label: 'Neutral Modern',
    fonts: ['Open Sans', 'Montserrat'],
    tone: 'minimal',
    roles: ['body', 'container']
  },
  {
    label: 'Reflective Mono',
    fonts: ['Roboto Mono', 'Crimson Text'],
    tone: 'reflective',
    roles: ['quote', 'caption']
  },
  {
    label: 'Contemplative Serif',
    fonts: ['Spectral', 'Crimson Text'],
    tone: 'question',
    roles: ['quote', 'body']
  },
  {
    label: 'Promo Sans',
    fonts: ['Bebas Neue', 'Montserrat'],
    tone: 'promo',
    roles: ['heading', 'cta']
  },
  {
    label: 'Friendly Suggestion',
    fonts: ['Quicksand', 'Open Sans'],
    tone: 'suggestion',
    roles: ['body', 'subheading']
  }
];


export const toneToFont: Record<string, string> = {
  quiet: 'Inter', // restrained, soft
  bold: 'Anton', // declarative, loud
  playful: 'Comic Neue', // whimsical, bouncy
  elegant: 'Cormorant Garamond', // refined, ceremonial
  minimal: 'Open Sans', // neutral, modern
  reflective: 'Crimson Text', // thoughtful, literary
  festive: 'Mountains of Christmas', // joyful, decorative
  celebration: 'Fredoka', // exuberant, rounded
  suggestion: 'Quicksand', // friendly, informal
  concern: 'Crimson Text', // serious, serifed
  question: 'Spectral', // contemplative, balanced
  promo: 'Bebas Neue' // promotional, bold sans
};
export const toneToFontClass: Record<string, string> = {
  quiet: '--font-inter',
  bold: '--font-anton',
  playful: '--font-comic-neue',
  elegant: '--font-cormorant',
  minimal: '--font-open-sans',
  reflective: '--font-crimson-text',
  festive: '--font-mountains-of-christmas',
  celebration: '--font-fredoka',
  suggestion: '--font-quicksand',
  concern: '--font-crimson-text',
  question: '--font-spectral',
  promo: '--font-bebas-neue'
};



  


  

