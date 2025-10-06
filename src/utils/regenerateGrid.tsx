
import { DualTemplate } from "../types/template";
export default function regenerateGrid(template: DualTemplate, side: 'front' | 'back'): string[] {
    const face = template[side];
    if(face){

        const { width, height, cellSize, gridColors,  } = face.card;
        if(gridColors){
            const half = Math.floor(gridColors.length / 2);
            const topColor = gridColors[0];
            const bottomColor = gridColors[gridColors.length - 1];
  
    return [
      ...Array(half).fill(bottomColor),
      ...Array(gridColors.length - half).fill(topColor)
    ];

        }
        

    }

    return [];
    
  }
  