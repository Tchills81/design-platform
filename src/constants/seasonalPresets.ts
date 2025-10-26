// src/constants/seasonalPresets.ts


import { type Season } from "../types/seasons";

export interface SeasonalPreset {
  season: Season;
  heroText: string;
  logo: string;
  cta: string;
  backgroundClass: string;
}

export const seasonalPresets: Record<Season, SeasonalPreset> = {
  spring: {
    season: 'spring',
    heroText: 'Welcome to Your Blooming Design Sanctuary',
    logo: '/assets/tonva-spring.png',
    cta: 'Plant your first design seed',
    backgroundClass: 'bg-spring'
  },
  summer: {
    season: 'summer',
    heroText: 'Welcome to Your Radiant Design Sanctuary',
    logo: '/assets/tonva-spring.png',
    cta: 'Ignite your creative fire',
    backgroundClass: 'bg-summer'
  },
  autumn: {
    season: 'autumn',
    heroText: 'Welcome to Your Reflective Design Sanctuary',
    logo: '/assets/tonva-spring.png',
    cta: 'Craft your legacy with intention',
    backgroundClass: 'bg-autumn'
  },
  winter: {
    season: 'winter',
    heroText: 'Welcome to Your Quiet Design Sanctuary',
    logo: '/assets/tonva-winter.png',
    cta: 'Design with calm, create with clarity',
    backgroundClass: 'bg-winter'
  }
};
