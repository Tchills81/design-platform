// src/hooks/useSeasonalTone.ts
import { seasonalPresets } from "../constants/seasonalPresets";

import { type Season } from "../types/seasons";

export function useSeasonalTone() {
    const month = new Date().getMonth();
    const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
    const currentIndex = Math.floor((month + 1) % 12 / 3);
    const current: Season = seasons[currentIndex];
    const next: Season = seasons[(currentIndex + 1) % 4];
    
  
    return {
        ...seasonalPresets[current],
        nextSeason: seasonalPresets[next],
        nextHero: seasonalPresets[next].heroText
      };
      
      
  }
  
  